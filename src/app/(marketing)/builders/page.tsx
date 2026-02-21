import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const builderSteps = [
  "Create a product and generate your conversion API key.",
  "Set campaign CPA, conversion event, and budget guardrails.",
  "Invite creators based on audience fit and channel quality.",
  "Track conversion events with referral codes and idempotency keys.",
  "Approve results and release payouts from campaign budget.",
];

const launchChecklist = [
  "Pick one conversion event with zero ambiguity.",
  "Set CPA using your target payback window.",
  "Start with manual approvals for campaign #1.",
  "Fund enough budget for at least 50 conversions.",
  "Review quality weekly before raising spend.",
];

export default function BuildersPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-20">
      <section className="rounded-[2rem] bg-gradient-to-br from-amber-50 via-white to-orange-100 p-8 md:p-12">
        <Badge className="bg-zinc-900/90 text-white hover:bg-zinc-900">Builder guide</Badge>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
          Builder workflow from first campaign to first approved payout.
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-zinc-700">
          SignalMatch is designed for outcome-based creator growth. You define conversion quality, recruit aligned creators, and pay only when outcomes are approved.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/builders/sign-up">
            <Button size="lg">Start as builder</Button>
          </Link>
          <Link href="/explore/creators">
            <Button size="lg" variant="outline">
              Browse creators
            </Button>
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-5">
        {builderSteps.map((step, index) => (
          <div key={step} className="border-l-2 border-orange-300 pl-4">
            <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">{index + 1}</p>
            <p className="mt-2 text-sm text-zinc-700">{step}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 rounded-3xl border border-zinc-200 bg-white p-7 md:p-10">
        <h2 className="text-2xl font-semibold tracking-tight">Launch checklist</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {launchChecklist.map((item) => (
            <p key={item} className="border-b border-dashed border-zinc-300 pb-2 text-sm text-zinc-700">
              {item}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
