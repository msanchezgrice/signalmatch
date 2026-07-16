export type AnalyticsEventMap = {
  page_view: { path: string; title?: string };
  sign_up_started: { audience: "builder" | "creator" };
  sign_up_completed: { audience?: "builder" | "creator" };
  sign_in_started: { audience: "builder" | "creator" };
  sign_in_completed: { audience?: "builder" | "creator" };
  role_selected: { role: "BUILDER" | "CREATOR" };
  product_created: { productId: string };
  campaign_created: { campaignId: string; productId?: string };
  checkout_started: { campaignId: string };
  creator_invited: { campaignId: string; creatorId: string };
  partnership_accepted: { partnershipId: string };
  conversion_recorded: { campaignId: string; conversionId?: string };
  conversion_approved: { campaignId: string; conversionId: string };
  stripe_connect_started: Record<string, never>;
  tool_started: { tool: string };
  tool_completed: { tool: string; result?: string };
  cta_clicked: { cta: string; destination: string };
};

export type AnalyticsEventName = keyof AnalyticsEventMap;

export type GoogleAdsConfig = {
  adsId?: string;
  signupLabel?: string;
};

export function getGoogleAdsDestination(
  event: AnalyticsEventName,
  config: GoogleAdsConfig,
): string | null {
  if (event !== "sign_up_completed" || !config.adsId || !config.signupLabel) {
    return null;
  }

  return `${config.adsId}/${config.signupLabel}`;
}

const META_EVENT_MAP: Partial<Record<AnalyticsEventName, string>> = {
  sign_up_started: "Lead",
  sign_up_completed: "CompleteRegistration",
  campaign_created: "Lead",
  checkout_started: "InitiateCheckout",
  tool_completed: "Lead",
};

export function getMetaPixelEvent(event: AnalyticsEventName): string | null {
  return META_EVENT_MAP[event] ?? null;
}
