import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  getGoogleAdsDestination,
  getMetaPixelEvent,
} from "../../src/lib/analytics/events";
import { createDispatchQueue } from "../../src/lib/analytics/dispatch-queue";
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

describe("analytics provider readiness", () => {
  it("queues an event until its provider is ready, then flushes it once", () => {
    const queue = createDispatchQueue<string>();
    const delivered: string[] = [];
    let ready = false;
    const dispatch = (event: string) => {
      if (!ready) {
        return false;
      }
      delivered.push(event);
      return true;
    };

    expect(queue.dispatchOrQueue("page_view", dispatch)).toBe(false);
    expect(queue.size()).toBe(1);
    expect(delivered).toEqual([]);

    ready = true;
    queue.flush(dispatch);
    queue.flush(dispatch);

    expect(queue.size()).toBe(0);
    expect(delivered).toEqual(["page_view"]);
  });

  it("keeps undeliverable events queued and can clear them on consent revoke", () => {
    const queue = createDispatchQueue<string>();
    const unavailable = () => false;

    queue.dispatchOrQueue("sign_up_completed", unavailable);
    queue.flush(unavailable);

    expect(queue.size()).toBe(1);
    queue.clear();
    expect(queue.size()).toBe(0);
  });

  it("flushes queued PostHog events from the SDK loaded callback", () => {
    const provider = readFileSync(
      "src/components/providers/analytics-provider.tsx",
      "utf8",
    );

    expect(provider).toContain("loaded: (client) =>");
    expect(provider).toContain("posthogQueue.flush(dispatchPostHog)");
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
