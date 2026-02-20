import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthContext } from "@/server/auth";
import { getCreatorDeals } from "@/server/db/read";

export default async function CreatorDealsPage() {
  const authContext = await getAuthContext();

  if (!authContext || (authContext.role !== "CREATOR" && authContext.role !== "ADMIN")) {
    redirect("/app/onboarding");
  }

  const deals = await getCreatorDeals(authContext.userId);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Open deals</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {deals.map((deal: any) => (
          <Card key={deal.id} className="border-zinc-200/80 bg-white/95">
            <CardHeader>
              <CardTitle className="text-lg">{deal.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-zinc-600">
              <p>{deal.brief || "No brief"}</p>
              <p>CPA: ${(deal.cpa_amount_cents / 100).toFixed(2)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
