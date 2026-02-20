import { NextRequest, NextResponse } from "next/server";

import { getCampaignDirectory } from "@/server/db/read";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;

  const query = url.searchParams.get("query") ?? undefined;
  const tags = url.searchParams.getAll("tags");
  const conversionType = (url.searchParams.get("conversion_type") ?? "any") as
    | "signup"
    | "activation"
    | "any";
  const status = (url.searchParams.get("status") ?? "any") as "active" | "any";
  const minCpaCents = Number(url.searchParams.get("min_cpa_cents") ?? "") || undefined;
  const maxCpaCents = Number(url.searchParams.get("max_cpa_cents") ?? "") || undefined;
  const limit = Number(url.searchParams.get("limit") ?? 20);
  const offset = Number(url.searchParams.get("offset") ?? 0);

  const data = await getCampaignDirectory({
    query,
    tags,
    conversionType,
    status,
    minCpaCents,
    maxCpaCents,
    limit,
    offset,
  });

  return NextResponse.json({ campaigns: data.campaigns, next_offset: data.nextOffset });
}
