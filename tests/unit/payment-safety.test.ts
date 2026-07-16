import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { campaignSchema, conversionSchema } from "@/server/lib/validators";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

describe("payment safety contracts", () => {
  it("applies a successful checkout atomically and idempotently", () => {
    const route = read("src/app/api/webhooks/stripe/route.ts");
    const writes = read("src/server/db/write.ts");

    expect(route).toContain("recordSuccessfulFunding");
    expect(route).not.toContain("applyFundingToCampaign");
    expect(writes).toContain(
      "on conflict (stripe_checkout_session_id) do nothing",
    );
    expect(writes).toContain("returning id");
    expect(writes).toContain("withTransaction");
  });

  it("uses the payout id as Stripe's transfer idempotency key", () => {
    const payouts = read("src/server/lib/payouts.ts");

    expect(payouts).toContain("idempotencyKey: input.payoutId");
  });

  it("only credits completed, paid USD checkout sessions", () => {
    const route = read("src/app/api/webhooks/stripe/route.ts");
    const funding = read("src/app/api/builder/campaigns/[id]/fund/route.ts");

    expect(route).toContain('session.payment_status !== "paid"');
    expect(route).toContain('session.currency !== "usd"');
    expect(route).toContain("amount <= 0");
    expect(route).toContain(
      'event.type === "checkout.session.async_payment_succeeded"',
    );
    expect(route).toContain("{ received: true, processed: false }");
    expect(funding).not.toContain("payment_method_types");
    expect(funding).toContain("integration_identifier");
    expect(funding).toContain("idempotencyKey:");
  });

  it("never trusts builder-supplied funding or activation state", () => {
    const validators = read("src/server/lib/validators.ts");
    const route = read("src/app/api/builder/campaigns/route.ts");
    const writes = read("src/server/db/write.ts");
    const form = read("src/components/forms/campaign-form.tsx");

    expect(validators).not.toContain("budget_available_cents:");
    expect(validators).not.toContain("budget_total_cents:");
    expect(route).toContain("budgetTotalCents: 0");
    expect(route).toContain("budgetAvailableCents: 0");
    expect(route).toContain('status: "draft"');
    expect(writes).toContain(
      "status = case when status = 'draft' then 'active'",
    );
    expect(form).not.toContain('form.register("budget_available_cents")');
    expect(form).not.toContain('form.register("status")');
  });

  it("accepts conversions only for active funded partnerships", () => {
    const writes = read("src/server/db/write.ts");
    const conversions = read("src/app/api/conversions/route.ts");
    const invites = read("src/app/api/builder/campaigns/[id]/invite/route.ts");

    expect(writes).toContain("pr.status = 'active'");
    expect(writes).toContain("c.status = 'active'");
    expect(writes).toContain("for update of c, pr");
    expect(writes).toContain(
      'conversionStatus =\n      input.approvalMode === "auto" && hasBudget',
    );
    expect(invites).toContain("c.budget_available_cents >= c.cpa_amount_cents");
    expect(conversions).toContain("findConversionAndPayoutByDedup");
  });

  it("requires a stable conversion deduplication key", () => {
    const validators = read("src/server/lib/validators.ts");

    expect(validators).toContain(
      "value.idempotency_key || value.external_user_id",
    );
    expect(validators).toContain(
      "A stable idempotency key or external user id is required",
    );

    expect(
      conversionSchema.safeParse({ ref_code: "ref_123", event_type: "signup" })
        .success,
    ).toBe(false);
    expect(
      conversionSchema.safeParse({
        ref_code: "ref_123",
        event_type: "signup",
        idempotency_key: "evt_123",
      }).success,
    ).toBe(true);
  });

  it("strips client-supplied campaign ledger fields", () => {
    const campaign = campaignSchema.parse({
      product_id: "00000000-0000-4000-8000-000000000001",
      title: "Safe campaign",
      cpa_amount_cents: 500,
      budget_total_cents: 999_999,
      budget_available_cents: 999_999,
      status: "active",
    });

    expect(campaign).not.toHaveProperty("budget_total_cents");
    expect(campaign).not.toHaveProperty("budget_available_cents");
    expect(campaign).not.toHaveProperty("status");
  });

  it("keeps payment and identity internals out of public detail records", () => {
    const reads = read("src/server/db/read.ts");
    const creatorRoute = read("src/app/api/public/creators/[id]/route.ts");
    const creatorDirectoryRoute = read("src/app/api/public/creators/route.ts");
    const campaignRoute = read("src/app/api/public/campaigns/[id]/route.ts");
    const campaignDirectoryRoute = read(
      "src/app/api/public/campaigns/route.ts",
    );

    expect(reads).not.toContain("select cp.*, u.role");
    expect(reads).toContain("getPublicCampaignById");
    expect(creatorRoute).not.toContain("stripe_account_id");
    expect(creatorDirectoryRoute).toContain("publicCreators");
    expect(campaignRoute).toContain("getPublicCampaignById");
    expect(campaignDirectoryRoute).toContain('status: "active"');
  });
});
