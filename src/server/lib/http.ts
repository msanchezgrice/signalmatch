import { NextResponse } from "next/server";

export function badRequest(message: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status: 400 });
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ ok: false, error: message }, { status: 401 });
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ ok: false, error: message }, { status: 403 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ ok: false, error: message }, { status: 404 });
}

export function tooManyRequests(resetAt: number) {
  return NextResponse.json(
    { ok: false, error: "Rate limited", reset_at: new Date(resetAt).toISOString() },
    { status: 429 },
  );
}
