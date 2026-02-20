import "server-only";

import type { PoolClient } from "pg";

import { sql, withTransaction } from "@/server/db";
import { generateRefCode } from "@/server/ref-code";

export async function createUserIfMissing(clerkUserId: string) {
  const { rows } = await sql<{ id: string; role: string | null }>(
    `insert into users (clerk_user_id, role)
     values ($1, null)
     on conflict (clerk_user_id)
     do update set clerk_user_id = excluded.clerk_user_id
     returning id, role`,
    [clerkUserId],
  );

  return rows[0];
}

export async function deleteUserByClerkId(clerkUserId: string) {
  await sql(`delete from users where clerk_user_id = $1`, [clerkUserId]);
}

export async function setUserRole(userId: string, role: "CREATOR" | "BUILDER" | "ADMIN") {
  await sql(`update users set role = $2 where id = $1`, [userId, role]);
}

export async function upsertCreatorProfile(input: {
  userId: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  niches?: string[];
  audienceTags?: string[];
  channels: Array<{
    platform: string;
    handle: string;
    url: string;
    followers: number;
    avg_impressions: number;
  }>;
}) {
  const { rows } = await sql(
    `insert into creator_profiles (
      user_id,
      display_name,
      bio,
      avatar_url,
      niches,
      audience_tags,
      channels
    ) values ($1, $2, $3, $4, $5, $6, $7::jsonb)
    on conflict (user_id)
    do update set
      display_name = excluded.display_name,
      bio = excluded.bio,
      avatar_url = excluded.avatar_url,
      niches = excluded.niches,
      audience_tags = excluded.audience_tags,
      channels = excluded.channels,
      updated_at = now()
    returning *`,
    [
      input.userId,
      input.displayName,
      input.bio ?? null,
      input.avatarUrl ?? null,
      input.niches ?? [],
      input.audienceTags ?? [],
      JSON.stringify(input.channels),
    ],
  );

  return rows[0];
}

export async function createProduct(input: {
  ownerUserId: string;
  name: string;
  url: string;
  description?: string;
  categoryTags?: string[];
  pricingType: "free" | "freemium" | "paid";
  conversionApiKeyHash?: string;
}) {
  const { rows } = await sql(
    `insert into products (
      owner_user_id,
      name,
      url,
      description,
      category_tags,
      pricing_type,
      conversion_api_key_hash
    ) values ($1, $2, $3, $4, $5, $6, $7)
    returning *`,
    [
      input.ownerUserId,
      input.name,
      input.url,
      input.description ?? null,
      input.categoryTags ?? [],
      input.pricingType,
      input.conversionApiKeyHash ?? null,
    ],
  );

  return rows[0];
}

export async function rotateProductApiKey(productId: string, hash: string) {
  await sql(
    `update products set conversion_api_key_hash = $2, updated_at = now() where id = $1`,
    [productId, hash],
  );
}

export async function createCampaign(input: {
  productId: string;
  title: string;
  brief?: string;
  targetTags?: string[];
  conversionType: "signup" | "activation";
  payoutModel: "cpa";
  cpaAmountCents: number;
  approvalMode: "auto" | "manual";
  approvalTimeoutDays: number;
  budgetTotalCents: number;
  budgetAvailableCents: number;
  status: "draft" | "active" | "paused" | "ended";
}) {
  const { rows } = await sql(
    `insert into campaigns (
      product_id,
      title,
      brief,
      target_tags,
      conversion_type,
      payout_model,
      cpa_amount_cents,
      approval_mode,
      approval_timeout_days,
      budget_total_cents,
      budget_available_cents,
      status
    ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    returning *`,
    [
      input.productId,
      input.title,
      input.brief ?? null,
      input.targetTags ?? [],
      input.conversionType,
      input.payoutModel,
      input.cpaAmountCents,
      input.approvalMode,
      input.approvalTimeoutDays,
      input.budgetTotalCents,
      input.budgetAvailableCents,
      input.status,
    ],
  );

  return rows[0];
}

