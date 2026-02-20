import { NextRequest, NextResponse } from "next/server";

import { sql } from "@/server/db";
import { requireRole } from "@/server/auth";
import { inviteCreatorToCampaign } from "@/server/db/write";
import { inviteSchema } from "@/server/lib/validators";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const authContext = await requireRole(["BUILDER", "ADMIN"]);
    const json = await req.json();
    const parsed = inviteSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
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

    const partnership = await inviteCreatorToCampaign({
      campaignId: id,
      creatorUserId: parsed.data.creator_user_id,
      termsSnapshot: parsed.data.terms_snapshot,
    });

    return NextResponse.json({ ok: true, partnership });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
