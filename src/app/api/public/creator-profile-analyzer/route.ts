import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
  encodeCreatorPrefillToken,
  type CreatorProfilePrefill,
} from "@/server/lib/creator-profile-prefill";
import { analyzeSite } from "@/server/lib/site-analyzer";
import { enforceRateLimit } from "@/server/rate-limit";

const schema = z.object({
  url: z.string().url(),
  platform: z.enum(["linkedin", "x"]).optional(),
});

const allowedHosts = new Set([
  "linkedin.com",
  "www.linkedin.com",
  "x.com",
  "www.x.com",
  "twitter.com",
  "www.twitter.com",
]);

function inferPlatformFromUrl(url: URL): "linkedin" | "x" {
  if (url.hostname.includes("linkedin")) {
    return "linkedin";
  }

  return "x";
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40);
}

function parseProfileHandle(url: URL, platform: "linkedin" | "x") {
  const parts = url.pathname.split("/").filter(Boolean);

  if (platform === "linkedin") {
    if (parts[0] === "in" && parts[1]) {
      return parts[1];
    }

    return parts[0] ?? "";
  }

  return parts[0] ?? "";
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
      return NextResponse.json({ ok: false, error: "Invalid URL" }, { status: 400 });
    }

    const inputUrl = new URL(parsed.data.url);

    if (!allowedHosts.has(inputUrl.hostname.toLowerCase())) {
      return NextResponse.json(
        {
          ok: false,
          error: "Only LinkedIn and X profile URLs are supported right now.",
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

    const platform = parsed.data.platform ?? inferPlatformFromUrl(inputUrl);
    const analysis = await analyzeSite(parsed.data.url);
    const handle = parseProfileHandle(inputUrl, platform);
    const avatarUrl = await extractAvatarUrl(parsed.data.url);

    const prefill: CreatorProfilePrefill = {
      source_url: parsed.data.url,
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
          url: parsed.data.url,
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
