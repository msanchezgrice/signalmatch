import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
  CREATOR_PREFILL_COOKIE_MAX_AGE_SECONDS,
  CREATOR_PREFILL_COOKIE_NAME,
  encodeCreatorPrefillToken,
  type CreatorProfilePrefill,
} from "@/server/lib/creator-profile-prefill";
import { analyzeSite } from "@/server/lib/site-analyzer";
import { enforceRateLimit } from "@/server/rate-limit";

type Platform = "linkedin" | "x";

const schema = z.object({
  url: z.string().trim().min(1),
  platform: z.enum(["linkedin", "x"]).optional(),
});

const blockedXPaths = new Set([
  "home",
  "explore",
  "notifications",
  "messages",
  "settings",
  "search",
  "i",
  "share",
  "intent",
  "tos",
  "privacy",
]);

function normalizeHost(hostname: string) {
  return hostname.toLowerCase().replace(/^(www|m|mobile)\./, "");
}

function inferPlatformFromHost(hostname: string): Platform | null {
  const normalized = normalizeHost(hostname);

  if (normalized === "linkedin.com") {
    return "linkedin";
  }

  if (normalized === "x.com" || normalized === "twitter.com") {
    return "x";
  }

  return null;
}

function sanitizeHandle(value: string) {
  return decodeURIComponent(value).replace(/^@+/, "").trim();
}

function extractHandle(pathname: string, platform: Platform) {
  const segments = pathname.split("/").filter(Boolean);

  if (platform === "linkedin") {
    if (segments[0]?.toLowerCase() === "in" && segments[1]) {
      return sanitizeHandle(segments[1]);
    }

    return sanitizeHandle(segments[0] ?? "");
  }

  const first = sanitizeHandle(segments[0] ?? "");
  if (!first || blockedXPaths.has(first.toLowerCase())) {
    return "";
  }

  return first;
}

function isValidHandle(handle: string) {
  return /^[A-Za-z0-9._-]{2,100}$/.test(handle);
}

function normalizeProfileInput(rawInput: string, platformHint?: Platform) {
  const input = rawInput.trim();
  const directHandle = input.match(/^@?([A-Za-z0-9._-]{2,100})$/);

  if (directHandle && !input.includes(".") && !input.includes("/")) {
    const platform = platformHint ?? "x";
    const handle = sanitizeHandle(directHandle[1]);

    if (!isValidHandle(handle)) {
      return { error: "That handle format is not supported yet." as const };
    }

    const url =
      platform === "linkedin"
        ? new URL(`https://www.linkedin.com/in/${handle}`)
        : new URL(`https://x.com/${handle}`);

    return { url, platform, handle };
  }

  let candidate = input;
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return { error: "Enter a valid LinkedIn or X profile URL or handle." as const };
  }

  const platform = inferPlatformFromHost(parsed.hostname);
  if (!platform) {
    return { error: "Only LinkedIn and X profile URLs are supported right now." as const };
  }

  const handle = extractHandle(parsed.pathname, platform);
  if (!handle || !isValidHandle(handle)) {
    return { error: "Enter a profile URL that points to an actual person handle." as const };
  }

  const url =
    platform === "linkedin"
      ? new URL(`https://www.linkedin.com/in/${handle}`)
      : new URL(`https://x.com/${handle}`);

  return { url, platform, handle };
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40);
}

function splitTokens(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
}

function cleanDisplayName(title: string | null, handle: string) {
  if (!title && !handle) {
    return "";
  }

  const base = (title ?? handle)
    .replace(/\s*\(@[^)]+\)\s*\/\s*X$/i, "")
    .replace(/\s*\/\s*X$/i, "")
    .replace(/\s*\|\s*LinkedIn$/i, "")
    .replace(/\s*\|.*$/, "")
    .replace(/\s*-.*$/, "")
    .replace(/^@/, "")
    .trim();

  if (!base) {
    return handle.replace(/^@/, "");
  }

  return base.length > 100 ? base.slice(0, 100) : base;
}

function inferAudienceTags(personas: Array<{ name: string; rationale: string }>) {
  return personas
    .map((persona) => toSlug(persona.name))
    .filter(Boolean)
    .slice(0, 5);
}

const bannedTags = new Set([
  "https",
  "http",
  "www",
  "com",
  "linkedin",
  "twitter",
  "javascript",
  "available",
  "content",
  "source",
  "title",
  "url",
  "profile",
  "activity",
  "member",
  "members",
  "connections",
  "followers",
  "view",
  "when",
  "they",
  "show",
  "here",
  "more",
  "about",
  "page",
  "pages",
  "public",
  "private",
  "privacy",
  "policy",
  "terms",
  "cookie",
  "cookies",
  "join",
  "signin",
  "sign",
  "read",
  "post",
  "posts",
  "following",
  "mutual",
  "language",
  "languages",
]);

