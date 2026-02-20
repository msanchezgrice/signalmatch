import { redirect } from "next/navigation";

import { ActionButton } from "@/components/forms/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthContext } from "@/server/auth";
import { getCreatorPayouts } from "@/server/db/read";

export default async function CreatorPayoutsPage() {
  const authContext = await getAuthContext();

  if (!authContext) {
    redirect("/");
  }

  if (authContext.role !== "CREATOR") {
    redirect("/app");
  }

  const payouts = await getCreatorPayouts(authContext.userId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Payouts</h1>
        <ActionButton
          label="Connect Stripe"
          action="/api/creator/stripe/connect/start"
          variant="outline"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {payouts.map((payout: any) => (
          <Card key={payout.id} className="border-zinc-200/80 bg-white/95">
            <CardHeader>
              <CardTitle className="text-lg">{payout.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-zinc-600">
              <p>Amount: ${(payout.amount_cents / 100).toFixed(2)}</p>
              <p>Status: {payout.status}</p>
              <p>Transfer: {payout.stripe_transfer_id || "n/a"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
