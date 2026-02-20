import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCampaignById } from "@/server/db/read";

type Props = { params: Promise<{ id: string }> };

export default async function CampaignDetailPage({ params }: Props) {
  const { id } = await params;
  const campaign = await getCampaignById(id);

  if (!campaign) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-8">
      <Card className="border-zinc-200/80 bg-white/95">
        <CardHeader>
          <CardTitle className="text-2xl">{campaign.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-zinc-700">
          <p>{campaign.brief || "No brief provided."}</p>
          <p>Product: {campaign.product_name}</p>
          <p>CPA: ${(campaign.cpa_amount_cents / 100).toFixed(2)}</p>
          <p>Conversion event: {campaign.conversion_type}</p>
          <p>Status: {campaign.status}</p>
          <p>Tags: {(campaign.target_tags as string[]).join(", ") || "n/a"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
