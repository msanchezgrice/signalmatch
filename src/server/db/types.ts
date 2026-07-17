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
  product_description: string | null;
  product_category_tags: string[];
  product_screenshot_url: string | null;
  product_website_title: string | null;
  product_website_description: string | null;
  product_verified_at: string | null;
  is_portfolio_owned: boolean;
};

export type ProductDirectoryItem = {
  product_id: string;
  name: string;
  url: string;
  description: string | null;
  category_tags: string[];
  pricing_type: "free" | "freemium" | "paid";
  screenshot_url: string | null;
  website_title: string | null;
  website_description: string | null;
  verified_at: string | null;
  is_portfolio_owned: boolean;
  campaign_count: number;
  max_cpa_amount_cents: number;
};