function cleanTags(tags: string[], blockedTokens: Set<string>) {
  return tags
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => {
      if (tag.length < 3 || bannedTags.has(tag)) {
        return false;
      }

      const tokenParts = tag.split("-").filter(Boolean);
      if (!tokenParts.length) {
        return false;
      }

      // Remove obvious self-referential tags like name/handle fragments.
      if (tokenParts.every((part) => blockedTokens.has(part))) {
        return false;
      }

      return true;
    })
    .slice(0, 5);
}

function selectBio(summary: string | null, keyPoints: string[]) {
  const candidate =
    summary ??
    keyPoints.find(
      (point) =>
        point.length >= 24 &&
        !/sign in|join now|skip to main/i.test(point) &&
        !/^\[.*\]\(.*\)$/.test(point),
    ) ??
    null;

  if (!candidate) {
    return undefined;
  }

  return candidate.slice(0, 300);
}

function parseHumanCount(rawValue: string, suffix?: string) {
  const numeric = Number(rawValue.replace(/,/g, ""));
  if (!Number.isFinite(numeric)) {
    return 0;
  }

  if (!suffix) {
    return Math.round(numeric);
  }

  const normalized = suffix.toLowerCase();
  if (normalized === "k") {
    return Math.round(numeric * 1_000);
  }

  if (normalized === "m") {
    return Math.round(numeric * 1_000_000);
  }

  return Math.round(numeric);
}

function extractFollowers(platform: Platform, textCandidates: string[]) {
  const corpus = textCandidates.join(" ");
  const pattern =
    /([0-9][0-9,]*(?:\.[0-9]+)?)\s*([kKmM])?\s*\+?\s*(followers?|connections?)/gi;
  let best = 0;

  for (const match of corpus.matchAll(pattern)) {
    const value = parseHumanCount(match[1] ?? "", match[2]);
    const metric = (match[3] ?? "").toLowerCase();

    if (platform === "x" && metric.startsWith("connection")) {
      continue;
    }

    if (value > best) {
      best = value;
    }
  }

  return best;
}

const toolSignals: Array<{ label: string; patterns: RegExp[] }> = [
  { label: "ChatGPT", patterns: [/\bchatgpt\b/i] },
  { label: "Claude", patterns: [/\bclaude\b/i] },
  { label: "Cursor", patterns: [/\bcursor\b/i] },
  { label: "Perplexity", patterns: [/\bperplexity\b/i] },
  { label: "Notion", patterns: [/\bnotion\b/i] },
  { label: "Canva", patterns: [/\bcanva\b/i] },
  { label: "Figma", patterns: [/\bfigma\b/i] },
  { label: "GitHub", patterns: [/\bgithub\b/i] },
  { label: "Vercel", patterns: [/\bvercel\b/i] },
  { label: "Supabase", patterns: [/\bsupabase\b/i] },
  { label: "Zapier", patterns: [/\bzapier\b/i] },
  { label: "Airtable", patterns: [/\bairtable\b/i] },
  { label: "HubSpot", patterns: [/\bhubspot\b/i] },
  { label: "Salesforce", patterns: [/\bsalesforce\b/i] },
  { label: "Stripe", patterns: [/\bstripe\b/i] },
  { label: "Google Analytics", patterns: [/\bgoogle analytics\b/i, /\bga4\b/i] },
  { label: "Meta Ads", patterns: [/\bmeta ads\b/i, /\bfacebook ads\b/i] },
  { label: "Shopify", patterns: [/\bshopify\b/i] },
  { label: "Webflow", patterns: [/\bwebflow\b/i] },
  { label: "Framer", patterns: [/\bframer\b/i] },
  { label: "CapCut", patterns: [/\bcapcut\b/i] },
  { label: "Substack", patterns: [/\bsubstack\b/i] },
  { label: "Beehiiv", patterns: [/\bbeehiiv\b/i] },
  { label: "Mailchimp", patterns: [/\bmailchimp\b/i] },
];

const personaToolDefaults: Record<string, string[]> = {
  "Startup founders": ["Notion", "Slack", "Stripe"],
  "Developers and engineers": ["GitHub", "Cursor", "Vercel"],
  "Marketers and growth teams": ["Google Analytics", "HubSpot", "Meta Ads"],
  "Sales and RevOps teams": ["HubSpot", "Salesforce", "Airtable"],
  "Creators and educators": ["Canva", "CapCut", "Substack"],
};

const personaNicheDefaults: Record<string, string[]> = {
  "Startup founders": ["startup-growth", "go-to-market", "saas"],
  "Developers and engineers": ["developer-tools", "automation", "ai-engineering"],
  "Marketers and growth teams": ["growth-marketing", "attribution", "demand-gen"],
  "Sales and RevOps teams": ["sales-ops", "pipeline", "revenue-operations"],
  "Creators and educators": ["creator-economy", "audience-growth", "content-creation"],
};

