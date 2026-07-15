import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { getMarketingMetadata } from "@/lib/marketing-metadata";
import { env } from "@/server/env";

import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.signalmatch.me"),
  applicationName: "SignalMatch",
  category: "business",
  creator: "SignalMatch",
  publisher: "SignalMatch",
  ...getMarketingMetadata("/"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body
          className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} bg-background text-foreground font-sans antialiased`}
        >
          <AnalyticsProvider
            config={{
              posthogApiKey: env.NEXT_PUBLIC_POSTHOG_KEY ?? env.POSTHOG_API_KEY,
              posthogHost: env.NEXT_PUBLIC_POSTHOG_HOST ?? env.POSTHOG_HOST,
              gtmId: env.NEXT_PUBLIC_GTM_ID,
              gaMeasurementId: env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
              googleAdsId: env.NEXT_PUBLIC_GOOGLE_ADS_ID,
              googleAdsSignupLabel: env.NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_LABEL,
              metaPixelId: env.NEXT_PUBLIC_META_PIXEL_ID,
            }}
          >
            <TooltipProvider>
              {children}
              <Toaster richColors />
            </TooltipProvider>
          </AnalyticsProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
