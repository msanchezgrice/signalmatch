import { redirect } from "next/navigation";

import { ActionButton } from "@/components/forms/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthContext } from "@/server/auth";
import { getAdminOverview, getCampaignsForAdmin, getCreatorsForAdmin } from "@/server/db/read";

export default async function AdminPage() {
  const authContext = await getAuthContext();

  if (!authContext || authContext.role !== "ADMIN") {
    redirect("/app");
  }

  const [overview, creators, campaigns] = await Promise.all([
    getAdminOverview(),
    getCreatorsForAdmin(),
    getCampaignsForAdmin(),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Unverified creators</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{overview.unverifiedCreators}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Draft campaigns</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{overview.draftCampaigns}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Due payouts</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{overview.duePayouts}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Creator verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {creators.map((creator: any) => (
            <div key={creator.id} className="flex items-center justify-between rounded-lg border p-2">
              <span>
                {creator.display_name} · {creator.verification_status}
              </span>
              <ActionButton
                label={creator.verification_status === "verified" ? "Mark unverified" : "Verify"}
                action={`/api/admin/creators/${creator.id}/verify`}
                payload={{
                  status:
                    creator.verification_status === "verified"
                      ? "unverified"
                      : "verified",
                }}
                variant="outline"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Disputes / freeze payouts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {campaigns.map((campaign: any) => (
            <div key={campaign.id} className="flex items-center justify-between rounded-lg border p-2">
              <span>
                {campaign.title} · {campaign.status}
              </span>
              <ActionButton
                label="Freeze payouts"
                action={`/api/admin/campaigns/${campaign.id}/freeze`}
                variant="destructive"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