function inferNiches(
  rawTags: string[],
  personas: Array<{ name: string }>,
  blockedTokens: Set<string>,
) {
  const output = cleanTags(rawTags, blockedTokens);
  const seen = new Set(output.map((value) => value.toLowerCase()));

  if (output.length < 3) {
    for (const persona of personas) {
      const defaults = personaNicheDefaults[persona.name] ?? [];
      for (const tag of defaults) {
        const key = tag.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          output.push(tag);
        }
      }

      if (output.length >= 5) {
        break;
      }
    }
  }

  return output.slice(0, 5);
}

function inferToolStack(corpus: string, personas: Array<{ name: string }>) {
  const found: string[] = [];
  const seen = new Set<string>();

  for (const signal of toolSignals) {
    if (signal.patterns.some((pattern) => pattern.test(corpus))) {
      const key = signal.label.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        found.push(signal.label);
      }
    }
  }

  if (found.length < 3) {
    for (const persona of personas) {
      const defaults = personaToolDefaults[persona.name] ?? [];
      for (const tool of defaults) {
        const key = tool.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          found.push(tool);
        }
      }

      if (found.length >= 6) {
        break;
      }
    }
  }

  return found.slice(0, 8);
}

async function extractAvatarUrl(url: string) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
      headers: {
        "user-agent": "SignalMatchCreatorAnalyzer/1.0 (+https://www.signalmatch.me)",
        accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      return null;
    }

    const body = await response.text();

    const imageMatch =
      body.match(
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
      )?.[1] ??
      body.match(
        /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
      )?.[1] ??
      null;

    if (!imageMatch) {
      return null;
    }

    return imageMatch;
  } catch {
    return null;
  }
}

function getClientIdentifier(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for") ?? "";
  const first = forwarded.split(",")[0]?.trim();
  return first || "anonymous";
}

function resolveCookieDomain(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").split(":")[0]?.toLowerCase();
  if (!host) {
    return undefined;
  }

  if (host === "signalmatch.me" || host === "www.signalmatch.me" || host.endsWith(".signalmatch.me")) {
    return ".signalmatch.me";
  }

  return undefined;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Enter a LinkedIn or X profile URL or handle." },
        { status: 400 },
      );
    }

    const normalized = normalizeProfileInput(parsed.data.url, parsed.data.platform);
    if ("error" in normalized) {
      return NextResponse.json(
        {
          ok: false,
          error: normalized.error,
        },
        { status: 400 },
      );
    }

    const rateKey = `public-creator-profile-analyzer:${getClientIdentifier(req)}`;
    const rate = await enforceRateLimit(rateKey);
    if (!rate.ok) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again in a moment." },
        { status: 429 },
      );
    }

    const normalizedUrl = normalized.url.toString();
    const platform = normalized.platform;
    const handle = normalized.handle;
    const [analysis, avatarUrl] = await Promise.all([
      analyzeSite(normalizedUrl),
      extractAvatarUrl(normalizedUrl),
    ]);
    const displayName = cleanDisplayName(analysis.title, handle);
    const blockedTokens = new Set<string>([
      ...splitTokens(handle.replace(/[._-]/g, " ")),
      ...splitTokens(displayName),
      ...splitTokens(analysis.title ?? ""),
      platform,
    ]);
    const analysisText = [analysis.title, analysis.summary, ...analysis.key_points]
      .filter(Boolean)
      .join(" ");
    const followers = extractFollowers(platform, [analysis.summary ?? "", ...analysis.key_points]);
    const toolStack = inferToolStack(analysisText, analysis.target_personas);

    const prefill: CreatorProfilePrefill = {
      source_url: normalizedUrl,
      source_platform: platform,
      display_name: displayName,
      bio: selectBio(analysis.summary, analysis.key_points),
      avatar_url: avatarUrl ?? undefined,
      niches: inferNiches(analysis.category_tags, analysis.target_personas, blockedTokens),
      audience_tags: inferAudienceTags(analysis.target_personas),
      tool_stack: toolStack,
      channels: [
        {
          platform,
          handle,
          url: normalizedUrl,
          followers,
          avg_impressions: 0,
        },
      ],
    };

    const token = encodeCreatorPrefillToken(prefill);

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Could not prepare profile prefill." },
        { status: 500 },
      );
    }

    const response = NextResponse.json({
      ok: true,
      prefill,
      prefill_token: token,
      analysis,
    });
    const cookieDomain = resolveCookieDomain(req);

    response.cookies.set({
      name: CREATOR_PREFILL_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: CREATOR_PREFILL_COOKIE_MAX_AGE_SECONDS,
      domain: cookieDomain,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected error",
      },
      { status: 500 },
    );
  }
}
