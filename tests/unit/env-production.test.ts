import { describe, expect, it } from "vitest";

import { parseEnv } from "@/server/env";

const productionEnv = {
  NODE_ENV: "production",
  VERCEL_ENV: "production",
  NEXT_PUBLIC_APP_URL: "https://signalmatch.me",
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_live_clerk",
  CLERK_SECRET_KEY: "sk_live_clerk",
  CLERK_WEBHOOK_SIGNING_SECRET: "whsec_clerk",
  SUPABASE_DATABASE_URL: "postgresql://user:pass@example.com:5432/signalmatch",
  STRIPE_SECRET_KEY: "sk_live_stripe",
  STRIPE_WEBHOOK_SECRET: "whsec_stripe",
  STRIPE_CONNECT_RETURN_URL: "https://signalmatch.me/app/creator/payouts",
  STRIPE_CONNECT_REFRESH_URL: "https://signalmatch.me/app/creator/payouts?refresh=1",
  NEXT_PUBLIC_POSTHOG_KEY: "phc_test_project_key",
};

describe("production environment validation", () => {
  it("accepts a complete live production configuration", () => {
    expect(parseEnv(productionEnv).NEXT_PUBLIC_APP_URL).toBe("https://signalmatch.me");
  });

  it("rejects Clerk development keys in production", () => {
    expect(() =>
      parseEnv({
        ...productionEnv,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_clerk",
        CLERK_SECRET_KEY: "sk_test_clerk",
      }),
    ).toThrow(/Clerk production keys/i);
  });

  it("rejects Stripe test keys in production", () => {
    expect(() =>
      parseEnv({ ...productionEnv, STRIPE_SECRET_KEY: "sk_test_stripe" }),
    ).toThrow(/Stripe live key/i);
  });

  it("rejects missing webhook secrets in production", () => {
    expect(() =>
      parseEnv({ ...productionEnv, STRIPE_WEBHOOK_SECRET: undefined }),
    ).toThrow(/STRIPE_WEBHOOK_SECRET/i);
    expect(() =>
      parseEnv({ ...productionEnv, CLERK_WEBHOOK_SIGNING_SECRET: undefined }),
    ).toThrow(/CLERK_WEBHOOK_SIGNING_SECRET/i);
  });

  it("keeps local development bootstrappable", () => {
    const parsed = parseEnv({ NODE_ENV: "development" });

    expect(parsed.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY).toContain("pk_test_");
    expect(parsed.STRIPE_SECRET_KEY).toContain("sk_test_");
  });
});
