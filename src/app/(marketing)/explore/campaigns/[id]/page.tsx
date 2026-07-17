import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getShowcaseCampaign } from "@/lib/showcase-campaigns";
import { getPublicCampaignById } from "@/server/db/read";

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

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 md:px-8">
      <section className="rounded-[2rem] bg-gradient-to-br from-rose-50 via-white to-orange-50 p-7 md:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-500">Campaign opportunity</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
          {campaign.title}
        </h1>
        <p className="mt-3 text-zinc-700">Product: {campaign.product_name}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-zinc-900 px-3 py-1.5 text-white">
            ${(campaign.cpa_amount_cents / 100).toFixed(2)} payout
          </span>
          <span className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-zinc-700">
            {conversionLabel(campaign.conversion_type)}
          </span>
          <span className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-zinc-700">
            {campaign.status}
          </span>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-3xl border border-zinc-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Campaign brief</h2>
          <p className="mt-3 text-zinc-700">{campaign.brief || "No campaign brief provided yet."}</p>
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Audience tags</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <span key={tag} className="rounded-full bg-orange-100/70 px-2.5 py-1 text-xs text-zinc-700">
                  {tag}
                </span>
              ))
            ) : (
              <p className="text-sm text-zinc-600">No tags listed yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl bg-zinc-900 p-7 text-zinc-100 md:p-10">
        <h2 className="text-2xl font-semibold tracking-tight">Ready to share products you already trust?</h2>
        <p className="mt-3 max-w-2xl text-zinc-300">
          Create your creator account, accept campaigns that fit your audience, and start earning from
          approved outcomes.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/creators/sign-up">
            <Button size="lg">Create creator account</Button>
          </Link>
          <Link href="/explore/campaigns">
            <Button size="lg" variant="outline">
              Back to products shared
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
