import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BuildersHomePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8 md:py-24">
      <section className="rounded-3xl border border-zinc-200/80 bg-white/90 p-8 shadow-sm md:p-14">
        <Badge className="mb-5 bg-primary/15 text-primary hover:bg-primary/20">For builders</Badge>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
          Pay only for qualified users from AI curators.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-zinc-600 md:text-xl">
          Launch CPA campaigns, match with niche AI curators, track attribution, and automate payouts with Stripe Connect.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/app">
            <Button size="lg">Start a campaign</Button>
          </Link>
          <Link href="/explore/creators">
            <Button variant="outline" size="lg">
              Explore creators
            </Button>
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          ["Fund once", "Top up campaign budgets through Stripe Checkout."],
          ["Track cleanly", "Referral redirects + conversion API key auth."],
          ["Payout fast", "Transfer approved CPA payouts via Stripe Connect."],
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
