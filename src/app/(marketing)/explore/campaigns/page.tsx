import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMarketingMetadata } from "@/lib/marketing-metadata";
import { showcaseCampaigns } from "@/lib/showcase-campaigns";
import { getCampaignDirectory } from "@/server/db/read";

export const metadata: Metadata = getMarketingMetadata("/explore/campaigns");

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ExploreCampaignsPage({
  searchParams,
}: PageProps) {
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
        <p className="text-sm font-medium tracking-[0.16em] text-zinc-500 uppercase">
          Products shared by creators
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-tight font-semibold tracking-tight md:text-6xl">
          Find paid partnerships for products you actually trust.
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-600">
          Browse live offers from builders. Pick campaigns that match your
          audience and content style, then get paid for approved outcomes.
        </p>
        <form
          className="mt-6 flex w-full max-w-xl items-center gap-2"
          action="/explore/campaigns"
        >
          <div className="relative w-full">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              className="h-11 rounded-full border-zinc-300 bg-white pl-9"
              name="query"
              placeholder="Search by product, campaign, or niche"
              defaultValue={query}
            />
          </div>
        </form>
      </section>

      {data.campaigns.length > 0 ? (
        <section className="mt-8">
          <div className="border-b border-zinc-200/80 px-6 py-4 md:px-8">
            <p className="text-xs font-semibold tracking-[0.16em] text-emerald-700 uppercase">
              Live opportunities
            </p>
          </div>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
          {data.campaigns.map((campaign) => {
          const tags = (campaign.target_tags as string[]) ?? [];

          return (
            <Link
              key={campaign.campaign_id}
              href={`/explore/campaigns/${campaign.campaign_id}`}
            >
              <article className="group h-full overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-[0_18px_60px_rgba(24,24,27,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(24,24,27,0.13)]">
                <div className="aspect-[16/9] overflow-hidden bg-zinc-100">
                  {campaign.product_screenshot_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={campaign.product_screenshot_url} alt={`${campaign.product_name} product preview`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-100 via-white to-orange-100 text-2xl font-semibold text-zinc-700">
                      {campaign.product_name}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-zinc-600">{campaign.product_name}</p>
                    {campaign.product_verified_at ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><BadgeCheck className="size-4" /> Website verified</span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-xl font-semibold tracking-tight text-zinc-900">{campaign.title}</p>
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
                  <div className="mt-5 flex items-end justify-between gap-4 border-t border-zinc-100 pt-4">
                    <div><p className="text-xs text-zinc-500">Per approved outcome</p><p className="text-2xl font-semibold text-zinc-950">${(campaign.cpa_amount_cents / 100).toFixed(0)}</p></div>
                    <p className="text-sm font-semibold text-violet-700">Review product & terms →</p>
                  </div>
                </div>
              </article>
            </Link>
          );
          })}
          </div>
        </section>
      ) : query ? (
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm text-zinc-600">
          No live campaigns matched “{query}”. The example campaign library below
          is still available for inspiration.
          <Button asChild variant="link" className="ml-1 h-auto p-0">
            <Link href="/explore/campaigns">Clear search</Link>
          </Button>
        </div>
      ) : null}

      <section className="mt-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-violet-700 uppercase">
              <Sparkles className="size-4" aria-hidden="true" />
              Example campaign library
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
              See what software creators could promote.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              These ten fictional campaigns demonstrate strong briefs, visual product proof,
              and outcome-based payouts. They are examples—not currently accepting applicants.
            </p>
          </div>
          <Link href="/builders/sign-up" className="text-sm font-semibold text-zinc-900 hover:text-violet-700">
            Launch a real campaign →
          </Link>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {showcaseCampaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/explore/campaigns/${campaign.id}`}
              className="group overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-[0_18px_60px_rgba(24,24,27,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(24,24,27,0.13)]"
            >
              <div className="p-3" style={{ backgroundColor: campaign.preview.accentSoft }}>
                <div className="overflow-hidden rounded-2xl border border-black/10 bg-zinc-950 text-white shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <div className="flex gap-1.5" aria-hidden="true">
                      <span className="size-2 rounded-full bg-white/25" />
                      <span className="size-2 rounded-full bg-white/15" />
                      <span className="size-2 rounded-full bg-white/10" />
                    </div>
                    <span className="font-mono text-[10px] text-white/45">{campaign.productName}</span>
                  </div>
                  <div className="grid grid-cols-[0.72fr_1.28fr]">
                    <div className="border-r border-white/10 p-4">
                      <div className="h-2 w-12 rounded-full bg-white/15" />
                      <div className="mt-4 space-y-2">
                        <div className="h-2 rounded-full bg-white/10" />
                        <div className="h-2 w-4/5 rounded-full bg-white/10" />
                        <div className="h-2 w-3/5 rounded-full bg-white/10" />
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] tracking-[0.14em] text-white/45 uppercase">{campaign.preview.metricLabel}</p>
                      <p className="mt-1 text-2xl font-semibold">{campaign.preview.metricValue}</p>
                      <div className="mt-4 space-y-2">
                        {campaign.preview.rows.map((row, index) => (
                          <div key={row} className="flex items-center gap-2 rounded-lg bg-white/[0.06] px-2.5 py-2 text-[10px] text-white/70">
                            <span className="size-1.5 rounded-full" style={{ backgroundColor: campaign.preview.accent }} />
                            <span className="truncate">{row}</span>
                            <span className="ml-auto font-mono text-white/35">0{index + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-violet-700 uppercase">
                      Illustrative example
                    </span>
                    <h3 className="mt-3 text-xl font-semibold tracking-tight text-zinc-950">{campaign.productName}</h3>
                    <p className="mt-1 text-xs font-medium text-zinc-500">{campaign.category}</p>
                  </div>
                  <ArrowUpRight className="size-5 text-zinc-400 transition group-hover:text-violet-700" aria-hidden="true" />
                </div>
                <p className="mt-4 line-clamp-2 text-sm leading-6 text-zinc-600">{campaign.title}</p>
                <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4 text-sm">
                  <span className="text-zinc-500">Per approved outcome</span>
                  <span className="font-semibold text-zinc-950">${(campaign.cpaAmountCents / 100).toFixed(0)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
