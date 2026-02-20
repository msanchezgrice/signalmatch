import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/server/auth";
import { createProduct } from "@/server/db/write";
import { productSchema } from "@/server/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const authContext = await requireRole(["BUILDER", "ADMIN"]);
    const json = await req.json();
    const parsed = productSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
    }

    const product = await createProduct({
      ownerUserId: authContext.userId,
      name: parsed.data.name,
      url: parsed.data.url,
      description: parsed.data.description,
      categoryTags: parsed.data.category_tags,
      pricingType: parsed.data.pricing_type,
    });

    return NextResponse.json({ ok: true, product });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
