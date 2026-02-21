import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const creatorSteps = [
  "Create your profile with niches and audience tags.",
  "Connect channel stats so builders can evaluate fit.",
  "Accept partnerships with clear CPA terms.",
  "Share your referral links and drive high-intent actions.",
  "Receive payouts on approved conversions.",
];

export default function CreatorsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8 md:py-20">
      <section className="rounded-[2rem] bg-gradient-to-br from-rose-50 via-white to-orange-100 p-8 md:p-12">
        <Badge className="bg-zinc-900/90 text-white hover:bg-zinc-900">For creators</Badge>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
          Monetize trusted recommendations with performance terms.
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-zinc-700">
          Join campaigns where terms are clear up front. Get a dedicated ref link, track attributed outcomes, and get paid after approvals.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/creators/sign-up">
            <Button size="lg">Create creator account</Button>
          </Link>
          <Link href="/explore/campaigns">
            <Button variant="outline" size="lg">
              Browse campaigns
            </Button>
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-5">
        {creatorSteps.map((step, index) => (
          <div key={step} className="border-l-2 border-rose-300 pl-4">
            <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">{index + 1}</p>
            <p className="mt-2 text-sm text-zinc-700">{step}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
