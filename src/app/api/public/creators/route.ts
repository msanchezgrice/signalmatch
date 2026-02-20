import { NextRequest, NextResponse } from "next/server";

import { getCreatorDirectory } from "@/server/db/read";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;

  const query = url.searchParams.get("query") ?? undefined;
  const niches = url.searchParams.getAll("niches");
  const platforms = url.searchParams.getAll("platforms");
  const verificationStatus = (url.searchParams.get("verification_status") ?? "any") as
    | "verified"
    | "unverified"
    | "any";
  const minFollowers = Number(url.searchParams.get("min_followers") ?? "") || undefined;
  const maxFollowers = Number(url.searchParams.get("max_followers") ?? "") || undefined;
  const limit = Number(url.searchParams.get("limit") ?? 20);
  const offset = Number(url.searchParams.get("offset") ?? 0);

  const data = await getCreatorDirectory({
    query,
    niches,
    platforms,
    verificationStatus,
    minFollowers,
    maxFollowers,
    limit,
    offset,
  });

  return NextResponse.json({ creators: data.creators, next_offset: data.nextOffset });
}
