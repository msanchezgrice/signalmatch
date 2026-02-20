import { NextResponse } from "next/server";

import { requireRole } from "@/server/auth";
import { acceptPartnership } from "@/server/db/write";

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const authContext = await requireRole(["CREATOR", "ADMIN"]);

    const partnership = await acceptPartnership(id, authContext.userId);
    if (!partnership) {
      return NextResponse.json(
        { ok: false, error: "Invite not found or not eligible" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, partnership });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
