export type UserRole = "CREATOR" | "BUILDER";

export type CreatorChannel = {
  platform: string;
  handle?: string;
  url?: string;
  followers: number;
  avg_impressions: number;
};

export type CreatorDirectoryItem = {
  creator_profile_id: string;
  user_id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  niches: string[];
  audience_tags: string[];
  channels: CreatorChannel[];
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
