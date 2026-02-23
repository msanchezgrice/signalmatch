import "server-only";

import { z } from "zod";

const prefillChannelSchema = z.object({
  platform: z.string().min(1).max(40),
  handle: z.string().min(1).max(120),
  url: z.string().url(),
  followers: z.number().int().min(0).max(1_000_000_000),
  avg_impressions: z.number().int().min(0).max(1_000_000_000),
});

const creatorProfilePrefillSchema = z.object({
  source_url: z.string().url().optional(),
  source_platform: z.enum(["linkedin", "x"]).optional(),
  display_name: z.string().min(1).max(100).optional(),
  bio: z.string().min(1).max(600).optional(),
  avatar_url: z.string().url().optional(),
  niches: z.array(z.string().min(1).max(50)).max(8).optional(),
  audience_tags: z.array(z.string().min(1).max(50)).max(8).optional(),
  channels: z.array(prefillChannelSchema).max(3).optional(),
});

export type CreatorProfilePrefill = z.infer<typeof creatorProfilePrefillSchema>;

function dedupe(values: string[]) {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const value of values) {
    const normalized = value.trim();
    if (!normalized) {
      continue;
    }

    const key = normalized.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    output.push(normalized);
  }

  return output;
}

export function sanitizeCreatorPrefill(input: CreatorProfilePrefill) {
  const parsed = creatorProfilePrefillSchema.safeParse(input);
  if (!parsed.success) {
    return null;
  }

  const value = parsed.data;

  return {
    ...value,
    niches: value.niches ? dedupe(value.niches).slice(0, 8) : undefined,
    audience_tags: value.audience_tags ? dedupe(value.audience_tags).slice(0, 8) : undefined,
  } satisfies CreatorProfilePrefill;
}

export function encodeCreatorPrefillToken(prefill: CreatorProfilePrefill) {
  const sanitized = sanitizeCreatorPrefill(prefill);
  if (!sanitized) {
    return null;
  }

  return Buffer.from(JSON.stringify(sanitized), "utf8").toString("base64url");
}

export function decodeCreatorPrefillToken(token: string | null | undefined) {
  if (!token) {
    return null;
  }

  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const parsed = JSON.parse(raw);
    return sanitizeCreatorPrefill(parsed);
  } catch {
    return null;
  }
}

export function mergeCreatorDefaults(
  existing:
    | {
        display_name?: string | null;
        bio?: string | null;
        avatar_url?: string | null;
        niches?: string[] | null;
        audience_tags?: string[] | null;
        channels?: unknown;
      }
    | null
    | undefined,
  prefill: CreatorProfilePrefill | null,
) {
  if (!prefill) {
    return existing ?? null;
  }

  const existingNiches = (existing?.niches ?? []).filter(Boolean);
  const existingAudience = (existing?.audience_tags ?? []).filter(Boolean);
  const existingChannels = Array.isArray(existing?.channels)
    ? (existing?.channels as unknown[])
    : [];

  return {
    display_name: existing?.display_name || prefill.display_name || "",
    bio: existing?.bio || prefill.bio || "",
    avatar_url: existing?.avatar_url || prefill.avatar_url || "",
    niches: existingNiches.length > 0 ? existingNiches : prefill.niches ?? [],
    audience_tags:
      existingAudience.length > 0 ? existingAudience : prefill.audience_tags ?? [],
    channels:
      existingChannels.length > 0
        ? existingChannels
        : prefill.channels && prefill.channels.length > 0
          ? prefill.channels
          : [],
  };
}
