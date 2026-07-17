import { describe, expect, it } from "vitest";

import { rankCampaignsForCreator } from "@/lib/campaign-recommendations";

describe("creator campaign recommendations", () => {
  it("returns active real campaigns ranked by creator signal overlap", () => {
    const campaigns = [
      {
        campaign_id: "privacy-campaign",
        title: "Remove exposed personal information",
        brief: "Help privacy-conscious families remove data broker listings.",
        target_tags: ["privacy", "cybersecurity", "family safety"],
        conversion_type: "activation" as const,
        cpa_amount_cents: 700,
        status: "active" as const,
        product_id: "privacy-product",
        product_name: "Leak Check Me",
        product_url: "https://leakcheckme.com",
        product_category_tags: ["privacy", "identity protection"],
        product_screenshot_url: "https://leakcheckme.com/brand/og-image.png",
      },
      {
        campaign_id: "song-campaign",
        title: "Personalized songs",
        brief: "Meaningful gifts for weddings and anniversaries.",
        target_tags: ["weddings", "personalized gifts"],
        conversion_type: "activation" as const,
        cpa_amount_cents: 1000,
        status: "active" as const,
        product_id: "song-product",
        product_name: "My Forever Songs",
        product_url: "https://myforeversongs.com",
        product_category_tags: ["music", "gifts"],
        product_screenshot_url: null,
      },
      {
        campaign_id: "draft-campaign",
        title: "Draft privacy offer",
        brief: "Not public.",
        target_tags: ["privacy"],
        conversion_type: "activation" as const,
        cpa_amount_cents: 5000,
        status: "draft" as const,
        product_id: "draft-product",
        product_name: "Draft product",
        product_url: "https://draft.test",
        product_category_tags: ["privacy"],
        product_screenshot_url: null,
      },
    ];

    const ranked = rankCampaignsForCreator(campaigns, {
      audienceTags: ["privacy-conscious families"],
      niches: ["cybersecurity", "identity protection"],
      toolStack: [],
    });

    expect(ranked.map((item) => item.campaignId)).toEqual([
      "privacy-campaign",
      "song-campaign",
    ]);
    expect(ranked[0]?.reason).toMatch(/privacy|cybersecurity|identity/i);
  });

  it("does not claim a match based only on stopwords", () => {
    const [recommendation] = rankCampaignsForCreator(
      [
        {
          campaign_id: "campaign",
          title: "Product and growth",
          brief: "A useful offer for founders and teams.",
          target_tags: ["founders"],
          conversion_type: "activation" as const,
          cpa_amount_cents: 1_000,
          status: "active" as const,
          product_id: "product",
          product_name: "Product",
          product_url: "https://product.test",
          product_category_tags: [],
          product_screenshot_url: null,
        },
      ],
      { audienceTags: ["strategy and leadership"], niches: [], toolStack: [] },
    );

    expect(recommendation?.reason).not.toContain("interest in and");
  });
});
