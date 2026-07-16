"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Script from "next/script";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import {
  CONSENT_STORAGE_KEY,
  createConsentPreferences,
  getAuthTrackingPermissions,
  parseConsentPreferences,
  serializeConsentPreferences,
  type ConsentPreferences,
} from "@/lib/analytics/consent";
import { createDispatchQueue } from "@/lib/analytics/dispatch-queue";
import {
  getGoogleAdsDestination,
  getMetaPixelEvent,
  type AnalyticsEventMap,
  type AnalyticsEventName,
} from "@/lib/analytics/events";

declare global {
  interface Window {
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsConfig = {
  posthogApiKey?: string;
  posthogHost?: string;
  gtmId?: string;
  gaMeasurementId?: string;
  googleAdsId?: string;
  googleAdsSignupLabel?: string;
  metaPixelId?: string;
};

type AnalyticsContextValue = {
  consent: ConsentPreferences | null;
  capture: <Event extends AnalyticsEventName>(
    event: Event,
    properties: AnalyticsEventMap[Event],
  ) => void;
  openPreferences: () => void;
  saveConsent: (analytics: boolean, marketing: boolean) => void;
};

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);
const CONSENT_CHANGE_EVENT = "signalmatch-consent-change";
const GOOGLE_TAG_READY_EVENT = "signalmatch-google-tag-ready";
const META_PIXEL_READY_EVENT = "signalmatch-meta-pixel-ready";
const subscribeHydration = () => () => undefined;

type QueuedAnalyticsEvent = {
  event: AnalyticsEventName;
  properties: AnalyticsEventMap[AnalyticsEventName];
};

type QueuedGoogleAdsConversion = {
  destination: string;
};

type QueuedMetaEvent = {
  event: string;
  properties: AnalyticsEventMap[AnalyticsEventName];
};

function subscribeConsent(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
  };
}

function getConsentSnapshot() {
  return localStorage.getItem(CONSENT_STORAGE_KEY);
}

export function useAnalytics() {
  const value = useContext(AnalyticsContext);
  if (!value) {
    throw new Error("useAnalytics must be used within AnalyticsProvider");
  }
  return value;
}

