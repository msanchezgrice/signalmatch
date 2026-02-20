import { redirect } from "next/navigation";
import { CheckCircle2, Clock3, Link2 } from "lucide-react";

import { ActionButton } from "@/components/forms/actions";
import { CopyLinkButton } from "@/components/forms/copy-link-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthContext } from "@/server/auth";
import { getCreatorPartnerships } from "@/server/db/read";
import { env } from "@/server/env";

export default async function CreatorPartnershipsPage() {
  const authContext = await getAuthContext();

  if (!authContext) {
    redirect("/");
  }

  if (authContext.role !== "CREATOR") {
    redirect("/app");
  }

  const partnerships = await getCreatorPartnerships(authContext.userId);
  const invited = partnerships.filter((item: any) => item.status === "invited");
  const active = partnerships.filter((item: any) => item.status === "active");
  const others = partnerships.filter(
    (item: any) => item.status !== "invited" && item.status !== "active",
  );

  return (
    <div className="space-y-5">
      <Card className="border-zinc-200/80 bg-white/95">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight">Creator partnerships</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-zinc-600">
          <p>Accept invites you trust, use your referral links, and track which campaigns are active.</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{invited.length} invited</Badge>
            <Badge variant="secondary">{active.length} active</Badge>
            <Badge variant="secondary">{others.length} completed/other</Badge>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Clock3 className="h-5 w-5 text-primary" />
          Invites awaiting action
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {invited.length === 0 ? (
            <Card className="border-zinc-200/80 bg-white/95 md:col-span-2">
              <CardContent className="py-8 text-sm text-zinc-600">
                No pending invites right now. Keep your profile updated so builders can discover you.
              </CardContent>
            </Card>
          ) : null}
          {invited.map((partnership: any) => (
            <Card key={partnership.id} className="border-zinc-200/80 bg-white/95">
              <CardHeader>
                <CardTitle className="text-lg">{partnership.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-zinc-600">
                <p>
                  Product: <span className="font-medium text-zinc-900">{partnership.product_name}</span>
                </p>
                <p>CPA: ${(partnership.cpa_amount_cents / 100).toFixed(2)}</p>
                <ActionButton
                  label="Accept invite"
                  action={`/api/creator/partnerships/${partnership.id}/accept`}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Active partnerships
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {active.length === 0 ? (
            <Card className="border-zinc-200/80 bg-white/95 md:col-span-2">
              <CardContent className="py-8 text-sm text-zinc-600">
                Accept an invite to start sharing referral links.
              </CardContent>
            </Card>
          ) : null}
          {active.map((partnership: any) => {
            const link = `${env.NEXT_PUBLIC_APP_URL}/r/${partnership.ref_code}`;
            return (
              <Card key={partnership.id} className="border-zinc-200/80 bg-white/95">
                <CardHeader>
                  <CardTitle className="text-lg">{partnership.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-zinc-600">
                  <p>
                    Product: <span className="font-medium text-zinc-900">{partnership.product_name}</span>
                  </p>
                  <p>CPA: ${(partnership.cpa_amount_cents / 100).toFixed(2)}</p>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                    <p className="mb-1 flex items-center gap-1.5 font-medium text-zinc-900">
                      <Link2 className="h-4 w-4" />
                      Referral link
                    </p>
                    <p className="truncate font-mono text-xs">{link}</p>
                  </div>
                  <CopyLinkButton value={link} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Completed or other statuses</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {others.map((partnership: any) => (
            <Card key={partnership.id} className="border-zinc-200/80 bg-white/95">
              <CardHeader>
                <CardTitle className="text-lg">{partnership.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-zinc-600">
                <p>Status: {partnership.status}</p>
                <p>CPA: ${(partnership.cpa_amount_cents / 100).toFixed(2)}</p>
              </CardContent>
            </Card>
          ))}
          {others.length === 0 ? (
            <Card className="border-zinc-200/80 bg-white/95 md:col-span-2">
              <CardContent className="py-8 text-sm text-zinc-600">
                No completed partnerships yet.
              </CardContent>
            </Card>
          ) : null}
        </div>
      </section>
    </div>
  );
}
