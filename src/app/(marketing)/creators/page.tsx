import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const creatorSteps = [
  "Choose creator role and complete your profile.",
  "Add channels, audience fit, and content niches.",
  "Accept campaign invites with terms you agree with.",
  "Share your unique referral link where your audience already trusts you.",
  "Track results and receive payouts after approved conversions.",
];

const earningScenarios = [
  { volume: "20 approved signups", cpa: "$6.00", earnings: "$120" },
  { volume: "45 approved activations", cpa: "$12.00", earnings: "$540" },
  { volume: "100 approved signups", cpa: "$8.50", earnings: "$850" },
];

export default function CreatorsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-16 md:space-y-14 md:px-8 md:py-24">
      <section className="rounded-3xl border border-zinc-200/80 bg-white/90 p-8 shadow-sm md:p-14">
        <Badge className="mb-5 bg-primary/15 text-primary hover:bg-primary/20">For AI curators</Badge>
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
          Get paid for trusted recommendations that drive real outcomes.
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-zinc-600 md:text-xl">
          SignalMatch helps creators partner with AI builders on clear CPA deals.
          You can see terms upfront, accept selectively, and monetize high-intent audience trust.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/app">
            <Button size="lg">Create creator profile</Button>
          </Link>
          <Link href="/explore/campaigns">
            <Button variant="outline" size="lg">
              Browse campaigns
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="border-zinc-200/80 bg-white/95">
          <CardHeader>
            <CardTitle>How creator workflow works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-600">
            {creatorSteps.map((step, index) => (
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
            <CardTitle>Example profile that gets invited</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-600">
            <div className="rounded-xl border border-zinc-200 p-3">
              <p className="font-medium text-zinc-900">Niches</p>
              <p>AI productivity, founder workflows, go-to-market tooling.</p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-3">
              <p className="font-medium text-zinc-900">Audience tags</p>
              <p>Founders, operators, solo builders.</p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-3">
              <p className="font-medium text-zinc-900">Channel stats</p>
              <p>X: 24k followers, 12k avg impressions, technical explainer format.</p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-3">
              <p className="font-medium text-zinc-900">Deal fit</p>
              <p>Prioritize products you would personally recommend with proof.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-4">
          <Badge className="bg-primary/15 text-primary hover:bg-primary/20">Earning examples</Badge>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">What payout scenarios can look like</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {earningScenarios.map((scenario) => (
            <Card key={scenario.volume} className="border-zinc-200/80 bg-white/95">
              <CardHeader>
                <CardTitle className="text-lg">{scenario.volume}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-zinc-600">
                <p>
                  <span className="font-medium text-zinc-900">CPA:</span> {scenario.cpa}
                </p>
                <p>
                  <span className="font-medium text-zinc-900">Estimated payout:</span> {scenario.earnings}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Clear terms", "See CPA rate, conversion definition, and approval mode before accepting deals."],
          ["Track links", "Every accepted partnership gets a dedicated referral link and ref code."],
          ["Reliable payouts", "Connect Stripe Express so approved conversions move to payouts immediately."],
        ].map(([title, body]) => (
          <Card key={title} className="border-zinc-200/80 bg-white/95">
            <CardHeader>
              <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-zinc-600">{body}</CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
