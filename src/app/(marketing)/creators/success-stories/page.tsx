import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMarketingMetadata } from "@/lib/marketing-metadata";

export const metadata: Metadata = getMarketingMetadata(
  "/creators/success-stories",
);

const stories = [
  {
    creator: "Illustrative creator A",
    audience: "Marketing and GTM teams",
    product: "AI Meeting Prep Assistant",
    result: "Hypothetical five-week CPA scenario",
    detail:
      "Shared practical short-form workflows on TikTok and X. Accepted only one product she already used in her own stack.",
  },
  {
    creator: "Illustrative creator B",
    audience: "Indie hackers and technical founders",
    product: "Agentic coding copilot",
    result: "Hypothetical approved-signup scenario",
    detail:
      "Posted technical implementation threads and one live demo. High audience-product fit drove strong conversion quality.",
  },
  {
    creator: "Illustrative creator C",
    audience: "Growth and analytics leads",
    product: "Experiment tracking platform",
    result: "Hypothetical activation campaign",
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
        <Badge className="bg-zinc-900/90 text-white hover:bg-zinc-900">
          Illustrative campaign scenarios
        </Badge>
        <h1 className="mt-4 max-w-4xl text-4xl leading-tight font-semibold tracking-tight text-zinc-900 md:text-6xl">
          What a well-scoped creator campaign could look like.
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-zinc-700">
          These are fictional teaching examples, not testimonials, live campaign
          records, or earnings claims. Real case studies will be labeled with
          permission and methodology.
        </p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {stories.map((story) => (
          <article
            key={story.creator}
            className="rounded-3xl border border-zinc-200 bg-white p-6"
          >
            <p className="text-xs font-medium tracking-[0.15em] text-zinc-500 uppercase">
              {story.creator}
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900">
              {story.result}
            </h2>
            <p className="mt-2 text-sm text-zinc-700">{story.detail}</p>
            <div className="mt-4 space-y-1 text-sm text-zinc-600">
              <p>
                <span className="font-medium text-zinc-900">Audience:</span>{" "}
                {story.audience}
              </p>
              <p>
                <span className="font-medium text-zinc-900">Product:</span>{" "}
                {story.product}
              </p>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          What the scenarios are designed to teach
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {whatWon.map((item) => (
            <p
              key={item}
              className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-700"
            >
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl bg-zinc-900 p-7 text-zinc-100 md:p-10">
        <h2 className="text-3xl font-semibold tracking-tight">
          Want this to be your next case study?
        </h2>
        <p className="mt-3 max-w-2xl text-zinc-300">
          Set up your creator account, choose products you genuinely believe in,
          and start sharing offers that fit your audience.
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
