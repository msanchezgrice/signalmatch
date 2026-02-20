import { NextRequest, NextResponse } from "next/server";

import { hashToken } from "@/server/crypto";
import {
  createConversionWithBudgetCheck,
  findPartnershipByRefCode,
  findProductByApiKeyHash,
} from "@/server/db/write";
import { conversionSchema } from "@/server/lib/validators";
import { enforceRateLimit } from "@/server/rate-limit";
import { sha256 } from "@/server/lib/hash";
import { settlePayoutIfPossible } from "@/server/lib/payouts";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rl = await enforceRateLimit(`conversion:${ip}`);

    if (!rl.ok) {
      return NextResponse.json({ ok: false, error: "Rate limited" }, { status: 429 });
    }

    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ ok: false, error: "Missing API key" }, { status: 401 });
    }

    const product = await findProductByApiKeyHash(hashToken(token));
    if (!product) {
      return NextResponse.json({ ok: false, error: "Invalid API key" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = conversionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
    }

    const partnership = await findPartnershipByRefCode(parsed.data.ref_code);

    if (!partnership) {
      return NextResponse.json({ ok: false, error: "Invalid ref_code" }, { status: 404 });
    }

    if (partnership.product_id !== product.id) {
      return NextResponse.json(
        { ok: false, error: "ref_code does not belong to this product" },
        { status: 403 },
      );
    }

    if (partnership.conversion_type !== parsed.data.event_type) {
      return NextResponse.json(
        { ok: false, error: "event_type mismatch for campaign" },
        { status: 400 },
      );
    }

    const result = await createConversionWithBudgetCheck({
      partnershipId: partnership.id,
      creatorUserId: partnership.creator_user_id,
      campaignId: partnership.campaign_id,
      eventType: parsed.data.event_type,
      externalUserId: parsed.data.external_user_id
        ? sha256(parsed.data.external_user_id)
        : undefined,
      idempotencyKey: parsed.data.idempotency_key,
      payoutAmountCents: partnership.cpa_amount_cents,
      approvalMode: partnership.approval_mode,
    });

    let payoutStatus: string | undefined;
    if (result.payout) {
      const payoutResult = await settlePayoutIfPossible({
        payoutId: result.payout.id,
        creatorUserId: result.payout.creator_user_id,
        campaignId: result.payout.campaign_id,
        amountCents: result.payout.amount_cents,
      });
      payoutStatus = payoutResult.settled ? "paid" : "due";
    }

    return NextResponse.json({
      ok: true,
      conversion_id: result.conversion.id,
      status: result.conversion.status,
      payout_amount_cents: result.conversion.payout_amount_cents,
      payout_status: payoutStatus,
    });
  } catch (error: unknown) {
    if (typeof error === "object" && error && "code" in error && error.code === "23505") {
      return NextResponse.json(
        {
          ok: true,
          deduped: true,
          message: "Conversion already received for this key",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
