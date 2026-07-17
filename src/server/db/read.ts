import "server-only";

import { sql } from "@/server/db";
import type {
  CampaignDirectoryItem,
  CreatorDirectoryItem,
  ProductDirectoryItem,
  UserRole,
} from "@/server/db/types";

type DirectoryFilters = {
  query?: string;
  niches?: string[];
  platforms?: string[];
  minFollowers?: number;
  maxFollowers?: number;
  verificationStatus?: "verified" | "unverified" | "any";
  limit?: number;
  offset?: number;
};

type CampaignFilters = {
  query?: string;
  tags?: string[];
  conversionType?: "signup" | "activation" | "any";
  minCpaCents?: number;
  maxCpaCents?: number;
  status?: "active" | "any";
  limit?: number;
  offset?: number;
};

export async function findUserByClerkId(clerkUserId: string) {
  const { rows } = await sql<{
    id: string;
    role: UserRole | null;
    clerk_user_id: string;
  }>(
    `select id, role, clerk_user_id
     from users
     where clerk_user_id = $1
     limit 1`,
    [clerkUserId],
  );

  return rows[0] ?? null;
}

export async function getCreatorDirectory(filters: DirectoryFilters) {
  const limit = Math.min(filters.limit ?? 20, 50);
  const offset = filters.offset ?? 0;

  const { rows } = await sql<CreatorDirectoryItem>(
    `select
      cp.id as creator_profile_id,
      cp.user_id,
      cp.display_name,
      cp.bio,
      cp.avatar_url,
      cp.niches,
      cp.audience_tags,
      cp.channels,
      cp.verification_status
    from creator_profiles cp
    join users u on u.id = cp.user_id
    where
      u.clerk_user_id not like 'seed_%'
      and
      cp.avatar_url is not null
      and cp.bio is not null
      and length(trim(cp.bio)) > 0
      and coalesce(array_length(cp.niches, 1), 0) > 0
      and jsonb_array_length(cp.channels) > 0
      and (
        $1::text is null
        or concat_ws(
          ' ',
          cp.display_name,
          cp.bio,
          array_to_string(cp.niches, ' '),
          array_to_string(cp.audience_tags, ' '),
          cp.channels::text
        ) ilike '%' || $1 || '%'
      )
      and (
        coalesce(array_length($2::text[], 1), 0) = 0
        or cp.niches && $2::text[]
      )
      and (
        $3::text = 'any'
        or cp.verification_status = $3
      )
      and (
        coalesce(array_length($4::text[], 1), 0) = 0
        or exists (
          select 1
          from jsonb_array_elements(cp.channels) ch
          where lower(ch->>'platform') = any($4::text[])
        )
      )
      and (
        $5::int is null
        or exists (
          select 1
          from jsonb_array_elements(cp.channels) ch
          where coalesce((ch->>'followers')::int, 0) >= $5
        )
      )
      and (
        $6::int is null
        or exists (
          select 1
          from jsonb_array_elements(cp.channels) ch
          where coalesce((ch->>'followers')::int, 0) <= $6
        )
      )
    order by cp.created_at desc
    limit $7
    offset $8`,
    [
      filters.query ?? null,
      filters.niches ?? [],
      filters.verificationStatus ?? "any",
      (filters.platforms ?? []).map((platform) => platform.toLowerCase()),
      filters.minFollowers ?? null,
      filters.maxFollowers ?? null,
      limit,
      offset,
    ],
  );

  return {
    creators: rows,
    nextOffset: rows.length === limit ? offset + limit : null,
  };
}

export async function getCreatorById(id: string) {
  const { rows } = await sql(
    `select
       cp.id,
       cp.display_name,
       cp.bio,
       cp.avatar_url,
       cp.niches,
       cp.audience_tags,
       cp.channels,
       cp.verification_status,
       u.role
     from creator_profiles cp
     join users u on u.id = cp.user_id
     where cp.id = $1
       and u.clerk_user_id not like 'seed_%'
     limit 1`,
    [id],
  );

  return rows[0] ?? null;
}

