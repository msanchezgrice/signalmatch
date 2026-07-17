import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, BadgeCheck, Building2, ExternalLink, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getShowcaseCampaign } from "@/lib/showcase-campaigns";
import { getPublicCampaignById, getPublicCampaignsByProductId } from "@/server/db/read";

type Props = { params: Promise<{ id: string }> };

function conversionLabel(type: string) {
  if (type === "activation") {
    return "Activated account";
  }

  return "Qualified signup";
}

export default async function CampaignDetailPage({ params }: Props) {
  const { id } = await params;
  const showcaseCampaign = getShowcaseCampaign(id);

  if (showcaseCampaign) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8">
        <div className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-center text-xs font-semibold tracking-[0.12em] text-violet-800 uppercase">
          Illustrative campaign example · not currently accepting applicants
        </div>

        <section className="mt-5 grid overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_30px_90px_rgba(24,24,27,0.1)] lg:grid-cols-[1fr_1.1fr]">
          <div className="p-7 md:p-10">
            <p className="text-sm font-semibold tracking-[0.16em] text-violet-700 uppercase">{showcaseCampaign.category}</p>
            <h1 className="mt-4 text-4xl leading-tight font-semibold tracking-tight text-zinc-950 md:text-6xl">
              {showcaseCampaign.productName}
            </h1>
            <p className="mt-4 text-lg leading-8 text-zinc-600">{showcaseCampaign.productDescription}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              <span className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white">
                ${(showcaseCampaign.cpaAmountCents / 100).toFixed(0)} per approved outcome
              </span>
              <span className="rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-700">
                {conversionLabel(showcaseCampaign.conversionType)}
              </span>
            </div>
          </div>

          <div className="p-5 md:p-8" style={{ backgroundColor: showcaseCampaign.preview.accentSoft }}>
            <div className="h-full min-h-80 overflow-hidden rounded-3xl border border-black/10 bg-zinc-950 text-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex gap-2" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-white/25" />
                  <span className="size-2.5 rounded-full bg-white/15" />
                  <span className="size-2.5 rounded-full bg-white/10" />
                </div>
                <span className="font-mono text-xs text-white/45">{showcaseCampaign.productName} workspace</span>
              </div>
              <div className="grid min-h-72 grid-cols-[0.64fr_1.36fr]">
                <div className="border-r border-white/10 p-5">
                  <div className="h-2.5 w-16 rounded-full bg-white/20" />
                  <div className="mt-6 space-y-3">
                    <div className="h-2 rounded-full bg-white/10" />
                    <div className="h-2 w-5/6 rounded-full bg-white/10" />
                    <div className="h-2 w-2/3 rounded-full bg-white/10" />
                    <div className="h-2 w-4/5 rounded-full bg-white/10" />
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs tracking-[0.16em] text-white/45 uppercase">{showcaseCampaign.preview.metricLabel}</p>
                  <p className="mt-2 text-4xl font-semibold">{showcaseCampaign.preview.metricValue}</p>
                  <div className="mt-7 space-y-3">
                    {showcaseCampaign.preview.rows.map((row, index) => (
                      <div key={row} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.05] px-4 py-3 text-sm text-white/75">
                        <span className="size-2 rounded-full" style={{ backgroundColor: showcaseCampaign.preview.accent }} />
                        <span>{row}</span>
                        <span className="ml-auto font-mono text-xs text-white/35">0{index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-[1.5fr_0.8fr]">
          <div className="rounded-3xl border border-zinc-200 bg-white p-7 md:p-9">
            <p className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">Creator brief</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">What a strong creator would make</h2>
            <p className="mt-4 text-base leading-7 text-zinc-700">{showcaseCampaign.brief}</p>
            <p className="mt-6 text-sm text-zinc-500"><span className="font-semibold text-zinc-800">Best audience:</span> {showcaseCampaign.audience}</p>
          </div>
          <aside className="rounded-3xl bg-zinc-950 p-7 text-white md:p-9">
            <p className="text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">Audience fit</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {showcaseCampaign.targetTags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/75">{tag}</span>
              ))}
            </div>
            <p className="mt-8 text-sm leading-6 text-white/65">Want a campaign like this for your product? Create a builder account and replace every example term with your real offer.</p>
            <Button asChild className="mt-5 w-full bg-white text-zinc-950 hover:bg-white/90">
              <Link href="/builders/sign-up">Launch a real campaign</Link>
            </Button>
          </aside>
        </section>

        <Link href="/explore/campaigns" className="mt-8 inline-flex text-sm font-semibold text-zinc-700 hover:text-violet-700">
          ← Back to campaign library
        </Link>
      </div>
    );
  }

  const campaign = await getPublicCampaignById(id);

  if (!campaign) {
    notFound();
  }

  const tags = (campaign.target_tags as string[]) ?? [];
  const categories = (campaign.product_category_tags as string[]) ?? [];
  const relatedCampaigns = await getPublicCampaignsByProductId(campaign.product_id);
  const productHost = new URL(campaign.product_url).hostname.replace(/^www\./, "");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link href="/explore/campaigns" className="font-semibold text-zinc-600 hover:text-violet-700">← Browse campaigns</Link>
        <Link href={`/explore/products/${campaign.product_id}`} className="inline-flex items-center gap-1.5 font-semibold text-zinc-700 hover:text-violet-700">View company profile <ArrowUpRight className="size-4" /></Link>
      </div>

      <section className="grid overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_30px_90px_rgba(24,24,27,0.1)] lg:grid-cols-[1.35fr_0.85fr]">
        <div className="bg-zinc-100 p-3 md:p-5">
          <div className="overflow-hidden rounded-[1.4rem] border border-black/10 bg-white shadow-2xl">
            <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
              <div className="flex gap-1.5" aria-hidden="true"><span className="size-2.5 rounded-full bg-rose-300" /><span className="size-2.5 rounded-full bg-amber-300" /><span className="size-2.5 rounded-full bg-emerald-300" /></div>
              <span className="mx-auto truncate font-mono text-[11px] text-zinc-500">{productHost}</span>
            </div>
            <div className="aspect-[16/9] overflow-hidden bg-zinc-100">
              {campaign.product_screenshot_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={campaign.product_screenshot_url} alt={`${campaign.product_name} website preview`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-100 via-white to-orange-100 text-3xl font-semibold text-zinc-700">{campaign.product_name}</div>
              )}
            </div>
          </div>
          <p className="mt-3 px-2 text-xs text-zinc-500">Preview sourced from the product&apos;s verified website metadata.</p>
        </div>

        <aside className="flex flex-col p-7 md:p-10">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-800">Live opportunity</span>
            {campaign.product_verified_at ? <span className="inline-flex items-center gap-1 text-emerald-700"><BadgeCheck className="size-4" /> Website verified</span> : null}
          </div>
          <p className="mt-6 text-sm font-semibold text-violet-700">{campaign.product_name}</p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight tracking-tight text-zinc-950">{campaign.title}</h1>
          <p className="mt-4 text-base leading-7 text-zinc-600">{campaign.product_description || campaign.product_website_description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {categories.slice(0, 4).map((category) => <span key={category} className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-zinc-700">{category}</span>)}
          </div>
          <div className="mt-auto grid grid-cols-2 gap-3 border-t border-zinc-200 pt-7">
            <div><p className="text-xs text-zinc-500">Creator payout</p><p className="mt-1 text-3xl font-semibold text-zinc-950">${(campaign.cpa_amount_cents / 100).toFixed(0)}</p></div>
            <div><p className="text-xs text-zinc-500">Approved outcome</p><p className="mt-2 text-sm font-semibold text-zinc-900">{conversionLabel(campaign.conversion_type)}</p></div>
          </div>
          <Button asChild size="lg" className="mt-6 w-full">
            <a href={campaign.product_url} target="_blank" rel="noreferrer">Try {campaign.product_name} <ExternalLink className="size-4" /></a>
          </Button>
          <p className="mt-2 text-center text-xs text-zinc-500">Opens {productHost} in a new tab</p>
        </aside>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl border border-zinc-200 bg-white p-7 md:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Creator brief</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">What to share and what counts</h2>
          <p className="mt-4 text-base leading-7 text-zinc-700">{campaign.brief || "No campaign brief provided yet."}</p>
          <div className="mt-7 flex flex-wrap gap-2">{tags.map((tag) => <span key={tag} className="rounded-full bg-orange-100/70 px-3 py-1.5 text-xs text-zinc-700">{tag}</span>)}</div>
        </div>
        <aside className="rounded-3xl bg-zinc-950 p-7 text-white md:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">Product evidence</p>
          <div className="mt-5 space-y-4 text-sm">
            <div className="flex gap-3"><Building2 className="mt-0.5 size-5 text-cyan-300" /><div><p className="font-semibold">Real product website</p><p className="text-white/60">{productHost}</p></div></div>
            <div className="flex gap-3"><ShieldCheck className="mt-0.5 size-5 text-emerald-300" /><div><p className="font-semibold">{campaign.is_portfolio_owned ? "Portfolio product" : "Website metadata captured"}</p><p className="text-white/60">{campaign.is_portfolio_owned ? "Trusted portfolio entitlement confirmed by SignalMatch." : "Preview and website details come from the listed product domain."}</p></div></div>
          </div>
          <Button asChild variant="outline" className="mt-7 w-full border-white/20 bg-white/5 text-white hover:bg-white/10"><Link href={`/explore/products/${campaign.product_id}`}>Company & product profile</Link></Button>
        </aside>
      </section>

      {relatedCampaigns.length > 1 ? (
        <section className="mt-10"><h2 className="text-2xl font-semibold tracking-tight text-zinc-950">More campaigns from {campaign.product_name}</h2><div className="mt-4 grid gap-4 md:grid-cols-2">{relatedCampaigns.filter((item) => item.campaign_id !== campaign.id).map((item) => <Link key={item.campaign_id} href={`/explore/campaigns/${item.campaign_id}`} className="rounded-2xl border border-zinc-200 bg-white p-5 font-semibold text-zinc-900 hover:border-violet-300">{item.title} <span className="float-right text-violet-700">${(item.cpa_amount_cents / 100).toFixed(0)} →</span></Link>)}</div></section>
      ) : null}

      <section className="mt-10 rounded-3xl bg-gradient-to-br from-violet-950 to-zinc-950 p-7 text-white md:p-10">
        <h2 className="text-2xl font-semibold tracking-tight">Does this fit your audience?</h2>
        <p className="mt-3 max-w-2xl text-white/70">Create your creator account, review the terms, and partner only with products you are comfortable trying and recommending.</p>
        <Button asChild size="lg" className="mt-6 bg-white text-zinc-950 hover:bg-white/90"><Link href="/creators/sign-up">Create creator account</Link></Button>
      </section>
    </div>
  );
}