export function AnalyticsProvider({
  children,
  config,
}: {
  children: React.ReactNode;
  config: AnalyticsConfig;
}) {
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [posthogQueue] = useState(() =>
    createDispatchQueue<QueuedAnalyticsEvent>(),
  );
  const [googleAnalyticsQueue] = useState(() =>
    createDispatchQueue<QueuedAnalyticsEvent>(),
  );
  const [googleAdsQueue] = useState(() =>
    createDispatchQueue<QueuedGoogleAdsConversion>(),
  );
  const [metaQueue] = useState(() => createDispatchQueue<QueuedMetaEvent>());
  const consentSnapshot = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    () => null,
  );
  const consent = useMemo(
    () => parseConsentPreferences(consentSnapshot),
    [consentSnapshot],
  );
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );

  const dispatchPostHog = useCallback((item: QueuedAnalyticsEvent) => {
    if (!posthog.__loaded || posthog.has_opted_out_capturing()) {
      return false;
    }
    posthog.capture(
      item.event === "page_view" ? "$pageview" : item.event,
      item.properties,
    );
    return true;
  }, []);

  const dispatchGoogleAnalytics = useCallback((item: QueuedAnalyticsEvent) => {
    if (!window.gtag) {
      return false;
    }
    window.gtag("event", item.event, item.properties);
    return true;
  }, []);

  const dispatchGoogleAds = useCallback((item: QueuedGoogleAdsConversion) => {
    if (!window.gtag) {
      return false;
    }
    window.gtag("event", "conversion", { send_to: item.destination });
    return true;
  }, []);

  const dispatchMeta = useCallback((item: QueuedMetaEvent) => {
    if (!window.fbq) {
      return false;
    }
    window.fbq("track", item.event, item.properties);
    return true;
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!consent?.analytics) {
      posthogQueue.clear();
      googleAnalyticsQueue.clear();
      if (posthog.__loaded) {
        posthog.opt_out_capturing();
        posthog.reset();
      }
      return;
    }

    if (!config.posthogApiKey) {
      return;
    }

    if (!posthog.__loaded) {
      posthog.init(config.posthogApiKey, {
        api_host: config.posthogHost ?? "https://us.i.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: false,
        capture_pageleave: true,
        respect_dnt: true,
        secure_cookie: true,
        loaded: (client) => {
          client.opt_in_capturing();
          posthogQueue.flush(dispatchPostHog);
        },
      });
    }

    posthog.opt_in_capturing();
    posthogQueue.flush(dispatchPostHog);
  }, [
    config.posthogApiKey,
    config.posthogHost,
    consent,
    dispatchPostHog,
    googleAnalyticsQueue,
    hydrated,
    posthogQueue,
  ]);

  useEffect(() => {
    const flushGoogleQueues = () => {
      googleAnalyticsQueue.flush(dispatchGoogleAnalytics);
      googleAdsQueue.flush(dispatchGoogleAds);
    };
    window.addEventListener(GOOGLE_TAG_READY_EVENT, flushGoogleQueues);
    if (window.gtag) {
      flushGoogleQueues();
    }
    return () =>
      window.removeEventListener(GOOGLE_TAG_READY_EVENT, flushGoogleQueues);
  }, [
    dispatchGoogleAds,
    dispatchGoogleAnalytics,
    googleAdsQueue,
    googleAnalyticsQueue,
  ]);

  useEffect(() => {
    const flushMetaQueue = () => metaQueue.flush(dispatchMeta);
    window.addEventListener(META_PIXEL_READY_EVENT, flushMetaQueue);
    if (window.fbq) {
      flushMetaQueue();
    }
    return () =>
      window.removeEventListener(META_PIXEL_READY_EVENT, flushMetaQueue);
  }, [dispatchMeta, metaQueue]);

  useEffect(() => {
    if (!consent?.analytics) {
      googleAnalyticsQueue.clear();
    }
    if (!consent?.marketing) {
      googleAdsQueue.clear();
      metaQueue.clear();
    }
  }, [consent, googleAdsQueue, googleAnalyticsQueue, metaQueue]);

  useEffect(() => {
    if (!hydrated || consent) {
      return;
    }

    window.gtag?.("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }, [consent, hydrated]);

  const saveConsent = useCallback((analytics: boolean, marketing: boolean) => {
    const next = createConsentPreferences(analytics, marketing);
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      serializeConsentPreferences(next),
    );
    window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
    setPreferencesOpen(false);

    window.gtag?.("consent", "update", {
      analytics_storage: analytics ? "granted" : "denied",
      ad_storage: marketing ? "granted" : "denied",
      ad_user_data: marketing ? "granted" : "denied",
      ad_personalization: marketing ? "granted" : "denied",
    });

    if (!marketing) {
      window.fbq?.("consent", "revoke");
    }
  }, []);

  const capture = useCallback(
    <Event extends AnalyticsEventName>(
      event: Event,
      properties: AnalyticsEventMap[Event],
    ) => {
      if (consent?.analytics) {
        const queuedEvent: QueuedAnalyticsEvent = { event, properties };
        if (config.posthogApiKey) {
          posthogQueue.dispatchOrQueue(queuedEvent, dispatchPostHog);
        }
        if (config.gaMeasurementId) {
          googleAnalyticsQueue.dispatchOrQueue(
            queuedEvent,
            dispatchGoogleAnalytics,
          );
        }
      }

      if (!consent?.marketing) {
        return;
      }

      const adsDestination = getGoogleAdsDestination(event, {
        adsId: config.googleAdsId,
        signupLabel: config.googleAdsSignupLabel,
      });
      if (adsDestination) {
        googleAdsQueue.dispatchOrQueue(
          { destination: adsDestination },
          dispatchGoogleAds,
        );
      }

      const metaEvent =
        event === "page_view" ? "PageView" : getMetaPixelEvent(event);
      if (metaEvent && config.metaPixelId) {
        metaQueue.dispatchOrQueue(
          { event: metaEvent, properties },
          dispatchMeta,
        );
      }
    },
    [
      config.gaMeasurementId,
      config.googleAdsId,
      config.googleAdsSignupLabel,
      config.metaPixelId,
      config.posthogApiKey,
      consent,
      dispatchGoogleAds,
      dispatchGoogleAnalytics,
      dispatchMeta,
      dispatchPostHog,
      googleAdsQueue,
      googleAnalyticsQueue,
      metaQueue,
      posthogQueue,
    ],
  );

  const value = useMemo<AnalyticsContextValue>(
    () => ({
      consent,
      capture,
      openPreferences: () => setPreferencesOpen(true),
      saveConsent,
    }),
    [capture, consent, saveConsent],
  );

  const loadGoogleTag =
    Boolean(consent?.analytics && config.gaMeasurementId) ||
    Boolean(consent?.marketing && config.googleAdsId);

  return (
    <AnalyticsContext.Provider value={value}>
      <PostHogProvider client={posthog}>
        {loadGoogleTag && consent ? (
          <GoogleTag config={config} consent={consent} />
        ) : null}
        {consent?.marketing && config.gtmId ? (
          <GoogleTagManager
            id={config.gtmId}
            analyticsConsent={consent.analytics}
          />
        ) : null}
        {consent?.marketing && config.metaPixelId ? (
          <MetaPixel id={config.metaPixelId} />
        ) : null}
        <AnalyticsRouteTracker />
        <ClerkAnalyticsIdentity />
        {children}
        {hydrated ? (
          <ConsentControl
            key={`${consent?.updatedAt ?? "unset"}-${preferencesOpen ? "open" : "closed"}`}
            consent={consent}
            open={preferencesOpen || consent === null}
            onOpen={() => setPreferencesOpen(true)}
            onSave={saveConsent}
          />
        ) : null}
      </PostHogProvider>
    </AnalyticsContext.Provider>
  );
}

function AnalyticsRouteTracker() {
  const pathname = usePathname();
  const { capture } = useAnalytics();

  useEffect(() => {
    capture("page_view", {
      path: pathname,
      title: document.title || undefined,
    });
  }, [capture, pathname]);

  return null;
}

const AUTH_INTENT_KEY = "signalmatch-auth-intent";

function ClerkAnalyticsIdentity() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useUser();
  const { capture, consent } = useAnalytics();
  const identifiedUser = useRef<string | null>(null);

  useEffect(() => {
    const isSignUp = pathname.includes("sign-up");
    const isSignIn = pathname.includes("sign-in");
    if (!isSignedIn && (isSignUp || isSignIn)) {
      const audience = pathname.includes("creators") ? "creator" : "builder";
      const kind = isSignUp ? "sign_up" : "sign_in";
      const nextIntent = JSON.stringify({ audience, kind });
      if (sessionStorage.getItem(AUTH_INTENT_KEY) !== nextIntent) {
        sessionStorage.setItem(AUTH_INTENT_KEY, nextIntent);
        capture(`${kind}_started`, { audience });
      }
    }
  }, [capture, isSignedIn, pathname]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn || !user) {
      if (identifiedUser.current) {
        posthog.reset();
        window.gtag?.("set", { user_id: null });
        identifiedUser.current = null;
      }
      return;
    }

    const permissions = getAuthTrackingPermissions(consent);
    if (permissions.identifyUser) {
      const role =
        typeof user.publicMetadata.role === "string"
          ? user.publicMetadata.role
          : undefined;
      if (identifiedUser.current !== user.id) {
        posthog.identify(user.id, role ? { role } : undefined);
        window.gtag?.("set", { user_id: user.id });
        identifiedUser.current = user.id;
      }
    } else if (identifiedUser.current) {
      window.gtag?.("set", { user_id: null });
      identifiedUser.current = null;
    }

    if (!permissions.measureCompletion) {
      return;
    }

    const rawIntent = sessionStorage.getItem(AUTH_INTENT_KEY);
    if (!rawIntent) {
      return;
    }

    try {
      const intent = JSON.parse(rawIntent) as {
        audience?: "builder" | "creator";
        kind?: "sign_up" | "sign_in";
      };
      if (intent.kind === "sign_up") {
        capture("sign_up_completed", { audience: intent.audience });
      } else if (intent.kind === "sign_in") {
        capture("sign_in_completed", { audience: intent.audience });
      }
    } finally {
      sessionStorage.removeItem(AUTH_INTENT_KEY);
    }
  }, [capture, consent, isLoaded, isSignedIn, user]);

  return null;
}

