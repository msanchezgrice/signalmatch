import { z } from "zod";

export const roleSchema = z.enum(["CREATOR", "BUILDER", "ADMIN"]);

export const creatorProfileSchema = z.object({
  display_name: z.string().min(2),
  bio: z.string().max(600).optional(),
  avatar_url: z.string().url().optional(),
  niches: z.array(z.string()).default([]),
  audience_tags: z.array(z.string()).default([]),
  channels: z
    .array(
      z.object({
        platform: z.string().min(1),
        handle: z.string().min(1),
        url: z.string().url(),
        followers: z.number().int().min(0),
        avg_impressions: z.number().int().min(0),
      }),
    )
    .min(1),
});

export const productSchema = z.object({
  name: z.string().min(2),
  url: z.string().url(),
  description: z.string().max(1000).optional(),
  category_tags: z.array(z.string()).default([]),
  pricing_type: z.enum(["free", "freemium", "paid"]).default("freemium"),
});

export const campaignSchema = z.object({
  product_id: z.string().uuid(),
  title: z.string().min(3),
  brief: z.string().max(1500).optional(),
  target_tags: z.array(z.string()).default([]),
  conversion_type: z.enum(["signup", "activation"]).default("signup"),
  payout_model: z.enum(["cpa"]).default("cpa"),
  cpa_amount_cents: z.number().int().nonnegative(),
  approval_mode: z.enum(["auto", "manual"]).default("auto"),
  approval_timeout_days: z.number().int().min(1).max(30).default(7),
  budget_total_cents: z.number().int().nonnegative(),
  budget_available_cents: z.number().int().nonnegative(),
  status: z.enum(["draft", "active", "paused", "ended"]).default("draft"),
});

export const inviteSchema = z.object({
  creator_user_id: z.string().uuid(),
  terms_snapshot: z.record(z.string(), z.unknown()).default({}),
});

export const conversionSchema = z.object({
  ref_code: z.string().min(4),
  event_type: z.enum(["signup", "activation"]),
  external_user_id: z.string().max(200).optional(),
  idempotency_key: z.string().max(200).optional(),
});

export const searchCreatorsSchema = z.object({
  query: z.string().optional(),
  niches: z.array(z.string()).default([]),
  platforms: z.array(z.string()).default([]),
  min_followers: z.number().int().optional(),
  max_followers: z.number().int().optional(),
  verification_status: z
    .enum(["verified", "unverified", "any"])
    .default("any"),
  limit: z.number().int().min(1).max(50).default(20),
  offset: z.number().int().nonnegative().default(0),
});

export const searchCampaignsSchema = z.object({
  query: z.string().optional(),
  tags: z.array(z.string()).default([]),
  conversion_type: z.enum(["signup", "activation", "any"]).default("any"),
  min_cpa_cents: z.number().int().nonnegative().optional(),
  max_cpa_cents: z.number().int().nonnegative().optional(),
  status: z.enum(["active", "any"]).default("any"),
  limit: z.number().int().min(1).max(50).default(20),
  offset: z.number().int().nonnegative().default(0),
});
