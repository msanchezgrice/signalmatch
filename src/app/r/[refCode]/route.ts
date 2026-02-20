import { NextRequest, NextResponse } from "next/server";

import { findPartnershipByRefCode, logClick } from "@/server/db/write";
import { sha256 } from "@/server/lib/hash";
import { enforceRateLimit } from "@/server/rate-limit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ refCode: string }> },
) {
  const { refCode } = await params;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = await enforceRateLimit(`redirect:${ip}`);
  if (!rl.ok) {
    return new NextResponse("Rate limited", { status: 429 });
  }

  const partnership = await findPartnershipByRefCode(refCode);

  if (!partnership) {
    return NextResponse.redirect(new URL("/explore/campaigns", req.url), 302);
  }

  await logClick(refCode, {
    ipHash: sha256(ip),
    userAgentHash: sha256(req.headers.get("user-agent") ?? "unknown"),
  });

  const target = new URL(partnership.product_url);
  target.searchParams.set("utm_source", "curatormarket");
  target.searchParams.set("utm_medium", "creator");
  target.searchParams.set("utm_campaign", partnership.campaign_id);
  target.searchParams.set("ref", refCode);

  return NextResponse.redirect(target, 302);
}