export async function getCampaignDirectory(filters: CampaignFilters) {
  const limit = Math.min(filters.limit ?? 20, 50);
  const offset = filters.offset ?? 0;

  const { rows } = await sql<CampaignDirectoryItem>(
    `select
      c.id as campaign_id,
      c.product_id,
      c.title,
      c.brief,
      c.target_tags,
      c.conversion_type,
      c.cpa_amount_cents,
      c.status,
      p.name as product_name,
      p.url as product_url,
      p.description as product_description,
      p.category_tags as product_category_tags,
      p.screenshot_url as product_screenshot_url,
      p.website_title as product_website_title,
      p.website_description as product_website_description,
      p.verified_at as product_verified_at,
      p.is_portfolio_owned
    from campaigns c
    join products p on p.id = c.product_id
    join users owner on owner.id = p.owner_user_id
    where
      owner.clerk_user_id not like 'seed_%'
      and lower(p.url) not like '%example.com%'
      and (
        $1::text is null
        or concat_ws(
          ' ',
          c.title,
          c.brief,
          p.name,
          p.description,
          array_to_string(c.target_tags, ' '),
          array_to_string(p.category_tags, ' ')
        ) ilike '%' || $1 || '%'
      )
      and (
        coalesce(array_length($2::text[], 1), 0) = 0
        or c.target_tags && $2::text[]
      )
      and ($3::text = 'any' or c.conversion_type = $3)
      and ($4::int is null or c.cpa_amount_cents >= $4)
      and ($5::int is null or c.cpa_amount_cents <= $5)
      and ($6::text = 'any' or c.status = $6)
    order by c.created_at desc
    limit $7
    offset $8`,
    [
      filters.query ?? null,
      filters.tags ?? [],
      filters.conversionType ?? "any",
      filters.minCpaCents ?? null,
      filters.maxCpaCents ?? null,
      filters.status ?? "any",
      limit,
      offset,
    ],
  );

  return {
    campaigns: rows,
    nextOffset: rows.length === limit ? offset + limit : null,
  };
}

export async function getCampaignById(campaignId: string) {
  const { rows } = await sql(
    `select c.*, p.name as product_name, p.url as product_url, p.owner_user_id,
            p.description as product_description,
            p.category_tags as product_category_tags,
            p.screenshot_url as product_screenshot_url,
            p.website_title as product_website_title,
            p.website_description as product_website_description,
            p.verified_at as product_verified_at,
            p.is_portfolio_owned
     from campaigns c
     join products p on p.id = c.product_id
     where c.id = $1
     limit 1`,
    [campaignId],
  );

  return rows[0] ?? null;
}

export async function getPublicCampaignById(campaignId: string) {
  const { rows } = await sql(
    `select
       c.id,
       c.title,
       c.brief,
       c.target_tags,
       c.conversion_type,
       c.cpa_amount_cents,
       c.status,
       p.id as product_id,
       p.name as product_name,
       p.url as product_url,
       p.description as product_description,
       p.category_tags as product_category_tags,
       p.screenshot_url as product_screenshot_url,
       p.website_title as product_website_title,
       p.website_description as product_website_description,
       p.verified_at as product_verified_at,
       p.is_portfolio_owned
     from campaigns c
     join products p on p.id = c.product_id
     join users owner on owner.id = p.owner_user_id
     where c.id = $1
       and c.status = 'active'
       and owner.clerk_user_id not like 'seed_%'
       and lower(p.url) not like '%example.com%'
     limit 1`,
    [campaignId],
  );

  return rows[0] ?? null;
}

export async function getProductDirectory(input?: {
  query?: string;
  limit?: number;
  offset?: number;
}) {
  const limit = Math.min(input?.limit ?? 24, 50);
  const offset = input?.offset ?? 0;
  const { rows } = await sql<ProductDirectoryItem>(
    `select
       p.id as product_id,
       p.name,
       p.url,
       p.description,
       p.category_tags,
       p.pricing_type,
       p.screenshot_url,
       p.website_title,
       p.website_description,
       p.verified_at,
       p.is_portfolio_owned,
       count(c.id)::int as campaign_count,
       coalesce(max(c.cpa_amount_cents), 0)::int as max_cpa_amount_cents
     from products p
     join users owner on owner.id = p.owner_user_id
     join campaigns c on c.product_id = p.id and c.status = 'active'
     where p.status = 'active'
       and owner.clerk_user_id not like 'seed_%'
       and lower(p.url) not like '%example.com%'
       and (
         $1::text is null
         or concat_ws(
           ' ',
           p.name,
           p.description,
           array_to_string(p.category_tags, ' ')
         ) ilike '%' || $1 || '%'
       )
     group by p.id
     order by p.verified_at desc nulls last, p.created_at desc
     limit $2 offset $3`,
    [input?.query ?? null, limit, offset],
  );

  return {
    products: rows,
    nextOffset: rows.length === limit ? offset + limit : null,
  };
}

