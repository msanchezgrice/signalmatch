import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCampaignDirectory } from "@/server/db/read";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ExploreCampaignsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query : undefined;

  const data = await getCampaignDirectory({
    query,
    status: "active",
    limit: 24,
    offset: 0,
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Campaign Directory</h1>
        <form className="flex w-full max-w-md gap-2" action="/explore/campaigns">
          <Input name="query" placeholder="Search campaigns" defaultValue={query} />
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.campaigns.map((campaign) => (
          <Link key={campaign.campaign_id} href={`/explore/campaigns/${campaign.campaign_id}`}>
            <Card className="h-full border-zinc-200/80 bg-white/95 transition hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{campaign.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-zinc-600">
                <p>{campaign.brief || "No brief yet."}</p>
                <p>CPA: ${(campaign.cpa_amount_cents / 100).toFixed(2)}</p>
                <p>Conversion: {campaign.conversion_type}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
