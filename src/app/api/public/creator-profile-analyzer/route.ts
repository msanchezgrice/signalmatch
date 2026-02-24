import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
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
]);

function cleanTags(tags: string[]) {
  return tags
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length >= 3 && !bannedTags.has(tag))
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
    const analysis = await analyzeSite(normalizedUrl);
    const avatarUrl = await extractAvatarUrl(normalizedUrl);

    const prefill: CreatorProfilePrefill = {
      source_url: normalizedUrl,
      source_platform: platform,
      display_name: cleanDisplayName(analysis.title, handle),
      bio: selectBio(analysis.summary, analysis.key_points),
      avatar_url: avatarUrl ?? undefined,
      niches: cleanTags(analysis.category_tags),
      audience_tags: inferAudienceTags(analysis.target_personas),
      channels: [
        {
          platform,
          handle,
          url: normalizedUrl,
          followers: 0,
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

    return NextResponse.json({
      ok: true,
      prefill,
      prefill_token: token,
      analysis,
    });
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
