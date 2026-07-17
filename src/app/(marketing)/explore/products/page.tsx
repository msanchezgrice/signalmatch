import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { getProductDirectory } from "@/server/db/read";

export const metadata: Metadata = {
  title: "Browse Verified Products and Companies | SignalMatch",
  description:
    "Vet real products, company websites, categories, product previews, and active creator campaigns before choosing what to promote.",
  alternates: { canonical: "/explore/products" },
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductDirectoryPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query : undefined;
  const data = await getProductDirectory({ query, limit: 24, offset: 0 });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
      <section className="rounded-[2rem] bg-gradient-to-br from-cyan-50 via-white to-violet-50 p-7 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">Verified product directory</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-zinc-950 md:text-6xl">Know the product before you share it.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">Browse real company websites, product previews, categories, and live partnership terms. Every listed product has at least one active creator campaign.</p>
        <form action="/explore/products" className="mt-6 max-w-xl">
          <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" /><Input name="query" defaultValue={query} placeholder="Search products, companies, or categories" className="h-11 rounded-full border-zinc-300 bg-white pl-9" /></div>
        </form>
      </section>

      <div className="mt-8 flex items-end justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Products with live opportunities</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Companies creators can vet now</h2></div>
        <Link href="/explore/campaigns" className="hidden text-sm font-semibold text-violet-700 md:block">Browse campaigns →</Link>
      </div>

      {data.products.length > 0 ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {data.products.map((product) => (
            <Link key={product.product_id} href={`/explore/products/${product.product_id}`} className="group overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-[0_18px_60px_rgba(24,24,27,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(24,24,27,0.13)]">
              <div className="aspect-[16/9] overflow-hidden bg-zinc-100">{product.screenshot_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.screenshot_url} alt={`${product.name} website preview`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
              ) : <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-100 via-white to-cyan-100 text-2xl font-semibold text-zinc-700">{product.name}</div>}</div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700"><BadgeCheck className="size-4" /> Verified website</div><h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-950">{product.name}</h3></div><ArrowUpRight className="size-5 text-zinc-400 group-hover:text-violet-700" /></div>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600">{product.description || product.website_description}</p>
                <div className="mt-4 flex flex-wrap gap-2">{product.category_tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600">{tag}</span>)}</div>
                <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4 text-sm"><span className="text-zinc-500">{product.campaign_count} live {product.campaign_count === 1 ? "campaign" : "campaigns"}</span><span className="font-semibold text-zinc-950">Up to ${(product.max_cpa_amount_cents / 100).toFixed(0)} / outcome</span></div>
              </div>
            </Link>
          ))}
        </div>
      ) : <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-600">No products matched “{query}”.</div>}
    </div>
  );
}
