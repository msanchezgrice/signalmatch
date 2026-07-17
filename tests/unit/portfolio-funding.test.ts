import { describe, expect, it } from "vitest";

import {
  canUsePortfolioCredit,
  portfolioCampaignHasCapacity,
} from "@/server/lib/portfolio-funding";

describe("portfolio campaign funding", () => {
  it("allows internal credit only for database-trusted portfolio products", () => {
    expect(canUsePortfolioCredit({ isPortfolioOwned: true })).toBe(true);
    expect(canUsePortfolioCredit({ isPortfolioOwned: false })).toBe(false);
    expect(canUsePortfolioCredit({ isPortfolioOwned: null })).toBe(false);
  });

  it("lets trusted portfolio campaigns proceed without a Stripe-funded balance", () => {
    expect(
      portfolioCampaignHasCapacity({
        isPortfolioOwned: true,
        budgetAvailableCents: 0,
        payoutAmountCents: 5_000,
      }),
    ).toBe(true);

    expect(
      portfolioCampaignHasCapacity({
        isPortfolioOwned: false,
        budgetAvailableCents: 0,
        payoutAmountCents: 5_000,
      }),
    ).toBe(false);
  });
});
