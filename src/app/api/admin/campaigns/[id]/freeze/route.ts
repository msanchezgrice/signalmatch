import { NextResponse } from "next/server";

import { requireRole } from "@/server/auth";
import { freezeCampaignPayouts } from "@/server/db/write";

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireRole(["ADMIN"]);
    const { id } = await params;

    await freezeCampaignPayouts(id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
