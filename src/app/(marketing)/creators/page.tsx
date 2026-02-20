import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreatorsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8 md:py-24">
      <section className="rounded-3xl border border-zinc-200/80 bg-white/90 p-8 shadow-sm md:p-14">
        <Badge className="mb-5 bg-primary/15 text-primary hover:bg-primary/20">For AI curators</Badge>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
          Get paid to recommend great AI tools.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-zinc-600 md:text-xl">
          Build your profile once, get invited to CPA deals, share your link, and receive fast payouts when qualified users convert.
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

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          ["Clear terms", "See CPA rate, conversion definition, and timeline upfront."],
          ["Track links", "Use one unique referral link per partnership."],
          ["Reliable payouts", "Connect Stripe Express and get paid automatically."],
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
