import { notFound, redirect } from "next/navigation";

import { ActionButton } from "@/components/forms/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getCampaignById,
  getCampaignConversionsForBuilder,
  getCampaignPartnershipsForBuilder,
  getCreatorDirectory,
  getMyCampaignAnalytics,
} from "@/server/db/read";
import { getAuthContext } from "@/server/auth";

type Props = { params: Promise<{ id: string }> };

export default async function BuilderCampaignDetailPage({ params }: Props) {
  const authContext = await getAuthContext();

  if (!authContext || (authContext.role !== "BUILDER" && authContext.role !== "ADMIN")) {
    redirect("/app/onboarding");
  }

  const { id } = await params;
  const campaign = await getCampaignById(id);

  if (!campaign || (campaign.owner_user_id !== authContext.userId && authContext.role !== "ADMIN")) {
    notFound();
  }

  const [analytics, partnerships, conversions, creators] = await Promise.all([
    getMyCampaignAnalytics(authContext.userId, id),
    getCampaignPartnershipsForBuilder(authContext.userId, id),
    getCampaignConversionsForBuilder(authContext.userId, id),
    getCreatorDirectory({ limit: 20, offset: 0, verificationStatus: "any" }),
  ]);

  return (
    <div className="space-y-5">
      <Card className="border-zinc-200/80 bg-white/95">
        <CardHeader>
          <CardTitle className="text-2xl">{campaign.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-zinc-600">
          <p>{campaign.brief || "No brief"}</p>
          <p>Budget available: ${(campaign.budget_available_cents / 100).toFixed(2)}</p>
          <ActionButton
            label="Add budget ($100)"
            action={`/api/builder/campaigns/${id}/fund`}
            payload={{ amount_cents: 10000 }}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-zinc-200/80 bg-white/95">
          <CardHeader>
            <CardTitle className="text-base">Clicks</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{analytics?.clicks ?? 0}</CardContent>
        </Card>
        <Card className="border-zinc-200/80 bg-white/95">
          <CardHeader>
            <CardTitle className="text-base">Approved</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{analytics?.approved_conversions ?? 0}</CardContent>
        </Card>
        <Card className="border-zinc-200/80 bg-white/95">
          <CardHeader>
            <CardTitle className="text-base">Pending</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{analytics?.pending_conversions ?? 0}</CardContent>
        </Card>
        <Card className="border-zinc-200/80 bg-white/95">
          <CardHeader>
            <CardTitle className="text-base">Paid out</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            ${((Number(analytics?.total_paid_out_cents) || 0) / 100).toFixed(2)}
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-200/80 bg-white/95">
        <CardHeader>
          <CardTitle>Invite creators</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {creators.creators.map((creator) => (
            <div key={creator.creator_profile_id} className="rounded-lg border border-zinc-200 p-3">
              <p className="font-medium">{creator.display_name}</p>
              <p className="mb-2 text-xs text-zinc-500">{creator.niches.join(", ") || "n/a"}</p>
              <ActionButton
                label="Invite"
                action={`/api/builder/campaigns/${id}/invite`}
                payload={{
                  creator_user_id: (creator as any).user_id,
                  terms_snapshot: {
                    cpa_amount_cents: campaign.cpa_amount_cents,
                    conversion_type: campaign.conversion_type,
                  },
                }}
                variant="outline"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-zinc-200/80 bg-white/95">
        <CardHeader>
          <CardTitle>Partnerships</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {partnerships.map((partnership: any) => (
            <div key={partnership.id} className="flex items-center justify-between rounded-lg border p-2">
              <span>
                {partnership.display_name || "Creator"} · {partnership.status}
              </span>
              <code>{`/r/${partnership.ref_code}`}</code>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-zinc-200/80 bg-white/95">
        <CardHeader>
          <CardTitle>Conversions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {conversions.map((conversion: any) => (
            <div key={conversion.id} className="flex items-center justify-between rounded-lg border p-2">
              <span>
                {conversion.event_type} · {conversion.status} · {conversion.ref_code}
              </span>
              {conversion.status === "pending" ? (
                <ActionButton
                  label="Approve"
                  action={`/api/builder/conversions/${conversion.id}/approve`}
                  variant="outline"
                />
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