function GoogleTag({
  config,
  consent,
}: {
  config: AnalyticsConfig;
  consent: ConsentPreferences;
}) {
  const sourceId = config.gaMeasurementId ?? config.googleAdsId;
  if (!sourceId) {
    return null;
  }

  const configurations = [
    consent.analytics && config.gaMeasurementId
      ? `gtag('config', '${config.gaMeasurementId}', {send_page_view: false});`
      : "",
    consent.marketing && config.googleAdsId
      ? `gtag('config', '${config.googleAdsId}');`
      : "",
  ].join("\n");

  return (
    <>
      <Script
        id="signalmatch-google-tag"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(sourceId)}`}
        strategy="afterInteractive"
      />
      <Script id="signalmatch-google-tag-config" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('consent', 'update', {
  analytics_storage: '${consent.analytics ? "granted" : "denied"}',
  ad_storage: '${consent.marketing ? "granted" : "denied"}',
  ad_user_data: '${consent.marketing ? "granted" : "denied"}',
  ad_personalization: '${consent.marketing ? "granted" : "denied"}'
});
${configurations}
window.dispatchEvent(new Event('${GOOGLE_TAG_READY_EVENT}'));`}
      </Script>
    </>
  );
}

function GoogleTagManager({
  id,
  analyticsConsent,
}: {
  id: string;
  analyticsConsent: boolean;
}) {
  return (
    <Script id="signalmatch-gtm" strategy="afterInteractive">
      {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent', 'default', {
  analytics_storage: '${analyticsConsent ? "granted" : "denied"}',
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted'
});
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`}
    </Script>
  );
}

function MetaPixel({ id }: { id: string }) {
  return (
    <Script id="signalmatch-meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('consent', 'grant');fbq('init', '${id}');
window.dispatchEvent(new Event('${META_PIXEL_READY_EVENT}'));`}
    </Script>
  );
}

