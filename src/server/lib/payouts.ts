import { getCreatorStripeAccount } from "@/server/db/read";
import { markPayoutPaid } from "@/server/db/write";
import { stripe } from "@/server/stripe";

export async function settlePayoutIfPossible(input: {
  payoutId: string;
  creatorUserId: string;
  campaignId: string;
  amountCents: number;
}) {
  const stripeAccountId = await getCreatorStripeAccount(input.creatorUserId);

  if (!stripeAccountId) {
    return { settled: false, reason: "missing_stripe_account" as const };
  }

  const transfer = await stripe.transfers.create({
    amount: input.amountCents,
    currency: "usd",
    destination: stripeAccountId,
    metadata: {
      payout_id: input.payoutId,
      campaign_id: input.campaignId,
      creator_user_id: input.creatorUserId,
    },
  });

  await markPayoutPaid(input.payoutId, transfer.id);

  return { settled: true, transferId: transfer.id };
}
