import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const builderSteps = [
  "Create a product record and rotate your conversion API key.",
  "Launch a campaign with CPA amount, conversion type, and budget limits.",
  "Invite relevant creators with terms snapshots.",
  "Collect conversion events using referral codes + idempotency keys.",
  "Approve conversions automatically or manually.",
  "Settle creator payouts from campaign budget.",
];

const briefs = [
  {
    title: "AI Workflow Assistant",
    cpa: "$7 signup",
    brief:
      "Target technical founders and operators. Count only signups with first workflow completed.",
  },
  {
    title: "Outbound Agent",
    cpa: "$12 activation",
    brief:
      "Target B2B sales audiences. Count only accounts that connect email + send first sequence.",
  },
  {
    title: "Research Copilot",
    cpa: "$9 signup",
    brief:
      "Target analysts and PMs. Count signups that create first project in first session.",
  },
];

export default function BuildersPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-16 md:space-y-14 md:px-8 md:py-24">
      <section className="rounded-3xl border border-zinc-200/80 bg-white/90 p-8 shadow-sm md:p-14">
        <Badge className="mb-5 bg-primary/15 text-primary hover:bg-primary/20">For builders</Badge>
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
          Run creator-led growth with CPA control and full attribution.
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-zinc-600 md:text-xl">
          SignalMatch helps you launch campaigns with measurable outcomes.
          You only pay for approved conversions, not impressions.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/app">
            <Button size="lg">Create a campaign</Button>
          </Link>
          <Link href="/explore/creators">
            <Button variant="outline" size="lg">
              Find creators
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="border-zinc-200/80 bg-white/95">
          <CardHeader>
            <CardTitle>How builder workflow works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-600">
            {builderSteps.map((step, index) => (
              <div key={step} className="rounded-xl border border-zinc-200 p-3">
                <p className="font-medium text-zinc-900">
                  {index + 1}. {step}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-zinc-200/80 bg-white/95">
          <CardHeader>
            <CardTitle>What gets tracked for every campaign</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-600">
            <div className="rounded-xl border border-zinc-200 p-3">
              Referral codes generated per partnership.
            </div>
            <div className="rounded-xl border border-zinc-200 p-3">
              Conversion events with type, external user hash, and idempotency key.
            </div>
            <div className="rounded-xl border border-zinc-200 p-3">
              Approval state changes and payout state transitions.
            </div>
            <div className="rounded-xl border border-zinc-200 p-3">
              Campaign budget availability after each approved conversion.
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-4">
          <Badge className="bg-primary/15 text-primary hover:bg-primary/20">Examples</Badge>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Example campaign briefs</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {briefs.map((brief) => (
            <Card key={brief.title} className="border-zinc-200/80 bg-white/95">
              <CardHeader>
                <CardTitle className="text-lg">{brief.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-zinc-600">
                <p>
                  <span className="font-medium text-zinc-900">CPA:</span> {brief.cpa}
                </p>
                <p>{brief.brief}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200/80 bg-white/95 p-8 md:p-10">
        <h2 className="text-2xl font-semibold tracking-tight">Launch checklist</h2>
        <div className="mt-4 grid gap-3 text-sm text-zinc-600 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 p-3">Define one conversion event with zero ambiguity.</div>
          <div className="rounded-xl border border-zinc-200 p-3">Set CPA based on expected payback period.</div>
          <div className="rounded-xl border border-zinc-200 p-3">Start with manual approvals for your first campaign.</div>
          <div className="rounded-xl border border-zinc-200 p-3">Fund enough budget for 50 to 100 conversions.</div>
          <div className="rounded-xl border border-zinc-200 p-3">Invite creators with strong audience-product fit.</div>
          <div className="rounded-xl border border-zinc-200 p-3">Review conversion quality before increasing spend.</div>
        </div>
      </section>
    </div>
  );
}
