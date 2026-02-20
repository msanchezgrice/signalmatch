import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/server/auth";
import { verifyCreatorProfile } from "@/server/db/write";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireRole(["ADMIN"]);
    const { id } = await params;
    const body = await req.json();
    const status = body.status === "verified" ? "verified" : "unverified";

    await verifyCreatorProfile(id, status);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
