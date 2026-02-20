import { NextRequest, NextResponse } from "next/server";

import { sql } from "@/server/db";
import { requireBuilder } from "@/server/auth";
import { createCampaign } from "@/server/db/write";
import { campaignSchema } from "@/server/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const authContext = await requireBuilder();
    const json = await req.json();
    const parsed = campaignSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
    }

    const ownership = await sql(
      `select id from products where id = $1 and owner_user_id = $2 limit 1`,
      [parsed.data.product_id, authContext.userId],
    );

    if (!ownership.rows[0]) {
      return NextResponse.json({ ok: false, error: "Product not found" }, { status: 404 });
    }

    const campaign = await createCampaign({
      productId: parsed.data.product_id,
      title: parsed.data.title,
      brief: parsed.data.brief,
      targetTags: parsed.data.target_tags,
      conversionType: parsed.data.conversion_type,
      payoutModel: parsed.data.payout_model,
      cpaAmountCents: parsed.data.cpa_amount_cents,
      approvalMode: parsed.data.approval_mode,
      approvalTimeoutDays: parsed.data.approval_timeout_days,
      budgetTotalCents: parsed.data.budget_total_cents,
      budgetAvailableCents: parsed.data.budget_available_cents,
      status: parsed.data.status,
    });

    return NextResponse.json({ ok: true, campaign });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
