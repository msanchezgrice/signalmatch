import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { Search, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMarketingMetadata } from "@/lib/marketing-metadata";
import { getCreatorDirectory } from "@/server/db/read";
import type { CreatorChannel } from "@/server/db/types";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = getMarketingMetadata("/explore/creators");

export default async function ExploreCreatorsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query : undefined;
  const niche = typeof params.niche === "string" ? params.niche : undefined;

  const data = await getCreatorDirectory({
    query,
    niches: niche ? [niche] : [],
    limit: 24,
    offset: 0,
    verificationStatus: "any",
  });

  function topChannels(channels: CreatorChannel[]) {
    return channels
      .slice(0, 2)
      .map(
        (channel) =>
          `${channel.platform} ${channel.followers.toLocaleString()}`,
      )
      .join(" • ");
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
      <section className="rounded-[2rem] bg-gradient-to-br from-orange-50 via-white to-rose-50 p-7 md:p-10">
        <p className="text-sm font-medium tracking-[0.18em] text-zinc-500 uppercase">
          Builder Creator Directory
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-tight font-semibold tracking-tight md:text-6xl">
          Find creators your product users already trust.
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-600">
          Browse vetted AI creators by niche, channel quality, and audience fit.
          Invite directly into your campaigns when there is strong alignment.
        </p>
        <form
          className="mt-6 flex w-full max-w-xl items-center gap-2"
          action="/explore/creators"
        >
          <div className="relative w-full">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              className="h-11 rounded-full border-zinc-300 bg-white pl-9"
              name="query"
              placeholder="Search by name, niche, or audience"
              defaultValue={query}
            />
          </div>
        </form>
      </section>

      <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/90">
        {data.creators.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center md:px-8">
            <span className="grid size-12 place-items-center rounded-2xl bg-orange-100 text-orange-700">
              <UsersRound className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-semibold tracking-tight">
              No creators matched this search
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600">
              Try a broader name, niche, or audience term. New creator profiles
              are added as they are reviewed.
            </p>
            {query || niche ? (
              <Button asChild variant="outline" className="mt-5">
                <Link href="/explore/creators">Clear filters</Link>
              </Button>
            ) : null}
          </div>
        ) : null}
        {data.creators.map((creator) => (
          <Link
            key={creator.creator_profile_id}
            href={`/explore/creators/${creator.creator_profile_id}`}
          >
            <div className="flex items-start gap-4 border-b border-zinc-200/70 px-5 py-5 transition last:border-b-0 hover:bg-orange-50/60 md:items-center md:px-7">
              <Image
                src={
                  creator.avatar_url ??
                  "https://api.dicebear.com/9.x/shapes/svg?seed=signalmatch"
                }
                alt={creator.display_name}
                width={56}
                height={56}
                unoptimized
                className="h-14 w-14 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-lg font-semibold tracking-tight">
                    {creator.display_name}
                  </p>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium tracking-wide text-zinc-600 uppercase">
                    {creator.verification_status}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-zinc-600">
                  {creator.bio ??
                    "AI creator with performance-oriented audience."}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-600">
                  {creator.niches.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-orange-100/70 px-2.5 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="hidden text-right text-sm text-zinc-600 md:block">
                <p>{topChannels(creator.channels)}</p>
                <p className="mt-1 text-xs">
                  {creator.channels.length > 0
                    ? `${Math.round(
                        creator.channels.reduce(
                          (sum, c) => sum + (c.avg_impressions ?? 0),
                          0,
                        ) / creator.channels.length,
                      ).toLocaleString()} avg impressions`
                    : "No channel metrics"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
