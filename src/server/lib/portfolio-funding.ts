export function canUsePortfolioCredit(input: {
  isPortfolioOwned: boolean | null | undefined;
}) {
  return input.isPortfolioOwned === true;
}

export function portfolioCampaignHasCapacity(input: {
  isPortfolioOwned: boolean | null | undefined;
  budgetAvailableCents: number;
  payoutAmountCents: number;
}) {
  return (
    canUsePortfolioCredit(input) ||
    input.budgetAvailableCents >= input.payoutAmountCents
  );
}
