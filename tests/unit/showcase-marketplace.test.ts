import { describe, expect, it } from "vitest";

import {
  getShowcaseCampaign,
  showcaseCampaigns,
} from "@/lib/showcase-campaigns";
import {
  getShowcaseCreator,
  showcaseCreators,
} from "@/lib/showcase-creators";

describe("showcase campaign inventory", () => {
  it("ships ten distinct software campaigns", () => {
    expect(showcaseCampaigns).toHaveLength(10);
    expect(new Set(showcaseCampaigns.map((campaign) => campaign.id)).size).toBe(10);
    expect(new Set(showcaseCampaigns.map((campaign) => campaign.productName)).size).toBe(10);
  });

  it("gives every campaign enough visual and commercial context to render a useful card", () => {
    for (const campaign of showcaseCampaigns) {
      expect(campaign.example).toBe(true);
      expect(campaign.productDescription.length).toBeGreaterThan(40);
      expect(campaign.brief.length).toBeGreaterThan(80);
      expect(campaign.targetTags.length).toBeGreaterThanOrEqual(3);
      expect(campaign.cpaAmountCents).toBeGreaterThan(0);
      expect(campaign.preview.metricLabel.length).toBeGreaterThan(0);
      expect(campaign.preview.metricValue.length).toBeGreaterThan(0);
      expect(campaign.preview.rows).toHaveLength(3);
    }
  });

  it("finds showcase details by slug without accepting unknown slugs", () => {
    expect(getShowcaseCampaign("codepilot-ai")?.productName).toBe("CodePilot AI");
    expect(getShowcaseCampaign("does-not-exist")).toBeUndefined();
  });
});

describe("showcase creator inventory", () => {
  it("provides a visible example bench while the live directory grows", () => {
    expect(showcaseCreators.length).toBeGreaterThanOrEqual(6);
    expect(new Set(showcaseCreators.map((creator) => creator.id)).size).toBe(
      showcaseCreators.length,
    );

    for (const creator of showcaseCreators) {
      expect(creator.example).toBe(true);
      expect(creator.avatarUrl).toMatch(/^\/creators\/profiles\/[a-z-]+\.webp$/);
      expect(creator.bio.length).toBeGreaterThan(40);
      expect(creator.niches.length).toBeGreaterThanOrEqual(2);
      expect(creator.channels.length).toBeGreaterThan(0);
    }
  });

  it("finds example creator details by slug", () => {
    expect(getShowcaseCreator("maya-chen")?.displayName).toBe("Maya Chen");
    expect(getShowcaseCreator("unknown-creator")).toBeUndefined();
  });
});
