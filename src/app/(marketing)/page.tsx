import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const builderFlow = [
  {
    title: "Create product + campaign",
    body: "Define conversion event, CPA amount, and budget before you invite anyone.",
  },
  {
    title: "Invite matching creators",
    body: "Browse creator profiles by niche, platform, and audience fit, then send partnership terms.",
  },
  {
    title: "Track and approve outcomes",
    body: "Use referral codes + conversion API to verify events, approve conversions, and control spend.",
  },
];

const creatorFlow = [
  {
    title: "Set up your creator profile",
    body: "Publish channels, follower stats, and content niches so builders can find relevant fit.",
  },
  {
    title: "Accept campaigns you trust",
    body: "Review CPA terms and conversion definitions before accepting each partnership.",
  },
  {
    title: "Share links and get paid",
    body: "Drive qualified traffic with your ref link and receive payouts for approved conversions.",
  },
];

const campaignExamples = [
  {
    title: "AI Note Assistant",
    audience: "Indie hackers, technical founders",
    conversion: "Signup with onboarding complete",
    cpa: "$8.00",
  },
  {
    title: "Sales Call Copilot",
    audience: "Sales creators, RevOps operators",
    conversion: "Trial account activated",
    cpa: "$15.00",
  },
  {
    title: "Video Editing Agent",
    audience: "YouTube growth educators",
    conversion: "Qualified free signup",
    cpa: "$6.50",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-16 md:space-y-14 md:px-8 md:py-24">
      <section className="animate-in fade-in rounded-3xl border border-zinc-200/80 bg-white/90 p-8 shadow-sm duration-500 md:p-14">
        <Badge className="mb-5 bg-primary/15 text-primary hover:bg-primary/20">
          SignalMatch Marketplace
        </Badge>
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
          Performance partnerships for AI products and trusted creators.
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-zinc-600 md:text-xl">
          SignalMatch connects builders and AI curators in one CPA workflow:
          invite, attribute, approve conversions, and trigger payouts from a
          single dashboard.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/app">
            <Button size="lg">Start in dashboard</Button>
          </Link>
          <Link href="/explore/creators">
            <Button variant="outline" size="lg">
              Explore creator directory
            </Button>
          </Link>
          <Link href="/explore/campaigns">
            <Button variant="outline" size="lg">
              Explore campaign directory
            </Button>
          </Link>
        </div>
        <div className="mt-8 grid gap-3 text-sm text-zinc-600 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white/80 p-3">
            Builder controls for budget, approval, and payout policy.
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white/80 p-3">
            Creator profiles with channels, niches, and social proof.
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white/80 p-3">
            API-backed conversion attribution with idempotency protection.
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="border-zinc-200/80 bg-white/95">
          <CardHeader>
            <CardTitle>How it works for builders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-600">
            {builderFlow.map((step, index) => (
              <div key={step.title} className="rounded-xl border border-zinc-200 p-3">
                <p className="font-medium text-zinc-900">
                  {index + 1}. {step.title}
                </p>
                <p className="mt-1">{step.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-zinc-200/80 bg-white/95">
          <CardHeader>
            <CardTitle>How it works for creators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-600">
            {creatorFlow.map((step, index) => (
              <div key={step.title} className="rounded-xl border border-zinc-200 p-3">
                <p className="font-medium text-zinc-900">
                  {index + 1}. {step.title}
                </p>
                <p className="mt-1">{step.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-4">
          <Badge className="bg-primary/15 text-primary hover:bg-primary/20">Examples</Badge>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Campaigns that fit the platform</h2>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Use clear conversion definitions and narrow audience targeting so creators can produce qualified pipeline.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {campaignExamples.map((example) => (
            <Card key={example.title} className="border-zinc-200/80 bg-white/95">
              <CardHeader>
                <CardTitle className="text-lg">{example.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-zinc-600">
                <p>
                  <span className="font-medium text-zinc-900">Audience:</span> {example.audience}
                </p>
                <p>
                  <span className="font-medium text-zinc-900">Conversion:</span> {example.conversion}
                </p>
                <p>
                  <span className="font-medium text-zinc-900">Example CPA:</span> {example.cpa}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {[
          [
            "What gets tracked",
            "Ref redirects, conversion events, idempotency keys, approval status, payout status, and campaign budget movement.",
          ],
          [
            "Safety controls",
            "Role-based access, API key hashing, rate limits on conversion intake, and manual approval mode when needed.",
          ],
        ].map(([title, body]) => (
          <Card key={title} className="border-zinc-200/80 bg-white/95">
            <CardHeader>
              <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-zinc-600">{body}</CardContent>
          </Card>
        ))}
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <Card className="border-zinc-200/80 bg-white/95">
          <CardHeader>
            <CardTitle>Frequently asked questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-600">
            <div>
              <p className="font-medium text-zinc-900">Do builders pay upfront?</p>
              <p>Builders fund campaign budget, then spend is consumed only when conversions are approved.</p>
            </div>
            <div>
              <p className="font-medium text-zinc-900">How are conversions submitted?</p>
              <p>Products send server-side events to the conversion API using product-scoped API keys.</p>
            </div>
            <div>
              <p className="font-medium text-zinc-900">When do creators get paid?</p>
              <p>After approval and budget check. If Stripe account is connected, payouts are settled automatically.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-200/80 bg-zinc-900 text-zinc-100">
          <CardHeader>
            <CardTitle>Ready to launch your first performance partnership?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-zinc-300">
            <p>Set up your role, complete your profile, and run a live campaign in minutes.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/app">
                <Button size="lg">Go to dashboard</Button>
              </Link>
              <Link href="/builders">
                <Button variant="outline" size="lg">
                  Builder details
                </Button>
              </Link>
              <Link href="/creators">
                <Button variant="outline" size="lg">
                  Creator details
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
