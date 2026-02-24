import Link from "next/link";
import { redirect } from "next/navigation";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthContext } from "@/server/auth";
import { getCreatorDeals } from "@/server/db/read";

export default async function CreatorDealsPage({
  searchParams,
}: {
  searchParams: Promise<{ onboarding?: string }>;
}) {
  const authContext = await getAuthContext();
  const params = await searchParams;

  if (!authContext) {
    redirect("/");
  }

  if (authContext.role !== "CREATOR") {
    redirect("/app");
  }

  const deals = await getCreatorDeals(authContext.userId);
  const fromOnboarding = params.onboarding === "1";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Suggested partners</h1>
        {fromOnboarding ? (
          <Link href="/app/creator/start">
            <Button variant="outline" size="sm" className="gap-1.5">
              <X className="h-4 w-4" />
              Close
            </Button>
          </Link>
        ) : null}
      </div>
      {fromOnboarding ? (
        <p className="text-sm text-zinc-600">
          Onboarding complete. These are the best-fit partners to start with based on your profile.
        </p>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        {deals.length === 0 ? (
          <Card className="border-zinc-200/80 bg-white/95 md:col-span-2">
            <CardContent className="py-8 text-sm text-zinc-600">
              No partner suggestions yet. Check back soon or continue to your dashboard.
            </CardContent>
          </Card>
        ) : null}
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