export async function inviteCreatorToCampaign(input: {
  campaignId: string;
  creatorUserId: string;
  termsSnapshot: Record<string, unknown>;
}) {
  let attempts = 0;

  while (attempts < 3) {
    attempts += 1;

    try {
      const { rows } = await sql(
        `insert into partnerships (
          campaign_id,
          creator_user_id,
          status,
          ref_code,
          terms_snapshot
        ) values ($1,$2,'invited',$3,$4::jsonb)
        on conflict (campaign_id, creator_user_id)
        do update set terms_snapshot = excluded.terms_snapshot, updated_at = now()
        returning *`,
        [
          input.campaignId,
          input.creatorUserId,
          generateRefCode(),
          JSON.stringify(input.termsSnapshot),
        ],
      );

      return rows[0];
    } catch (error) {
      if (attempts >= 3) {
        throw error;
      }
    }
  }

  throw new Error("Could not create partnership");
}

export async function acceptPartnership(partnershipId: string, creatorUserId: string) {
  const { rows } = await sql(
    `update partnerships
     set status = 'active', updated_at = now()
     where id = $1
       and creator_user_id = $2
       and status in ('invited', 'accepted')
     returning *`,
    [partnershipId, creatorUserId],
  );

  return rows[0] ?? null;
}

export async function logClick(refCode: string, input: { userAgentHash?: string; ipHash?: string }) {
  await sql(
    `insert into click_events (ref_code, user_agent_hash, ip_hash)
     values ($1, $2, $3)`,
    [refCode, input.userAgentHash ?? null, input.ipHash ?? null],
  );
}

export async function findPartnershipByRefCode(refCode: string) {
  const { rows } = await sql(
    `select
      pr.*,
      c.id as campaign_id,
      c.conversion_type,
      c.cpa_amount_cents,
      c.approval_mode,
      c.budget_available_cents,
      c.budget_total_cents,
      p.id as product_id,
      p.url as product_url,
      p.conversion_api_key_hash
     from partnerships pr
     join campaigns c on c.id = pr.campaign_id
     join products p on p.id = c.product_id
     where pr.ref_code = $1
     limit 1`,
    [refCode],
  );

  return rows[0] ?? null;
}

export async function findProductByApiKeyHash(hash: string) {
  const { rows } = await sql<{ id: string; owner_user_id: string }>(
    `select id, owner_user_id from products where conversion_api_key_hash = $1 limit 1`,
    [hash],
  );

  return rows[0] ?? null;
}

async function createApprovedPayout(
  client: PoolClient,
  args: {
    creatorUserId: string;
    campaignId: string;
    conversionId: string;
    payoutAmountCents: number;
  },
) {
  const payout = await client.query(
    `insert into payouts (
      creator_user_id,
      campaign_id,
      conversion_id,
      amount_cents,
      status
    ) values ($1,$2,$3,$4,'due')
    returning *`,
    [
      args.creatorUserId,
      args.campaignId,
      args.conversionId,
      args.payoutAmountCents,
    ],
  );

  return payout.rows[0];
}

export async function createConversionWithBudgetCheck(input: {
  partnershipId: string;
  creatorUserId: string;
  campaignId: string;
  eventType: "signup" | "activation";
  externalUserId?: string;
  idempotencyKey?: string;
  payoutAmountCents: number;
  approvalMode: "auto" | "manual";
}) {
  return withTransaction(async (client) => {
    const campaignResult = await client.query<{
      budget_available_cents: number;
    }>(
      `select budget_available_cents
       from campaigns
       where id = $1
       for update`,
      [input.campaignId],
    );

    const campaign = campaignResult.rows[0];
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    const conversionStatus =
      input.approvalMode === "auto" ? "approved" : "pending";

    const conversionResult = await client.query(
      `insert into conversions (
        partnership_id,
        event_type,
        external_user_id,
        idempotency_key,
        status,
        payout_amount_cents
      ) values ($1,$2,$3,$4,$5,$6)
      returning *`,
      [
        input.partnershipId,
        input.eventType,
        input.externalUserId ?? null,
        input.idempotencyKey ?? null,
        conversionStatus,
        input.payoutAmountCents,
      ],
    );

    const conversion = conversionResult.rows[0];

    let payout: any = null;

    if (
      conversionStatus === "approved" &&
      campaign.budget_available_cents >= input.payoutAmountCents
    ) {
      await client.query(
        `update campaigns
         set budget_available_cents = budget_available_cents - $2,
             updated_at = now()
         where id = $1`,
        [input.campaignId, input.payoutAmountCents],
      );

      payout = await createApprovedPayout(client, {
        creatorUserId: input.creatorUserId,
        campaignId: input.campaignId,
        conversionId: conversion.id,
        payoutAmountCents: input.payoutAmountCents,
      });
    }

    return { conversion, payout };
  });
}

