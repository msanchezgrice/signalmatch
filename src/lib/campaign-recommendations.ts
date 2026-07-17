type CampaignCandidate = {
  campaign_id: string;
  product_id: string;
  title: string;
  brief: string | null;
  target_tags: string[];
  conversion_type: "signup" | "activation";
  cpa_amount_cents: number;
  status: "draft" | "active" | "paused" | "ended";
  product_name: string;
  product_url: string;
  product_category_tags?: string[];
  product_screenshot_url?: string | null;
};

type CreatorSignals = {
  audienceTags: string[];
  niches: string[];
  toolStack: string[];
};

const stopWords = new Set([
  "and",
  "the",
  "for",
  "with",
  "your",
  "from",
  "that",
  "this",
  "into",
  "about",
  "product",
  "products",
]);

function tokens(values: Array<string | null | undefined>) {
  return new Set(
    values
      .join(" ")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/[\s-]+/)
      .filter((value) => value.length >= 3 && !stopWords.has(value)),
  );
}

export function rankCampaignsForCreator(
  campaigns: CampaignCandidate[],
  signals: CreatorSignals,
  limit = 3,
) {
  const signalTokens = tokens([
    ...signals.audienceTags,
    ...signals.niches,
    ...signals.toolStack,
  ]);

  return campaigns
    .filter((campaign) => campaign.status === "active")
    .map((campaign, index) => {
      const campaignTokens = tokens([
        campaign.title,
        campaign.brief,
        campaign.product_name,
        ...campaign.target_tags,
        ...(campaign.product_category_tags ?? []),
      ]);
      const overlap = [...signalTokens].filter((token) => campaignTokens.has(token));

      return {
        campaignId: campaign.campaign_id,
        productId: campaign.product_id,
        title: campaign.title,
        productName: campaign.product_name,
        productUrl: campaign.product_url,
        screenshotUrl: campaign.product_screenshot_url ?? null,
        cpaAmountCents: campaign.cpa_amount_cents,
        conversionType: campaign.conversion_type,
        reason:
          overlap.length > 0
            ? `Matches your audience's interest in ${overlap.slice(0, 3).join(", ")}.`
            : `A live ${campaign.target_tags[0] ?? "product"} offer worth reviewing for audience fit.`,
        score: overlap.length,
        index,
      };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((campaign) => ({
      campaignId: campaign.campaignId,
      productId: campaign.productId,
      title: campaign.title,
      productName: campaign.productName,
      productUrl: campaign.productUrl,
      screenshotUrl: campaign.screenshotUrl,
      cpaAmountCents: campaign.cpaAmountCents,
      conversionType: campaign.conversionType,
      reason: campaign.reason,
    }));
}