export async function getPublicProductById(productId: string) {
  const { rows } = await sql(
    `select
       p.id as product_id,
       p.name,
       p.url,
       p.description,
       p.category_tags,
       p.pricing_type,
       p.screenshot_url,
       p.website_title,
       p.website_description,
       p.verified_at,
       p.is_portfolio_owned
     from products p
     join users owner on owner.id = p.owner_user_id
     where p.id = $1
       and p.status = 'active'
       and owner.clerk_user_id not like 'seed_%'
       and lower(p.url) not like '%example.com%'
       and exists (
         select 1 from campaigns c
         where c.product_id = p.id and c.status = 'active'
       )
     limit 1`,
    [productId],
  );

  return rows[0] ?? null;
}

export async function getPublicCampaignsByProductId(productId: string) {
  const { rows } = await sql<CampaignDirectoryItem>(
    `select
       c.id as campaign_id,
       c.product_id,
       c.title,
       c.brief,
       c.target_tags,
       c.conversion_type,
       c.cpa_amount_cents,
       c.status,
       p.name as product_name,
       p.url as product_url,
       p.description as product_description,
       p.category_tags as product_category_tags,
       p.screenshot_url as product_screenshot_url,
       p.website_title as product_website_title,
       p.website_description as product_website_description,
       p.verified_at as product_verified_at,
       p.is_portfolio_owned
     from campaigns c
     join products p on p.id = c.product_id
     join users owner on owner.id = p.owner_user_id
     where c.product_id = $1
       and c.status = 'active'
       and owner.clerk_user_id not like 'seed_%'
     order by c.created_at desc`,
    [productId],
  );

  return rows;
}

export async function getBuilderProducts(builderUserId: string) {
  const { rows } = await sql(
    `select *
     from products
     where owner_user_id = $1
     order by created_at desc`,
    [builderUserId],
  );

  return rows;
}

export async function getBuilderCampaigns(builderUserId: string, status?: string) {
  const { rows } = await sql(
    `select c.*, p.name as product_name
     from campaigns c
     join products p on p.id = c.product_id
     where p.owner_user_id = $1
       and ($2::text is null or $2 = 'any' or c.status = $2)
     order by c.created_at desc`,
    [builderUserId, status ?? null],
  );

  return rows;
}

export async function getBuilderLaunchStatus(builderUserId: string) {
  const { rows } = await sql<{
    has_product: boolean;
    has_tracking_key: boolean;
    has_campaign: boolean;
    has_funded_campaign: boolean;
    has_creator_invite: boolean;
    has_conversion: boolean;
  }>(
    `select
      exists(select 1 from products p where p.owner_user_id = $1) as has_product,
      exists(select 1 from products p where p.owner_user_id = $1 and p.conversion_api_key_hash is not null) as has_tracking_key,
      exists(select 1 from campaigns c join products p on p.id = c.product_id where p.owner_user_id = $1) as has_campaign,
      exists(select 1 from campaigns c join products p on p.id = c.product_id where p.owner_user_id = $1 and c.budget_total_cents > 0) as has_funded_campaign,
      exists(select 1 from partnerships pr join campaigns c on c.id = pr.campaign_id join products p on p.id = c.product_id where p.owner_user_id = $1) as has_creator_invite,
      exists(select 1 from conversions cv join partnerships pr on pr.id = cv.partnership_id join campaigns c on c.id = pr.campaign_id join products p on p.id = c.product_id where p.owner_user_id = $1) as has_conversion`,
    [builderUserId],
  );

  return rows[0] ?? {
    has_product: false,
    has_tracking_key: false,
    has_campaign: false,
    has_funded_campaign: false,
    has_creator_invite: false,
    has_conversion: false,
  };
}

export async function getCampaignPartnershipsForBuilder(
  builderUserId: string,
  campaignId: string,
) {
  const { rows } = await sql(
    `select
      pr.*,
      cp.display_name,
      cp.channels
     from partnerships pr
     join campaigns c on c.id = pr.campaign_id
     join products p on p.id = c.product_id
     join users u on u.id = pr.creator_user_id
     left join creator_profiles cp on cp.user_id = u.id
     where p.owner_user_id = $1
       and pr.campaign_id = $2
     order by pr.created_at desc`,
    [builderUserId, campaignId],
  );

  return rows;
}

