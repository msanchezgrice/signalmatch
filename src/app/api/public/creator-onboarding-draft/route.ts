import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
  CREATOR_PREFILL_COOKIE_MAX_AGE_SECONDS,
  CREATOR_PREFILL_COOKIE_NAME,
  encodeCreatorPrefillToken,
  type CreatorProfilePrefill,
} from "@/server/lib/creator-profile-prefill";
import { enforceRateLimit } from "@/server/rate-limit";

const channelSchema = z.object({
  platform: z.string().min(1).max(40),
  handle: z.string().min(1).max(120),
  url: z.string().url(),
  followers: z.number().int().min(0).max(1_000_000_000),
  avg_impressions: z.number().int().min(0).max(1_000_000_000),
});

const schema = z.object({
  display_name: z.string().min(2).max(100),
  bio: z.string().max(600).optional(),
  avatar_url: z.string().url().optional(),
  niches: z.array(z.string().min(1).max(50)).max(8).optional(),
  audience_tags: z.array(z.string().min(1).max(50)).max(8).optional(),
  tool_stack: z.array(z.string().min(1).max(50)).max(12).optional(),
  channels: z.array(channelSchema).min(1).max(3),
  source_platform: z.enum(["linkedin", "x"]).optional(),
  source_url: z.string().url().optional(),
});

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
    const rateKey = `public-creator-onboarding-draft:${getClientIdentifier(req)}`;
    const rate = await enforceRateLimit(rateKey);
    if (!rate.ok) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again in a moment." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Please complete all required onboarding fields." },
        { status: 400 },
      );
    }

    const prefill: CreatorProfilePrefill = {
      source_platform: parsed.data.source_platform,
      source_url: parsed.data.source_url,
      display_name: parsed.data.display_name,
      bio: parsed.data.bio,
      avatar_url: parsed.data.avatar_url,
      niches: parsed.data.niches ?? [],
      audience_tags: parsed.data.audience_tags ?? [],
      tool_stack: parsed.data.tool_stack ?? [],
      channels: parsed.data.channels,
    };

    const token = encodeCreatorPrefillToken(prefill);
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Could not prepare onboarding draft." },
        { status: 500 },
      );
    }

    const response = NextResponse.json({ ok: true });
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
      { ok: false, error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
