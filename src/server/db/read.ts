import "server-only";

import { sql } from "@/server/db";
import type {
  CampaignDirectoryItem,
  CreatorDirectoryItem,
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
      cp.niches,
      cp.channels,
      cp.verification_status
    from creator_profiles cp
    where
      ($1::text is null or cp.display_name ilike '%' || $1 || '%')
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
          where ch->>'platform' = any($4::text[])
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
      filters.platforms ?? [],
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
    `select cp.*, u.role
     from creator_profiles cp
     join users u on u.id = cp.user_id
     where cp.id = $1
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
      p.url as product_url
    from campaigns c
    join products p on p.id = c.product_id
    where
      ($1::text is null or c.title ilike '%' || $1 || '%')
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
    `select c.*, p.name as product_name, p.url as product_url, p.owner_user_id
     from campaigns c
     join products p on p.id = c.product_id
     where c.id = $1
     limit 1`,
    [campaignId],
  );

  return rows[0] ?? null;
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
