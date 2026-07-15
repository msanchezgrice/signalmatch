export const CONSENT_STORAGE_KEY = "signalmatch-consent";
export const CONSENT_VERSION = 1 as const;

export type ConsentPreferences = {
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  version: typeof CONSENT_VERSION;
};

export function hasAnalyticsConsent(
  preferences: ConsentPreferences | null,
): boolean {
  return preferences?.analytics === true;
}

export function hasMeasurementConsent(
  preferences: ConsentPreferences | null,
): boolean {
  return preferences?.analytics === true || preferences?.marketing === true;
}

export function getAuthTrackingPermissions(
  preferences: ConsentPreferences | null,
) {
  return {
    identifyUser: hasAnalyticsConsent(preferences),
    measureCompletion: hasMeasurementConsent(preferences),
  } as const;
}

export function createConsentPreferences(
  analytics: boolean,
  marketing: boolean,
): ConsentPreferences {
  return {
    analytics,
    marketing,
    updatedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
}

export function parseConsentPreferences(
  value: string | null,
): ConsentPreferences | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<ConsentPreferences>;
    if (
      parsed.version !== CONSENT_VERSION ||
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.marketing !== "boolean" ||
      typeof parsed.updatedAt !== "string"
    ) {
      return null;
    }

    return parsed as ConsentPreferences;
  } catch {
    return null;
  }
}

export function serializeConsentPreferences(
  preferences: ConsentPreferences,
): string {
  return JSON.stringify(preferences);
}
