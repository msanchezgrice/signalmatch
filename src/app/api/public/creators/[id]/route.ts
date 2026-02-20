import { NextResponse } from "next/server";

import { getCreatorById } from "@/server/db/read";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const creator = await getCreatorById(id);

  if (!creator) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ creator });
}
