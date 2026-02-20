import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/server/auth";
import { upsertCreatorProfile } from "@/server/db/write";
import { creatorProfileSchema } from "@/server/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const authContext = await requireRole(["CREATOR", "ADMIN"]);
    const json = await req.json();
    const parsed = creatorProfileSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
    }

    const profile = await upsertCreatorProfile({
      userId: authContext.userId,
      displayName: parsed.data.display_name,
      bio: parsed.data.bio,
      avatarUrl: parsed.data.avatar_url,
      niches: parsed.data.niches,
      audienceTags: parsed.data.audience_tags,
      channels: parsed.data.channels,
    });

    return NextResponse.json({ ok: true, profile });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
