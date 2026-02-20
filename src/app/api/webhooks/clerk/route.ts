import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { env } from "@/server/env";
import { createUserIfMissing, deleteUserByClerkId } from "@/server/db/write";

export async function POST(req: Request) {
  if (!env.CLERK_WEBHOOK_SIGNING_SECRET) {
    return NextResponse.json({ ok: false, error: "Webhook secret missing" }, { status: 400 });
  }

  const svixHeaders = await headers();
  const payload = await req.text();

  const wh = new Webhook(env.CLERK_WEBHOOK_SIGNING_SECRET);

  try {
    const event = wh.verify(payload, {
      "svix-id": svixHeaders.get("svix-id") ?? "",
      "svix-timestamp": svixHeaders.get("svix-timestamp") ?? "",
      "svix-signature": svixHeaders.get("svix-signature") ?? "",
    }) as { type: string; data: { id: string } };

    if (event.type === "user.created") {
      await createUserIfMissing(event.data.id);
    }

    if (event.type === "user.deleted") {
      await deleteUserByClerkId(event.data.id);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Invalid signature" },
      { status: 400 },
    );
  }
}
