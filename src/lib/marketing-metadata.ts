import type { Metadata } from "next";

type MarketingMetadataEntry = {
  title: string;
  description: string;
  canonical: string;
};

export const marketingMetadata: Record<string, MarketingMetadataEntry> = {
  "/": {
    title: "Creator Performance Marketing Marketplace | SignalMatch",
    description:
      "Launch measurable creator partnerships for AI products with clear CPA terms, reviewable attribution, conversion approval, and creator payouts.",
    canonical: "/",
  },
  "/builders": {
    title: "Performance-Based Creator Marketing for Builders | SignalMatch",
    description:
      "Find aligned AI creators, define qualified conversion events, track referral outcomes, and pay for approved customer acquisition with SignalMatch.",
    canonical: "/builders",
  },
  "/creators": {
    title: "CPA Partnerships for AI Creators | SignalMatch",
    description:
      "Discover AI products that fit your audience, review clear CPA campaign terms, track approved conversions, and receive creator payouts.",
    canonical: "/creators",
  },
  "/explore/campaigns": {
    title: "Browse AI Creator Campaigns and CPA Offers | SignalMatch",
    description:
      "Browse outcome-based AI product campaigns with transparent conversion definitions, creator payout amounts, and partnership requirements.",
    canonical: "/explore/campaigns",
  },
  "/explore/creators": {
    title: "Find AI Creators by Audience and Niche | SignalMatch",
    description:
      "Explore AI creators by niche, audience, channel, and engagement context to find stronger matches for performance-based product campaigns.",
    canonical: "/explore/creators",
  },
  "/creators/success-stories": {
    title: "Creator Campaign Examples and Scenarios | SignalMatch",
    description:
      "Learn how outcome-based creator campaigns can connect audience fit, useful product education, qualified conversions, and transparent payouts.",
    canonical: "/creators/success-stories",
  },
  "/resources": {
    title: "Creator Performance Marketing Resources | SignalMatch",
    description:
      "Use practical guides for creator CPA economics, attribution, campaign briefs, disclosure, conversion review, fraud controls, and fair payouts.",
    canonical: "/resources",
  },
  "/tools": {
    title: "Free Creator Campaign Calculators and Tools | SignalMatch",
    description:
      "Use free creator campaign calculators, UTM builders, scorecards, attribution planners, campaign brief generators, and conversion tracking checklists.",
    canonical: "/tools",
  },
  "/about": {
    title: "About the SignalMatch Creator Marketplace | SignalMatch",
    description:
      "Learn why SignalMatch is building a more inspectable marketplace for AI builders and creators to form performance-based partnerships.",
    canonical: "/about",
  },
  "/contact": {
    title: "Contact the SignalMatch Team | SignalMatch",
    description:
      "Contact SignalMatch about creator partnerships, builder campaigns, account support, privacy questions, content corrections, or product feedback.",
    canonical: "/contact",
  },
  "/privacy": {
    title: "Privacy Policy for the Creator Marketplace | SignalMatch",
    description:
      "Read how SignalMatch handles account, campaign, attribution, payment, analytics, support, and other personal information across the marketplace.",
    canonical: "/privacy",
  },
  "/terms": {
    title: "Marketplace Terms of Service | SignalMatch",
    description:
      "Review the terms for SignalMatch builders, creators, campaigns, eligible conversions, approvals, funding, refunds, disputes, and payouts.",
    canonical: "/terms",
  },
};

export const getMarketingMetadata = (
  route: keyof typeof marketingMetadata,
): Metadata => {
  const entry = marketingMetadata[route];
  return {
    title: entry.title,
    description: entry.description,
    alternates: { canonical: entry.canonical },
    openGraph: {
      title: entry.title,
      description: entry.description,
      url: entry.canonical,
      siteName: "SignalMatch",
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "SignalMatch",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.description,
      images: ["/opengraph-image"],
    },
  };
};
