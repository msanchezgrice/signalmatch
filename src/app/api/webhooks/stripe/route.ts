import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { env } from "@/server/env";
import { stripe } from "@/server/stripe";
import { recordSuccessfulFunding } from "@/server/db/write";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { ok: false, error: "Webhook unavailable" },
      { status: 503 },
    );
  }

  if (!signature) {
    return NextResponse.json(
      { ok: false, error: "Missing Stripe signature" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid Stripe signature" },
      { status: 400 },
    );
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object;
      const campaignId = session.metadata?.campaign_id;
      const amount = session.amount_total ?? 0;

      if (
        !campaignId ||
        session.payment_status !== "paid" ||
        session.currency !== "usd" ||
        amount <= 0
      ) {
        // Acknowledge valid Stripe events that are unrelated, unpaid, or not yet
        // final so Stripe does not retry them as delivery failures.
        return NextResponse.json({ received: true, processed: false });
      }

      await recordSuccessfulFunding({
        campaignId,
        checkoutSessionId: session.id,
        amountCents: amount,
      });
    }

    return NextResponse.json({ received: true, processed: true });
  } catch (error) {
    console.error("Stripe webhook processing failed", {
      eventId: event.id,
      eventType: event.type,
      errorName: error instanceof Error ? error.name : "UnknownError",
    });

    return NextResponse.json(
      { ok: false, error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
