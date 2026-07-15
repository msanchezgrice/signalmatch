import { describe, expect, it } from "vitest";

import {
  getGoogleAdsDestination,
  getMetaPixelEvent,
} from "../../src/lib/analytics/events";
import {
  getAuthTrackingPermissions,
  hasAnalyticsConsent,
  hasMeasurementConsent,
  parseConsentPreferences,
  serializeConsentPreferences,
} from "../../src/lib/analytics/consent";

describe("analytics event destinations", () => {
  it("maps signup completion to configured Google Ads conversion", () => {
    expect(
      getGoogleAdsDestination("sign_up_completed", {
        adsId: "AW-123456",
        signupLabel: "signup-label",
      }),
    ).toBe("AW-123456/signup-label");
  });

  it("does not emit a Google Ads conversion without a complete destination", () => {
    expect(
      getGoogleAdsDestination("sign_up_completed", {
        adsId: "AW-123456",
      }),
    ).toBeNull();
    expect(
      getGoogleAdsDestination("campaign_created", {
        adsId: "AW-123456",
        signupLabel: "signup-label",
      }),
    ).toBeNull();
  });

  it("maps product events to Meta standard events", () => {
    expect(getMetaPixelEvent("sign_up_completed")).toBe("CompleteRegistration");
    expect(getMetaPixelEvent("checkout_started")).toBe("InitiateCheckout");
    expect(getMetaPixelEvent("campaign_created")).toBe("Lead");
    expect(getMetaPixelEvent("page_view")).toBeNull();
  });
});

describe("consent preferences", () => {
  it("round-trips a valid preference payload", () => {
    const preferences = {
      analytics: true,
      marketing: false,
      updatedAt: "2026-07-15T12:00:00.000Z",
      version: 1 as const,
    };

    expect(
      parseConsentPreferences(serializeConsentPreferences(preferences)),
    ).toEqual(preferences);
  });

  it("rejects malformed or stale payloads", () => {
    expect(parseConsentPreferences(null)).toBeNull();
    expect(parseConsentPreferences("not-json")).toBeNull();
    expect(
      parseConsentPreferences(
        JSON.stringify({ analytics: true, marketing: true, version: 0 }),
      ),
    ).toBeNull();
  });

  it("allows marketing conversion measurement without analytics identity", () => {
    const marketingOnly = {
      analytics: false,
      marketing: true,
      updatedAt: "2026-07-15T12:00:00.000Z",
      version: 1 as const,
    };

    expect(hasMeasurementConsent(marketingOnly)).toBe(true);
    expect(hasAnalyticsConsent(marketingOnly)).toBe(false);
    expect(getAuthTrackingPermissions(marketingOnly)).toEqual({
      identifyUser: false,
      measureCompletion: true,
    });
  });

  it("requires at least one measurement category for auth completion", () => {
    const rejected = {
      analytics: false,
      marketing: false,
      updatedAt: "2026-07-15T12:00:00.000Z",
      version: 1 as const,
    };

    expect(hasMeasurementConsent(rejected)).toBe(false);
    expect(hasMeasurementConsent(null)).toBe(false);
  });
});
