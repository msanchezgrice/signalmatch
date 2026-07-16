import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { env } from "@/server/env";
import { createUserIfMissing, deleteUserByClerkId } from "@/server/db/write";

export async function POST(req: Request) {
  if (!env.CLERK_WEBHOOK_SIGNING_SECRET) {
    return NextResponse.json(
      { ok: false, error: "Webhook unavailable" },
      { status: 503 },
    );
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { ok: false, error: "Missing Clerk webhook headers" },
      { status: 400 },
    );
  }

  const payload = await req.text();
  let webhook: Webhook;

  try {
    webhook = new Webhook(env.CLERK_WEBHOOK_SIGNING_SECRET);
  } catch {
    console.error("Clerk webhook configuration is invalid");
    return NextResponse.json(
      { ok: false, error: "Webhook unavailable" },
      { status: 503 },
    );
  }

  let event: { type: string; data: { id: string } };

  try {
    event = webhook.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as { type: string; data: { id: string } };
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid Clerk signature" },
      { status: 400 },
    );
  }

  try {
    if (event.type === "user.created" || event.type === "user.updated") {
      await createUserIfMissing(event.data.id);
    }

    if (event.type === "user.deleted") {
      await deleteUserByClerkId(event.data.id);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Clerk webhook processing failed", {
      eventType: event.type,
      errorName: error instanceof Error ? error.name : "UnknownError",
    });

    return NextResponse.json(
      { ok: false, error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
