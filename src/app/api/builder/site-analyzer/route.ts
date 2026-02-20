import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireBuilder } from "@/server/auth";
import { analyzeSite } from "@/server/lib/site-analyzer";

const schema = z.object({
  url: z.string().url(),
});

export async function POST(req: NextRequest) {
  try {
    await requireBuilder();
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid URL" }, { status: 400 });
    }

    const analysis = await analyzeSite(parsed.data.url);
    return NextResponse.json({ ok: true, analysis });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected error",
      },
      { status: 500 },
    );
  }
}
