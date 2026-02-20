import { NextRequest, NextResponse } from "next/server";

import { requireAuthContext } from "@/server/auth";
import { setUserRole } from "@/server/db/write";
import { roleSchema } from "@/server/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const authContext = await requireAuthContext();
    const body = await req.json();
    const parsed = roleSchema.safeParse(body.role);

    if (!parsed.success || parsed.data === "ADMIN") {
      return NextResponse.json({ ok: false, error: "Invalid role" }, { status: 400 });
    }

    await setUserRole(authContext.userId, parsed.data);

    return NextResponse.json({ ok: true, role: parsed.data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