export async function markConversionApproved(conversionId: string, builderUserId: string) {
  return withTransaction(async (client) => {
    const conversionResult = await client.query(
      `select cv.*, pr.creator_user_id, pr.campaign_id, c.cpa_amount_cents
       from conversions cv
       join partnerships pr on pr.id = cv.partnership_id
       join campaigns c on c.id = pr.campaign_id
       join products p on p.id = c.product_id
       where cv.id = $1 and p.owner_user_id = $2
       for update`,
      [conversionId, builderUserId],
    );

    const conversion = conversionResult.rows[0];
    if (!conversion || conversion.status !== "pending") {
      return null;
    }

    const campaignBudgetResult = await client.query<{ budget_available_cents: number }>(
      `select budget_available_cents from campaigns where id = $1 for update`,
      [conversion.campaign_id],
    );

    const budget = campaignBudgetResult.rows[0]?.budget_available_cents ?? 0;

    if (budget < conversion.payout_amount_cents) {
      return {
        conversion,
        payout: null,
        approved: false,
        reason: "insufficient_budget",
      };
    }

    await client.query(
      `update campaigns
       set budget_available_cents = budget_available_cents - $2,
           updated_at = now()
       where id = $1`,
      [conversion.campaign_id, conversion.payout_amount_cents],
    );

    const updateConversion = await client.query(
      `update conversions
       set status = 'approved'
       where id = $1
       returning *`,
      [conversionId],
    );

    const payout = await createApprovedPayout(client, {
      creatorUserId: conversion.creator_user_id,
      campaignId: conversion.campaign_id,
      conversionId,
      payoutAmountCents: conversion.payout_amount_cents,
    });

    return {
      approved: true,
      conversion: updateConversion.rows[0],
      payout,
    };
  });
}

export async function createFundingEvent(input: {
  campaignId: string;
  checkoutSessionId: string;
  amountCents: number;
  status: "pending" | "succeeded" | "failed";
}) {
  await sql(
    `insert into funding_events (
      campaign_id,
      stripe_checkout_session_id,
      amount_cents,
      status
    ) values ($1,$2,$3,$4)
    on conflict (stripe_checkout_session_id)
    do update set status = excluded.status`,
    [input.campaignId, input.checkoutSessionId, input.amountCents, input.status],
  );
}

export async function applyFundingToCampaign(campaignId: string, amountCents: number) {
  await sql(
    `update campaigns
     set budget_total_cents = budget_total_cents + $2,
         budget_available_cents = budget_available_cents + $2,
         updated_at = now()
     where id = $1`,
    [campaignId, amountCents],
  );
}

export async function setCreatorStripeAccount(userId: string, stripeAccountId: string) {
  await sql(
    `update creator_profiles
     set stripe_account_id = $2,
         updated_at = now()
     where user_id = $1`,
    [userId, stripeAccountId],
  );
}

export async function markPayoutPaid(payoutId: string, stripeTransferId: string) {
  await sql(
    `update payouts
     set status = 'paid',
         stripe_transfer_id = $2
     where id = $1`,
    [payoutId, stripeTransferId],
  );
}

export async function freezeCampaignPayouts(campaignId: string) {
  await sql(
    `update campaigns set status = 'paused', updated_at = now() where id = $1`,
    [campaignId],
  );
}

export async function verifyCreatorProfile(creatorProfileId: string, status: "verified" | "unverified") {
  await sql(
    `update creator_profiles
     set verification_status = $2,
         updated_at = now()
     where id = $1`,
    [creatorProfileId, status],
  );
}
