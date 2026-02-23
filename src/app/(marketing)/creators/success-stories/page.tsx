import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const stories = [
  {
    creator: "Nia Park",
    audience: "Marketing and GTM teams",
    product: "AI Meeting Prep Assistant",
    result: "$640 earned in 5 weeks",
    detail:
      "Shared practical short-form workflows on TikTok and X. Accepted only one product she already used in her own stack.",
  },
  {
    creator: "Mateo Lin",
    audience: "Indie hackers and technical founders",
    product: "Agentic coding copilot",
    result: "52 approved signups",
    detail:
      "Posted technical implementation threads and one live demo. High audience-product fit drove strong conversion quality.",
  },
  {
    creator: "Elena Brooks",
    audience: "Growth and analytics leads",
    product: "Experiment tracking platform",
    result: "$480 earned from activation campaign",
    detail:
      "Built one LinkedIn carousel and one newsletter breakdown focused on the exact activation criteria.",
  },
];

const whatWon = [
  "Promoting products creators already used and trusted.",
  "Explaining one clear use case instead of broad product overviews.",
  "Matching content format to audience intent across TikTok, X, and LinkedIn.",
  "Focusing on conversion quality over raw click volume.",
];

export default function CreatorSuccessStoriesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-20">
      <section className="rounded-[2rem] bg-gradient-to-br from-rose-100 via-orange-50 to-amber-100 p-7 md:p-10">
        <Badge className="bg-zinc-900/90 text-white hover:bg-zinc-900">Creator success stories</Badge>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-zinc-900 md:text-6xl">
          Creators earning from products they actually trust.
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-zinc-700">
          These are representative early SignalMatch examples showing how creators turn trusted recommendations into paid outcomes.
        </p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {stories.map((story) => (
          <article key={story.creator} className="rounded-3xl border border-zinc-200 bg-white p-6">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">{story.creator}</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900">{story.result}</h2>
            <p className="mt-2 text-sm text-zinc-700">{story.detail}</p>
            <div className="mt-4 space-y-1 text-sm text-zinc-600">
              <p>
                <span className="font-medium text-zinc-900">Audience:</span> {story.audience}
              </p>
              <p>
                <span className="font-medium text-zinc-900">Product:</span> {story.product}
              </p>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">What these creators did right</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {whatWon.map((item) => (
            <p key={item} className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl bg-zinc-900 p-7 text-zinc-100 md:p-10">
        <h2 className="text-3xl font-semibold tracking-tight">Want this to be your next case study?</h2>
        <p className="mt-3 max-w-2xl text-zinc-300">
          Set up your creator account, choose products you genuinely believe in, and start sharing offers that fit your audience.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/creators/sign-up">
            <Button size="lg">Create creator account</Button>
          </Link>
          <Link href="/explore/campaigns">
            <Button size="lg" variant="outline">
              See products creators share
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
