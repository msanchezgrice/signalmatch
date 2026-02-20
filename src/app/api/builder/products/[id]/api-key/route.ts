import { NextResponse } from "next/server";

import { sql } from "@/server/db";
import { requireRole } from "@/server/auth";
import { newApiKey } from "@/server/crypto";
import { rotateProductApiKey } from "@/server/db/write";

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const authContext = await requireRole(["BUILDER", "ADMIN"]);

    const ownership = await sql(
      `select id from products where id = $1 and owner_user_id = $2 limit 1`,
      [id, authContext.userId],
    );

    if (!ownership.rows[0]) {
      return NextResponse.json({ ok: false, error: "Product not found" }, { status: 404 });
    }

    const key = newApiKey("smk");
    await rotateProductApiKey(id, key.hash);

    return NextResponse.json({ ok: true, api_key: key.token });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
