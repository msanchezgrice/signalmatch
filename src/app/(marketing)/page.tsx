import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const builderFlow = [
  {
    title: "Define success",
    body: "Choose signup or activation, set your CPA, and cap campaign budget before launch.",
  },
  {
    title: "Invite aligned creators",
    body: "Filter by niche, audience tags, and channel quality to recruit the right creators.",
  },
  {
    title: "Track every conversion",
    body: "Use referral codes and idempotent events so every approval has clear source attribution.",
  },
  {
    title: "Pay only for outcomes",
    body: "Approve quality conversions and release payouts from funded campaign budgets.",
  },
];

const campaignExamples = [
  {
    product: "AI Note Assistant",
    audience: "Startup operators and founders",
    event: "Signup + first workflow created",
    cpa: "$8.00",
  },
  {
    product: "Sales Call Copilot",
    audience: "Sales creators and RevOps",
    event: "Trial activated with CRM connected",
    cpa: "$15.00",
  },
  {
    product: "Support QA Agent",
    audience: "CX and support leaders",
    event: "Activation after first QA report",
    cpa: "$11.00",
  },
];

const faqs = [
  {
    q: "Do I pay creators before results?",
    a: "No. Spend is consumed only when conversions are approved.",
  },
  {
    q: "Can I review conversions manually?",
    a: "Yes. Enable manual approvals when you want tighter quality control.",
  },
  {
    q: "How quickly can we launch?",
    a: "Most teams can launch their first campaign in under one hour.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-20">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-100 via-amber-50 to-rose-100 px-6 py-10 md:px-12 md:py-14">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-200/50 blur-3xl" />
        <div className="absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-200/45 blur-3xl" />
        <div className="relative">
          <Badge className="bg-zinc-900/90 text-white hover:bg-zinc-900">Builder-first marketplace</Badge>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-zinc-900 md:text-6xl">
            Find users for your product with trusted creators.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-700 md:text-xl">
            Launch creator partnerships with CPA terms, reliable attribution, and quality controls built for growth teams.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/builders/sign-up">
              <Button size="lg" className="gap-2">
                Find creators now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/explore/creators">
              <Button variant="outline" size="lg">
                Explore creator directory
              </Button>
            </Link>
          </div>
          <p className="mt-5 text-sm text-zinc-600">
            Creator? <Link className="font-medium text-zinc-900 underline underline-offset-4" href="/creators/sign-up">Join as a creator</Link> or <Link className="font-medium text-zinc-900 underline underline-offset-4" href="/creators/sign-in">sign in</Link>.
          </p>
        </div>
      </section>

      <section className="mt-12 grid gap-8 md:grid-cols-4">
        {builderFlow.map((step, index) => (
          <div key={step.title} className="border-l-2 border-orange-300/80 pl-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">Step {index + 1}</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900">{step.title}</h2>
            <p className="mt-2 text-sm text-zinc-600">{step.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
        <div className="grid grid-cols-4 border-b border-zinc-200 bg-zinc-50 px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-zinc-500 md:px-7">
          <p className="col-span-2">Example Campaign</p>
          <p>Conversion Event</p>
          <p>CPA</p>
        </div>
        {campaignExamples.map((row) => (
          <div key={row.product} className="grid grid-cols-4 gap-3 border-b border-zinc-200 px-5 py-4 text-sm text-zinc-700 last:border-b-0 md:px-7">
            <div className="col-span-2">
              <p className="font-semibold text-zinc-900">{row.product}</p>
              <p className="mt-1 text-zinc-600">{row.audience}</p>
            </div>
            <p>{row.event}</p>
            <p className="font-semibold text-zinc-900">{row.cpa}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Why builders use SignalMatch</h2>
          <div className="mt-4 space-y-3 text-zinc-700">
            {[
              "Creator profiles include niches, audience tags, and channel performance.",
              "Referral codes and conversion APIs keep attribution clean.",
              "Manual or automatic approvals let you control quality and spend.",
              "Payout flow is tied to approved outcomes, not vanity metrics.",
            ].map((item) => (
              <p key={item} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>{item}</span>
              </p>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-zinc-900 p-7 text-zinc-100 md:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">FAQ</p>
          <div className="mt-4 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <p className="font-medium">{faq.q}</p>
                <p className="mt-1 text-sm text-zinc-300">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/builders/sign-up">
              <Button size="lg">Start as builder</Button>
            </Link>
            <Link href="/builders">
              <Button size="lg" variant="outline">
                Read builder guide
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
