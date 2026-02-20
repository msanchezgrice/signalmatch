import Link from "next/link";
import { redirect } from "next/navigation";

import { ArrowRight, CheckCircle2, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getAuthContext } from "@/server/auth";
import { getCreatorPartnerships, getCreatorProfileByUserId } from "@/server/db/read";

export default async function CreatorStartPage() {
  const authContext = await getAuthContext();

  if (!authContext) {
    redirect("/");
  }

  if (authContext.role !== "CREATOR") {
    redirect("/app");
  }

  const [profile, partnerships] = await Promise.all([
    getCreatorProfileByUserId(authContext.userId),
    getCreatorPartnerships(authContext.userId),
  ]);

  const hasProfile = Boolean(profile);
  const hasActivePartnership = partnerships.some((item: any) => item.status === "active");

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-200/80 bg-white/95 p-6 md:p-8">
        <Badge className="mb-3 bg-primary/15 text-primary hover:bg-primary/20">
          Creator onboarding
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Get partnership-ready in three steps
        </h1>
        <p className="mt-2 max-w-3xl text-zinc-600">
          Complete profile, accept quality campaigns, and share trusted links with your audience.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-zinc-200/80 bg-white/95">
          <CardHeader>
            <CardTitle className="text-base">1. Complete profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-600">
            <p>Add niches and channel stats so builders can match you correctly.</p>
            <p>Status: {hasProfile ? "done" : "pending"}</p>
            <Link href="/app/creator/profile">
              <Button size="sm" variant={hasProfile ? "outline" : "default"}>
                {hasProfile ? "Update profile" : "Create profile"}
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="border-zinc-200/80 bg-white/95">
          <CardHeader>
            <CardTitle className="text-base">2. Review partnerships</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-600">
            <p>Accept campaigns with terms and products you trust.</p>
            <p>Status: {hasActivePartnership ? "active partnerships" : "no active partnerships"}</p>
            <Link href="/app/creator/partnerships">
              <Button size="sm" variant="outline">
                Open partnerships
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="border-zinc-200/80 bg-white/95">
          <CardHeader>
            <CardTitle className="text-base">3. Connect payouts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-600">
            <p>Connect Stripe Express to receive payouts when conversions are approved.</p>
            <Link href="/app/creator/payouts">
              <Button size="sm" variant="outline">
                Open payouts
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-200/80 bg-white/95">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            Referral link best practices
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-zinc-500 hover:text-zinc-800">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                Better link placement and audience targeting usually improve qualified conversion rate.
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-zinc-600">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
            <span>Explain who the product is for before sharing your referral link.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
            <span>Use one canonical link per campaign so attribution stays clean.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
            <span>Set expectations honestly to protect trust and reduce low-quality signups.</span>
          </div>
          <div className="mt-4">
            <Link href="/app/creator/partnerships">
              <Button>
                Go to partnerships
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
