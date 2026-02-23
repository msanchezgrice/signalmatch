import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getCampaignById } from "@/server/db/read";

type Props = { params: Promise<{ id: string }> };

function conversionLabel(type: string) {
  if (type === "activation") {
    return "Activated account";
  }

  return "Qualified signup";
}

export default async function CampaignDetailPage({ params }: Props) {
  const { id } = await params;
  const campaign = await getCampaignById(id);

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
