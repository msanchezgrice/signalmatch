import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireBuilder: vi.fn(),
  sql: vi.fn(),
  inviteCreatorToCampaign: vi.fn(),
}));

vi.mock("@/server/auth", () => ({ requireBuilder: mocks.requireBuilder }));
vi.mock("@/server/db", () => ({ sql: mocks.sql }));
vi.mock("@/server/db/write", () => ({
  inviteCreatorToCampaign: mocks.inviteCreatorToCampaign,
}));

import { POST as inviteCreator } from "@/app/api/builder/campaigns/[id]/invite/route";

const campaignId = "00000000-0000-4000-8000-000000000001";
const creatorId = "00000000-0000-4000-8000-000000000003";

function request() {
  return new NextRequest(
    `https://signalmatch.me/api/builder/campaigns/${campaignId}/invite`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        creator_user_id: creatorId,
        terms_snapshot: { cpa_amount_cents: 1_000 },
      }),
    },
  );
}

describe("portfolio invitation funding gate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireBuilder.mockResolvedValue({
      userId: "00000000-0000-4000-8000-000000000002",
    });
    mocks.inviteCreatorToCampaign.mockResolvedValue({ id: "partnership" });
  });

  it("allows a trusted portfolio campaign with no deposited balance", async () => {
    mocks.sql.mockResolvedValue({
      rows: [{ id: campaignId, is_portfolio_owned: true }],
    });

    const response = await inviteCreator(request(), {
      params: Promise.resolve({ id: campaignId }),
    });

    expect(response.status).toBe(200);
    expect(mocks.inviteCreatorToCampaign).toHaveBeenCalledOnce();
    expect(mocks.sql.mock.calls[0]?.[0]).toContain("is_portfolio_owned");
    expect(mocks.sql.mock.calls[0]?.[0]).toContain("or c.budget_available_cents");
  });

  it("keeps the funding gate for a normal campaign", async () => {
    mocks.sql.mockResolvedValue({ rows: [] });

    const response = await inviteCreator(request(), {
      params: Promise.resolve({ id: campaignId }),
    });

    expect(response.status).toBe(409);
    expect(mocks.inviteCreatorToCampaign).not.toHaveBeenCalled();
  });
});
