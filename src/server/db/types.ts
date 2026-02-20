export type UserRole = "CREATOR" | "BUILDER" | "ADMIN";

export type CreatorDirectoryItem = {
  creator_profile_id: string;
  user_id: string;
  display_name: string;
  niches: string[];
  channels: Array<{ platform: string; followers: number; avg_impressions: number }>;
  verification_status: "verified" | "unverified";
};

export type CampaignDirectoryItem = {
  campaign_id: string;
  product_id: string;
  title: string;
  brief: string | null;
  target_tags: string[];
  conversion_type: "signup" | "activation";
  cpa_amount_cents: number;
  status: "draft" | "active" | "paused" | "ended";
  product_name: string;
  product_url: string;
};
