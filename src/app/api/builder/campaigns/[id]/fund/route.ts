import { NextRequest, NextResponse } from "next/server";

import { env } from "@/server/env";
import { sql } from "@/server/db";
import { requireRole } from "@/server/auth";
import { stripe } from "@/server/stripe";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const authContext = await requireRole(["BUILDER", "ADMIN"]);
    const json = await req.json();
    const amountCents = Number(json.amount_cents ?? 0);

    if (!Number.isInteger(amountCents) || amountCents <= 0) {
      return NextResponse.json({ ok: false, error: "Invalid amount" }, { status: 400 });
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
      return NextResponse.json({ ok: false, error: "Campaign not found" }, { status: 404 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
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
    });

    return NextResponse.json({ ok: true, checkout_url: session.url, session_id: session.id });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
