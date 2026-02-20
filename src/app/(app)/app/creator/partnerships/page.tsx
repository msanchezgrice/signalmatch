import { redirect } from "next/navigation";

import { ActionButton } from "@/components/forms/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthContext } from "@/server/auth";
import { getCreatorPartnerships } from "@/server/db/read";

export default async function CreatorPartnershipsPage() {
  const authContext = await getAuthContext();

  if (!authContext || (authContext.role !== "CREATOR" && authContext.role !== "ADMIN")) {
    redirect("/app/onboarding");
  }

  const partnerships = await getCreatorPartnerships(authContext.userId);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Partnerships</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {partnerships.map((partnership: any) => (
          <Card key={partnership.id} className="border-zinc-200/80 bg-white/95">
            <CardHeader>
              <CardTitle className="text-lg">{partnership.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-zinc-600">
              <p>Status: {partnership.status}</p>
              <p>CPA: ${(partnership.cpa_amount_cents / 100).toFixed(2)}</p>
              <p>
                Referral: <code>{`/r/${partnership.ref_code}`}</code>
              </p>
              {partnership.status === "invited" ? (
                <ActionButton
                  label="Accept invite"
                  action={`/api/creator/partnerships/${partnership.id}/accept`}
                />
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
