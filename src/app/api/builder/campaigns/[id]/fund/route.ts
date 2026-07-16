import { NextRequest, NextResponse } from "next/server";

import { env } from "@/server/env";
import { sql } from "@/server/db";
import { requireBuilder } from "@/server/auth";
import { stripe } from "@/server/stripe";

export const MIN_FUNDING_AMOUNT_CENTS = 500;
export const MAX_FUNDING_AMOUNT_CENTS = 5_000_000;

const IDEMPOTENCY_TOKEN_PATTERN = /^[A-Za-z0-9_-]{16,128}$/;
const STRIPE_CHECKOUT_INTEGRATION_IDENTIFIER = "signalmatch_funding_qxkdrmpt";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const authContext = await requireBuilder();
    const json = await req.json();
    const amountCents = Number(json.amount_cents ?? 0);
    const idempotencyToken =
      typeof json.idempotency_key === "string"
        ? json.idempotency_key.trim()
        : "";

    if (
      !Number.isInteger(amountCents) ||
      amountCents < MIN_FUNDING_AMOUNT_CENTS ||
      amountCents > MAX_FUNDING_AMOUNT_CENTS
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: `Funding amount must be between $${MIN_FUNDING_AMOUNT_CENTS / 100} and $${MAX_FUNDING_AMOUNT_CENTS / 100}`,
        },
        { status: 400 },
      );
    }

    if (!IDEMPOTENCY_TOKEN_PATTERN.test(idempotencyToken)) {
      return NextResponse.json(
        { ok: false, error: "Invalid idempotency token" },
        { status: 400 },
      );
    }

    const ownership = await sql(
      `select c.id
       from campaigns c
       join products p on p.id = c.product_id
       where c.id = $1 and p.owner_user_id = $2
       limit 1`,
      [id, authContext.userId],
    );

    if (!ownership.rows[0]) {
      return NextResponse.json(
        { ok: false, error: "Campaign not found" },
        { status: 404 },
      );
    }

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        integration_identifier: STRIPE_CHECKOUT_INTEGRATION_IDENTIFIER,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: amountCents,
              product_data: {
                name: `SignalMatch budget top-up (${id})`,
              },
            },
          },
        ],
        success_url: `${env.NEXT_PUBLIC_APP_URL}/app/builder/campaigns/${id}?funding=success`,
        cancel_url: `${env.NEXT_PUBLIC_APP_URL}/app/builder/campaigns/${id}?funding=cancelled`,
        payment_intent_data: {
          metadata: {
            campaign_id: id,
            builder_user_id: authContext.userId,
          },
        },
        metadata: {
          campaign_id: id,
          builder_user_id: authContext.userId,
        },
      },
      {
        idempotencyKey: `fund:${authContext.userId}:${id}:${idempotencyToken}`,
      },
    );

    return NextResponse.json({
      ok: true,
      checkout_url: session.url,
      session_id: session.id,
    });
  } catch (error) {
    console.error("Checkout session creation failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to start checkout",
      },
      { status: 500 },
    );
  }
}