export async function getCampaignConversionsForBuilder(
  builderUserId: string,
  campaignId: string,
) {
  const { rows } = await sql(
    `select
      cv.*,
      pr.ref_code
     from conversions cv
     join partnerships pr on pr.id = cv.partnership_id
     join campaigns c on c.id = pr.campaign_id
     join products p on p.id = c.product_id
     where p.owner_user_id = $1
       and c.id = $2
     order by cv.created_at desc`,
    [builderUserId, campaignId],
  );

  return rows;
}

export async function getMyCampaignAnalytics(builderUserId: string, campaignId: string) {
  const { rows } = await sql<{
    clicks: string;
    pending_conversions: string;
    approved_conversions: string;
    rejected_conversions: string;
    total_paid_out_cents: string;
    budget_available_cents: number;
  }>(
    `select
      coalesce((select count(*) from click_events ce join partnerships pr on pr.ref_code = ce.ref_code where pr.campaign_id = c.id), 0)::text as clicks,
      coalesce((select count(*) from conversions cv where cv.partnership_id in (select id from partnerships where campaign_id = c.id) and cv.status = 'pending'), 0)::text as pending_conversions,
      coalesce((select count(*) from conversions cv where cv.partnership_id in (select id from partnerships where campaign_id = c.id) and cv.status = 'approved'), 0)::text as approved_conversions,
      coalesce((select count(*) from conversions cv where cv.partnership_id in (select id from partnerships where campaign_id = c.id) and cv.status = 'rejected'), 0)::text as rejected_conversions,
      coalesce((select sum(amount_cents) from payouts py where py.campaign_id = c.id and py.status = 'paid'), 0)::text as total_paid_out_cents,
      c.budget_available_cents
     from campaigns c
     join products p on p.id = c.product_id
     where p.owner_user_id = $1
       and c.id = $2
     limit 1`,
    [builderUserId, campaignId],
  );

  return rows[0] ?? null;
}

export async function getCreatorProfileByUserId(userId: string) {
  const { rows } = await sql(
    `select * from creator_profiles where user_id = $1 limit 1`,
    [userId],
  );

  return rows[0] ?? null;
}

export async function getCreatorDeals(userId: string) {
  const { rows } = await sql(
    `select c.*, p.name as product_name, p.url as product_url
     from campaigns c
     join products p on p.id = c.product_id
     where c.status = 'active'
       and not exists (
         select 1
         from partnerships pr
         where pr.campaign_id = c.id
           and pr.creator_user_id = $1
       )
     order by c.created_at desc`,
    [userId],
  );

  return rows;
}

export async function getCreatorPartnerships(userId: string) {
  const { rows } = await sql(
    `select
      pr.*,
      c.title,
      p.name as product_name,
      p.url as product_url,
      c.cpa_amount_cents
     from partnerships pr
     join campaigns c on c.id = pr.campaign_id
     join products p on p.id = c.product_id
     where pr.creator_user_id = $1
     order by pr.created_at desc`,
    [userId],
  );

  return rows;
}

export async function getCreatorPayouts(userId: string) {
  const { rows } = await sql(
    `select py.*, c.title
     from payouts py
     join campaigns c on c.id = py.campaign_id
     where py.creator_user_id = $1
     order by py.created_at desc`,
    [userId],
  );

  return rows;
}

export async function getCreatorStripeAccount(userId: string) {
  const { rows } = await sql<{ stripe_account_id: string | null }>(
    `select stripe_account_id from creator_profiles where user_id = $1 limit 1`,
    [userId],
  );

  return rows[0]?.stripe_account_id ?? null;
}

export async function getAdminOverview() {
  const [creators, campaigns, payouts] = await Promise.all([
    sql<{ count: string }>(`select count(*)::text as count from creator_profiles where verification_status = 'unverified'`),
    sql<{ count: string }>(`select count(*)::text as count from campaigns where status = 'draft'`),
    sql<{ count: string }>(`select count(*)::text as count from payouts where status = 'due'`),
  ]);

  return {
    unverifiedCreators: Number(creators.rows[0]?.count ?? 0),
    draftCampaigns: Number(campaigns.rows[0]?.count ?? 0),
    duePayouts: Number(payouts.rows[0]?.count ?? 0),
  };
}

export async function getCreatorsForAdmin() {
  const { rows } = await sql(
    `select cp.id, cp.display_name, cp.verification_status, cp.created_at
     from creator_profiles cp
     order by cp.created_at desc
     limit 100`,
  );

  return rows;
}

export async function getCampaignsForAdmin() {
  const { rows } = await sql(
    `select c.id, c.title, c.status, c.created_at
     from campaigns c
     order by c.created_at desc
     limit 100`,
  );

  return rows;
}
