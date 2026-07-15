export type SignalMatchVideoBrief = {
  slug: string;
  eyebrow: string;
  title: string;
  hook: string;
  beats: [string, string, string];
  cta: string;
  resourceUrl: string;
  accent: string;
};

const resourceUrl = (slug: string) =>
  `https://www.signalmatch.me/resources/${slug}`;

export const SIGNALMATCH_VIDEO_BRIEFS: SignalMatchVideoBrief[] = [
  {
    slug: "creator-cpa-campaign-workbook",
    eyebrow: "Campaign planning",
    title: "Turn a vague creator deal into a campaign you can fund",
    hook: "A payout number is not a campaign plan. Seven decisions make it launchable.",
    beats: [
      "Define the event, CPA, attribution window, and total cap.",
      "Set approval, reversal, disclosure, and creator evidence rules.",
      "QA the conversion path, fund the campaign, then invite creators.",
    ],
    cta: "Build your campaign",
    resourceUrl: resourceUrl("creator-cpa-campaign-workbook"),
    accent: "#7C5CFC",
  },
  {
    slug: "set-a-cpa-you-can-afford-a-unit-economics-walkthrough",
    eyebrow: "Unit economics",
    title: "Set a CPA you can afford",
    hook: "A random twenty-dollar CPA can erase your margin before growth even starts.",
    beats: [
      "Begin with contribution margin, activation, retention, and payback.",
      "Model low, base, and high outcomes instead of one perfect forecast.",
      "Set a cap that protects the business when assumptions miss.",
    ],
    cta: "Use the CPA calculator",
    resourceUrl: resourceUrl(
      "set-a-cpa-you-can-afford-a-unit-economics-walkthrough",
    ),
    accent: "#19C6B3",
  },
  {
    slug: "attribution-plan-for-creator-campaigns",
    eyebrow: "Attribution",
    title: "UTMs are not an attribution system",
    hook: "One duplicate conversion can become two payouts without an event contract.",
    beats: [
      "Give each creator a durable referral code and campaign context.",
      "Record server events with idempotency keys and a clear window.",
      "Deduplicate, reconcile, and preserve the evidence behind each payout.",
    ],
    cta: "Download the attribution plan",
    resourceUrl: resourceUrl("attribution-plan-for-creator-campaigns"),
    accent: "#FFB648",
  },
  {
    slug: "signup-vs-activation-pick-the-conversion-event-that-reflects-value",
    eyebrow: "Conversion design",
    title: "Signup or activation: what should trigger a payout?",
    hook: "Pay for empty accounts and you buy volume. Pay too deep and creators cannot verify success.",
    beats: [
      "List the moments between a click and durable customer value.",
      "Choose the earliest event that strongly predicts that value.",
      "Make the event observable, explainable, and fair to both sides.",
    ],
    cta: "Define a better success event",
    resourceUrl: resourceUrl(
      "signup-vs-activation-pick-the-conversion-event-that-reflects-value",
    ),
    accent: "#F56EA9",
  },
  {
    slug: "how-to-collaborate-with-influencers-the-compliant-creator-brief",
    eyebrow: "Creator brief",
    title: "Give creators direction without scripting a fake testimonial",
    hook: "A stiff script protects neither trust nor compliance. A good brief protects both.",
    beats: [
      "Define audience, problem, proof, and the product experience to show.",
      "Name prohibited claims and require a clear material-connection disclosure.",
      "Leave creators free to describe their honest, independent experience.",
    ],
    cta: "Copy the compliant brief",
    resourceUrl: resourceUrl(
      "how-to-collaborate-with-influencers-the-compliant-creator-brief",
    ),
    accent: "#7C5CFC",
  },
  {
    slug: "ftc-disclosure-for-cpa-partnerships-the-practical-version",
    eyebrow: "Disclosure",
    title: "Make the paid relationship impossible to miss",
    hook: "A hidden hashtag at the end of a long caption does not create meaningful disclosure.",
    beats: [
      "Use plain language that people understand without decoding hashtags.",
      "Place the disclosure with the endorsement, before a click or expansion.",
      "Review every format because video, audio, and text need different placement.",
    ],
    cta: "Review your campaign",
    resourceUrl: resourceUrl(
      "ftc-disclosure-for-cpa-partnerships-the-practical-version",
    ),
    accent: "#FF6B5E",
  },
  {
    slug: "creator-match-beyond-follower-count",
    eyebrow: "Creator matching",
    title: "A huge audience can still be the wrong audience",
    hook: "Follower count says nothing about problem credibility, format fit, or buyer intent.",
    beats: [
      "Score audience overlap and the creator's credibility with the problem.",
      "Check format strength, disclosure quality, and product-demo ability.",
      "Shortlist from evidence, then validate fit with a small campaign.",
    ],
    cta: "Browse matched creators",
    resourceUrl: resourceUrl("creator-match-beyond-follower-count"),
    accent: "#19C6B3",
  },
  {
    slug: "conversion-fraud-and-duplicate-events-controls-without-punishing-creators",
    eyebrow: "Conversion integrity",
    title: "Stop duplicate conversions without opaque payout denials",
    hook: "A retried webhook should not become a second payout—or an unexplained rejection.",
    beats: [
      "Use idempotency, event signatures, timestamps, and durable referral context.",
      "Flag anomalies for evidence-based review instead of automatic punishment.",
      "Give creators a reason, an evidence trail, and a fair appeal path.",
    ],
    cta: "Use the integrity plan",
    resourceUrl: resourceUrl(
      "conversion-fraud-and-duplicate-events-controls-without-punishing-creators",
    ),
    accent: "#FFB648",
  },
  {
    slug: "manual-approval-vs-auto-approval-a-risk-based-policy",
    eyebrow: "Approval policy",
    title: "Manual queue or automatic payout? Use a trust ladder",
    hook: "Review everything forever and payouts stall. Automate too early and bad events slip through.",
    beats: [
      "Start manually when the event, campaign, or partner is new.",
      "Measure reversal rates, evidence quality, and stable event behavior.",
      "Graduate trusted traffic to automation with explicit rollback triggers.",
    ],
    cta: "Set your approval controls",
    resourceUrl: resourceUrl(
      "manual-approval-vs-auto-approval-a-risk-based-policy",
    ),
    accent: "#7C5CFC",
  },
  {
    slug: "how-to-give-creators-evidence-without-manufacturing-a-testimonial",
    eyebrow: "Evidence packs",
    title: "Give creators proof—not a manufactured opinion",
    hook: "A prewritten quote can turn useful product evidence into a testimonial the creator never made.",
    beats: [
      "Share product access, claim sources, methods, dates, and limitations.",
      "Separate verified facts from suggested demonstrations and creative prompts.",
      "Let the creator reach and communicate an independent conclusion.",
    ],
    cta: "Build an evidence pack",
    resourceUrl: resourceUrl(
      "how-to-give-creators-evidence-without-manufacturing-a-testimonial",
    ),
    accent: "#F56EA9",
  },
];
