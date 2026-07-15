import { z } from "zod";

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1).default("pk_test_placeholder"),
    CLERK_SECRET_KEY: z.string().min(1).default("sk_test_placeholder"),
    CLERK_WEBHOOK_SIGNING_SECRET: z.string().optional(),
    SUPABASE_DATABASE_URL: z
      .string()
      .min(1)
      .default("postgresql://postgres:postgres@127.0.0.1:54322/postgres"),
    STRIPE_SECRET_KEY: z.string().min(1).default("sk_test_placeholder"),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    STRIPE_CONNECT_RETURN_URL: z.string().url().optional(),
    STRIPE_CONNECT_REFRESH_URL: z.string().url().optional(),
    POSTHOG_API_KEY: z.string().optional(),
    POSTHOG_HOST: z.string().url().optional(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
    NEXT_PUBLIC_GTM_ID: z.string().regex(/^GTM-[A-Z0-9]+$/).optional(),
    NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().regex(/^G-[A-Z0-9]+$/).optional(),
    NEXT_PUBLIC_GOOGLE_ADS_ID: z.string().regex(/^AW-[0-9]+$/).optional(),
    NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_LABEL: z.string().optional(),
    NEXT_PUBLIC_META_PIXEL_ID: z.string().regex(/^[0-9]+$/).optional(),
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.VERCEL_ENV !== "production") {
      return;
    }

    const requireValue = (key: keyof typeof value, message?: string) => {
      if (!value[key]) {
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: message ?? `${key} is required in production`,
        });
      }
    };

    if (!value.NEXT_PUBLIC_APP_URL.startsWith("https://")) {
      ctx.addIssue({
        code: "custom",
        path: ["NEXT_PUBLIC_APP_URL"],
        message: "NEXT_PUBLIC_APP_URL must use HTTPS in production",
      });
    }

    if (
      !value.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_live_") ||
      !value.CLERK_SECRET_KEY.startsWith("sk_live_")
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"],
        message: "Clerk production keys are required in production",
      });
    }

    if (!value.STRIPE_SECRET_KEY.startsWith("sk_live_")) {
      ctx.addIssue({
        code: "custom",
        path: ["STRIPE_SECRET_KEY"],
        message: "A Stripe live key is required in production",
      });
    }

    requireValue("CLERK_WEBHOOK_SIGNING_SECRET");
    requireValue("STRIPE_WEBHOOK_SECRET");
    if (!value.POSTHOG_API_KEY && !value.NEXT_PUBLIC_POSTHOG_KEY) {
      ctx.addIssue({
        code: "custom",
        path: ["NEXT_PUBLIC_POSTHOG_KEY"],
        message: "A PostHog project key is required in production",
      });
    }
  });

export type AppEnv = z.infer<typeof envSchema>;

export function parseEnv(input: Record<string, string | undefined>) {
  return envSchema.parse(input);
}

export const env = parseEnv(process.env);
