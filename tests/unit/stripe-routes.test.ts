import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireBuilder: vi.fn(),
  sql: vi.fn(),
  createCheckoutSession: vi.fn(),
  constructEvent: vi.fn(),
  recordSuccessfulFunding: vi.fn(),
}));

vi.mock("@/server/env", () => ({
  env: {
    NEXT_PUBLIC_APP_URL: "https://signalmatch.me",
    STRIPE_WEBHOOK_SECRET: "whsec_test",
  },
}));

vi.mock("@/server/auth", () => ({
  requireBuilder: mocks.requireBuilder,
}));

vi.mock("@/server/db", () => ({
  sql: mocks.sql,
}));

vi.mock("@/server/stripe", () => ({
  stripe: {
    checkout: { sessions: { create: mocks.createCheckoutSession } },
    webhooks: { constructEvent: mocks.constructEvent },
  },
}));

vi.mock("@/server/db/write", () => ({
  recordSuccessfulFunding: mocks.recordSuccessfulFunding,
}));

import {
  MAX_FUNDING_AMOUNT_CENTS,
  MIN_FUNDING_AMOUNT_CENTS,
  POST as fundCampaign,
} from "@/app/api/builder/campaigns/[id]/fund/route";
import { POST as handleStripeWebhook } from "@/app/api/webhooks/stripe/route";

const campaignId = "00000000-0000-4000-8000-000000000001";
const builderId = "00000000-0000-4000-8000-000000000002";
const requestContext = { params: Promise.resolve({ id: campaignId }) };

function fundingRequest(body: Record<string, unknown>) {
  return new NextRequest(
    `https://signalmatch.me/api/builder/campaigns/${campaignId}/fund`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
}

describe("Stripe route behavior", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireBuilder.mockResolvedValue({ userId: builderId });
    mocks.sql.mockResolvedValue({ rows: [{ id: campaignId }] });
    mocks.createCheckoutSession.mockResolvedValue({
      id: "cs_test_123",
      url: "https://checkout.stripe.com/test",
    });
  });

  it.each([MIN_FUNDING_AMOUNT_CENTS - 1, MAX_FUNDING_AMOUNT_CENTS + 1, 12.5])(
    "rejects an out-of-bounds funding amount (%s)",
    async (amountCents) => {
      const response = await fundCampaign(
        fundingRequest({
          amount_cents: amountCents,
          idempotency_key: "request_123456789",
        }),
        requestContext,
      );

      expect(response.status).toBe(400);
      expect(mocks.createCheckoutSession).not.toHaveBeenCalled();
    },
  );

  it("creates a dynamically configured, idempotent Checkout Session", async () => {
    const token = "request_123456789";
    const response = await fundCampaign(
      fundingRequest({ amount_cents: 10_000, idempotency_key: token }),
      requestContext,
    );

    expect(response.status).toBe(200);
    expect(mocks.createCheckoutSession).toHaveBeenCalledOnce();

    const [params, options] = mocks.createCheckoutSession.mock.calls[0];
    expect(params).not.toHaveProperty("payment_method_types");
    expect(params).toMatchObject({
      mode: "payment",
      integration_identifier: expect.stringMatching(/_[a-z]{8}$/),
    });
    expect(options).toEqual({
      idempotencyKey: `fund:${builderId}:${campaignId}:${token}`,
    });
  });

  it("waives Stripe checkout for a database-trusted portfolio campaign", async () => {
    mocks.sql.mockResolvedValue({
      rows: [{ id: campaignId, is_portfolio_owned: true }],
    });

    const response = await fundCampaign(
      fundingRequest({
        amount_cents: 10_000,
        idempotency_key: "request_123456789",
      }),
      requestContext,
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({ ok: true, waived: true });
    expect(mocks.createCheckoutSession).not.toHaveBeenCalled();
  });

  it("returns a generic 400 for an invalid webhook signature", async () => {
    mocks.constructEvent.mockImplementation(() => {
      throw new Error("raw signature details");
    });

    const response = await handleStripeWebhook(
      new Request("https://signalmatch.me/api/webhooks/stripe", {
        method: "POST",
        headers: { "stripe-signature": "t=1,v1=invalid" },
        body: "{}",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Invalid Stripe signature");
    expect(JSON.stringify(body)).not.toContain("raw signature details");
  });

  it("returns a generic 500 when a valid event cannot be persisted", async () => {
    mocks.constructEvent.mockReturnValue({
      id: "evt_test_123",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_123",
          amount_total: 10_000,
          currency: "usd",
          payment_status: "paid",
          metadata: { campaign_id: campaignId },
        },
      },
    });
    mocks.recordSuccessfulFunding.mockRejectedValue(
      new Error("raw database details"),
    );
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const response = await handleStripeWebhook(
      new Request("https://signalmatch.me/api/webhooks/stripe", {
        method: "POST",
        headers: { "stripe-signature": "t=1,v1=valid" },
        body: "{}",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Webhook processing failed");
    expect(JSON.stringify(body)).not.toContain("raw database details");
    expect(consoleError).toHaveBeenCalledWith(
      "Stripe webhook processing failed",
      {
        eventId: "evt_test_123",
        eventType: "checkout.session.completed",
        errorName: "Error",
      },
    );

    consoleError.mockRestore();
  });
});
