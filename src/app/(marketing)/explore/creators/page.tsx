import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCreatorDirectory } from "@/server/db/read";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

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

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Creator Directory</h1>
        <form className="flex w-full max-w-md gap-2" action="/explore/creators">
          <Input name="query" placeholder="Search creators" defaultValue={query} />
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.creators.map((creator) => (
          <Link key={creator.creator_profile_id} href={`/explore/creators/${creator.creator_profile_id}`}>
            <Card className="h-full border-zinc-200/80 bg-white/95 transition hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2 text-lg">
                  <span>{creator.display_name}</span>
                  <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    {creator.verification_status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-zinc-600">
                <p>Niches: {creator.niches.join(", ") || "n/a"}</p>
                <p>
                  Channels: {creator.channels.map((ch) => `${ch.platform} (${ch.followers})`).join(" • ") || "n/a"}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
