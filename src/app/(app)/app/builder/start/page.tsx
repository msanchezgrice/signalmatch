import Link from "next/link";
import { redirect } from "next/navigation";

import { ArrowRight, CheckCircle2, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getAuthContext } from "@/server/auth";
import { getBuilderCampaigns, getBuilderProducts } from "@/server/db/read";

export default async function BuilderStartPage() {
  const authContext = await getAuthContext();

  if (!authContext) {
    redirect("/");
  }

  if (authContext.role !== "BUILDER") {
    redirect("/app");
  }

  const [products, campaigns] = await Promise.all([
    getBuilderProducts(authContext.userId),
    getBuilderCampaigns(authContext.userId),
  ]);

  const hasProducts = products.length > 0;
  const hasCampaigns = campaigns.length > 0;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-200/80 bg-white/95 p-6 md:p-8">
        <Badge className="mb-3 bg-primary/15 text-primary hover:bg-primary/20">
          Builder onboarding
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Launch your first creator campaign
        </h1>
        <p className="mt-2 max-w-3xl text-zinc-600">
          Follow this sequence to go from product setup to attributable conversions.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-zinc-200/80 bg-white/95">
          <CardHeader>
            <CardTitle className="text-base">1. Add your product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-600">
            <p>Create a product and generate a conversion API key.</p>
            <p>Status: {hasProducts ? "done" : "pending"}</p>
            <Link href={hasProducts ? "/app/builder/products" : "/app/builder/products/new"}>
              <Button size="sm" variant={hasProducts ? "outline" : "default"}>
                {hasProducts ? "View products" : "Create product"}
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="border-zinc-200/80 bg-white/95">
          <CardHeader>
            <CardTitle className="text-base">2. Create campaign</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-600">
            <p>Define conversion, CPA, approval mode, and budget.</p>
            <p>Status: {hasCampaigns ? "done" : "pending"}</p>
            <Link href="/app/builder/campaigns/new">
              <Button size="sm" variant={hasCampaigns ? "outline" : "default"}>
                {hasCampaigns ? "Create another campaign" : "Create campaign"}
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="border-zinc-200/80 bg-white/95">
          <CardHeader>
            <CardTitle className="text-base">3. Invite creators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-600">
            <p>Invite matching creators and monitor conversions.</p>
            <Link href="/app/builder/campaigns">
              <Button size="sm" variant="outline">
                Open campaigns
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-200/80 bg-white/95">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            Conversion tracking checklist
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-zinc-500 hover:text-zinc-800">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                This prevents duplicate events and keeps payout decisions auditable.
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-zinc-600">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
            <span>Send conversion events server-to-server with your API key.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
            <span>Pass each creator ref code through signup or activation flow.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
            <span>Use idempotency keys to avoid duplicate conversion records.</span>
          </div>
          <div className="mt-4">
            <Link href="/app/builder/campaigns">
              <Button>
                Go to campaigns
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
