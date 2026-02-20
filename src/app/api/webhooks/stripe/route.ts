import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { env } from "@/server/env";
import { stripe } from "@/server/stripe";
import { applyFundingToCampaign, createFundingEvent } from "@/server/db/write";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!env.STRIPE_WEBHOOK_SECRET || !signature) {
    return NextResponse.json({ ok: false, error: "Webhook not configured" }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const campaignId = session.metadata?.campaign_id;
      const amount = session.amount_total ?? 0;

      if (campaignId) {
        await createFundingEvent({
          campaignId,
          checkoutSessionId: session.id,
          amountCents: amount,
          status: "succeeded",
        });
        await applyFundingToCampaign(campaignId, amount);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Invalid signature" },
      { status: 400 },
    );
  }
}