function ConsentControl({
  consent,
  open,
  onOpen,
  onSave,
}: {
  consent: ConsentPreferences | null;
  open: boolean;
  onOpen: () => void;
  onSave: (analytics: boolean, marketing: boolean) => void;
}) {
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(consent?.analytics ?? false);
  const [marketing, setMarketing] = useState(consent?.marketing ?? false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="border-border bg-background/95 text-foreground hover:bg-muted fixed bottom-3 left-3 z-50 rounded-full border px-3 py-2 text-xs font-medium shadow-lg backdrop-blur"
      >
        Privacy choices
      </button>
    );
  }

  return (
    <section
      aria-label="Privacy choices"
      aria-live="polite"
      className="border-border bg-background/95 text-foreground fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-2xl border p-5 shadow-2xl backdrop-blur md:p-6"
    >
      <h2 className="text-lg font-semibold">Your privacy choices</h2>
      <p className="text-muted-foreground mt-2 text-sm leading-6">
        Essential storage keeps SignalMatch working. With your permission,
        analytics helps us improve the product and marketing tags measure
        campaign performance.
      </p>
      {customizing ? (
        <div className="mt-4 grid gap-3">
          <label className="border-border flex items-center justify-between gap-4 rounded-xl border p-3 text-sm">
            <span>
              <strong className="block">Product analytics</strong>
              <span className="text-muted-foreground">
                PostHog and Google Analytics
              </span>
            </span>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(event) => setAnalytics(event.target.checked)}
              className="accent-primary size-4"
            />
          </label>
          <label className="border-border flex items-center justify-between gap-4 rounded-xl border p-3 text-sm">
            <span>
              <strong className="block">Advertising measurement</strong>
              <span className="text-muted-foreground">
                Google Ads, Tag Manager, and Meta Pixel
              </span>
            </span>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(event) => setMarketing(event.target.checked)}
              className="accent-primary size-4"
            />
          </label>
        </div>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-2">
        {customizing ? (
          <button
            type="button"
            onClick={() => onSave(analytics, marketing)}
            className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium"
          >
            Save choices
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onSave(true, true)}
              className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={() => onSave(false, false)}
              className="border-border hover:bg-muted rounded-lg border px-4 py-2 text-sm font-medium"
            >
              Reject optional
            </button>
            <button
              type="button"
              onClick={() => setCustomizing(true)}
              className="text-muted-foreground hover:bg-muted rounded-lg px-4 py-2 text-sm font-medium"
            >
              Customize
            </button>
          </>
        )}
      </div>
    </section>
  );
}
