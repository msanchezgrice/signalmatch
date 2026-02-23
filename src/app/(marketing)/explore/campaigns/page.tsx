import Link from "next/link";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { getCampaignDirectory } from "@/server/db/read";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function conversionLabel(type: string) {
  if (type === "activation") {
    return "Activated account";
  }

  return "Qualified signup";
}

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
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
      <section className="rounded-[2rem] bg-gradient-to-br from-rose-50 via-white to-orange-50 p-7 md:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-500">
          Products shared by creators
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
          Find paid partnerships for products you actually trust.
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-600">
          Browse live offers from builders. Pick campaigns that match your audience and content style,
          then get paid for approved outcomes.
        </p>
        <form className="mt-6 flex w-full max-w-xl items-center gap-2" action="/explore/campaigns">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              className="h-11 rounded-full border-zinc-300 bg-white pl-9"
              name="query"
              placeholder="Search by product, campaign, or niche"
              defaultValue={query}
            />
          </div>
        </form>
      </section>

      <section className="mt-8 overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/95">
        {data.campaigns.length === 0 ? (
          <div className="px-6 py-10 text-sm text-zinc-600 md:px-8">
            No campaigns matched your search yet.
          </div>
        ) : null}

        {data.campaigns.map((campaign) => {
          const tags = (campaign.target_tags as string[]) ?? [];

          return (
            <Link key={campaign.campaign_id} href={`/explore/campaigns/${campaign.campaign_id}`}>
              <article className="grid gap-4 border-b border-zinc-200/80 px-6 py-5 transition hover:bg-rose-50/50 last:border-b-0 md:grid-cols-[1.8fr_0.9fr_0.5fr] md:items-center md:px-8">
                <div>
                  <p className="text-lg font-semibold tracking-tight text-zinc-900">{campaign.title}</p>
                  <p className="mt-1 text-sm text-zinc-600">{campaign.product_name}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
                    {campaign.brief || "No campaign brief added yet."}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-orange-100/70 px-2.5 py-1 text-xs text-zinc-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-zinc-700">
                  <p>
                    <span className="font-medium text-zinc-900">Payout:</span>{" "}
                    ${(campaign.cpa_amount_cents / 100).toFixed(2)} per approved outcome
                  </p>
                  <p className="mt-1">
                    <span className="font-medium text-zinc-900">Counts as:</span>{" "}
                    {conversionLabel(campaign.conversion_type)}
                  </p>
                </div>

                <p className="text-sm font-medium text-zinc-900 md:text-right">View terms →</p>
              </article>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
