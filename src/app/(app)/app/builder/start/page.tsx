import { redirect } from "next/navigation";

import { BuilderLaunchGuide } from "@/components/builder/builder-launch-guide";
import { getAuthContext } from "@/server/auth";
import { getBuilderCampaigns, getBuilderLaunchStatus, getBuilderProducts } from "@/server/db/read";

export default async function BuilderStartPage() {
  const authContext = await getAuthContext();

  if (!authContext) {
    redirect("/");
  }

  if (authContext.role !== "BUILDER") {
    redirect("/app");
  }

  const [products, campaigns, launchStatus] = await Promise.all([
    getBuilderProducts(authContext.userId),
    getBuilderCampaigns(authContext.userId),
    getBuilderLaunchStatus(authContext.userId),
  ]);

  const hasProducts = products.length > 0;
  const hasCampaigns = campaigns.length > 0;

  return (
    <BuilderLaunchGuide
      hasProducts={hasProducts}
      hasCampaigns={hasCampaigns}
      productCount={products.length}
      campaignCount={campaigns.length}
      hasTrackingKey={launchStatus.has_tracking_key}
      hasFundedCampaign={launchStatus.has_funded_campaign}
      hasCreatorInvite={launchStatus.has_creator_invite}
      hasConversion={launchStatus.has_conversion}
    />
  );
}
