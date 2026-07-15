import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthContext } from "@/server/auth";
import { getBuilderCampaigns } from "@/server/db/read";

export default async function BuilderCampaignsPage() {
  const authContext = await getAuthContext();

  if (!authContext) {
    redirect("/");
  }

  if (authContext.role !== "BUILDER") {
    redirect("/app");
  }

  const campaigns = await getBuilderCampaigns(authContext.userId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
        <Button asChild>
          <Link href="/app/builder/campaigns/new">Create campaign</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {campaigns.length === 0 ? (
          <Card className="app-surface md:col-span-2">
            <CardContent className="flex flex-col items-start py-10">
              <p className="app-strong-text text-base font-semibold">
                Define your first measurable outcome
              </p>
              <p className="app-muted-text mt-2 max-w-xl text-sm leading-6">
                Create a campaign with a conversion event, CPA, budget, and
                approval policy. You can review every detail before inviting
                creators.
              </p>
              <Button asChild className="mt-5">
                <Link href="/app/builder/campaigns/new">
                  Create your first campaign
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : null}
        {campaigns.map((campaign: any) => (
          <Link
            key={campaign.id}
            href={`/app/builder/campaigns/${campaign.id}`}
          >
            <Card className="app-surface transition hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{campaign.title}</CardTitle>
              </CardHeader>
              <CardContent className="app-muted-text space-y-2 text-sm">
                <p>Product: {campaign.product_name}</p>
                <p>Status: {campaign.status}</p>
                <p>
                  Budget available: $
                  {(campaign.budget_available_cents / 100).toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
