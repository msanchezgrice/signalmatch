import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthContext } from "@/server/auth";
import { getBuilderCampaigns } from "@/server/db/read";

export default async function BuilderCampaignsPage() {
  const authContext = await getAuthContext();

  if (!authContext || (authContext.role !== "BUILDER" && authContext.role !== "ADMIN")) {
    redirect("/app/onboarding");
  }

  const campaigns = await getBuilderCampaigns(authContext.userId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
        <Link href="/app/builder/campaigns/new">
          <Button>Create campaign</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {campaigns.map((campaign: any) => (
          <Link key={campaign.id} href={`/app/builder/campaigns/${campaign.id}`}>
            <Card className="border-zinc-200/80 bg-white/95 transition hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{campaign.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-zinc-600">
                <p>Product: {campaign.product_name}</p>
                <p>Status: {campaign.status}</p>
                <p>Budget available: ${(campaign.budget_available_cents / 100).toFixed(2)}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
