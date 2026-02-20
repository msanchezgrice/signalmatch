import { NextResponse } from "next/server";

import { requireRole } from "@/server/auth";
import { markConversionApproved } from "@/server/db/write";
import { settlePayoutIfPossible } from "@/server/lib/payouts";

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const authContext = await requireRole(["BUILDER", "ADMIN"]);
    const result = await markConversionApproved(id, authContext.userId);

    if (!result) {
      return NextResponse.json({ ok: false, error: "Conversion not found" }, { status: 404 });
    }

    if (!result.approved || !result.payout) {
      return NextResponse.json({ ok: true, ...result });
    }

    const payoutResult = await settlePayoutIfPossible({
      payoutId: result.payout.id,
      creatorUserId: result.payout.creator_user_id,
      campaignId: result.payout.campaign_id,
      amountCents: result.payout.amount_cents,
    });

    return NextResponse.json({ ok: true, result, payout_result: payoutResult });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
