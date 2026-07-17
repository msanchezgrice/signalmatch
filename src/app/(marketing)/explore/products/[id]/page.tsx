import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, BadgeCheck, ExternalLink, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getPublicCampaignsByProductId, getPublicProductById } from "@/server/db/read";

type Props = { params: Promise<{ id: string }> };

export default async function ProductProfilePage({ params }: Props) {
  const { id } = await params;
  const [product, campaigns] = await Promise.all([
    getPublicProductById(id),
    getPublicCampaignsByProductId(id),
  ]);

  if (!product || campaigns.length === 0) notFound();

  const host = new URL(product.url).hostname.replace(/^www\./, "");
  const categories = (product.category_tags as string[]) ?? [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <Link href="/explore/products" className="text-sm font-semibold text-zinc-600 hover:text-violet-700">← Browse verified products</Link>
      <section className="mt-6 grid overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_30px_90px_rgba(24,24,27,0.1)] lg:grid-cols-[1.2fr_0.8fr]">
        <div className="bg-zinc-100 p-3 md:p-5"><div className="overflow-hidden rounded-[1.4rem] border border-black/10 bg-white shadow-2xl"><div className="flex items-center border-b border-zinc-200 bg-zinc-50 px-4 py-3"><div className="flex gap-1.5"><span className="size-2.5 rounded-full bg-rose-300" /><span className="size-2.5 rounded-full bg-amber-300" /><span className="size-2.5 rounded-full bg-emerald-300" /></div><span className="mx-auto font-mono text-[11px] text-zinc-500">{host}</span></div><div className="aspect-[16/9] overflow-hidden bg-zinc-100">{product.screenshot_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.screenshot_url} alt={`${product.name} website preview`} className="h-full w-full object-cover" />
        ) : <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-100 via-white to-cyan-100 text-3xl font-semibold text-zinc-700">{product.name}</div>}</div></div></div>
        <div className="flex flex-col p-7 md:p-10">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800"><BadgeCheck className="size-4" /> Verified product website</div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-violet-700">Company we work with</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-base leading-7 text-zinc-600">{product.description || product.website_description}</p>
          <div className="mt-5 flex flex-wrap gap-2">{categories.map((tag) => <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-zinc-700">{tag}</span>)}</div>
          <Button asChild size="lg" className="mt-auto w-full"><a href={product.url} target="_blank" rel="noreferrer">Try {product.name} <ExternalLink className="size-4" /></a></Button>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="rounded-3xl bg-zinc-950 p-7 text-white md:p-9"><ShieldCheck className="size-8 text-emerald-300" /><h2 className="mt-5 text-2xl font-semibold">Evidence creators can check</h2><ul className="mt-5 space-y-3 text-sm leading-6 text-white/70"><li>Live website at {host}</li><li>Website title and preview captured from first-party metadata</li><li>Product category and campaign terms reviewed separately</li><li>External try-product link opens the company website directly</li></ul></aside>
        <div className="rounded-3xl border border-zinc-200 bg-white p-7 md:p-9"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-700">Live partnerships</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">Campaigns from {product.name}</h2><div className="mt-5 space-y-4">{campaigns.map((campaign) => <Link key={campaign.campaign_id} href={`/explore/campaigns/${campaign.campaign_id}`} className="group block rounded-2xl border border-zinc-200 p-5 transition hover:border-violet-300 hover:bg-violet-50/30"><div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold text-zinc-950">{campaign.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">{campaign.brief}</p></div><ArrowUpRight className="size-5 shrink-0 text-zinc-400 group-hover:text-violet-700" /></div><div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 text-sm"><span className="text-zinc-500">Per approved outcome</span><span className="font-semibold text-zinc-950">${(campaign.cpa_amount_cents / 100).toFixed(0)}</span></div></Link>)}</div></div>
      </section>
    </div>
  );
}
