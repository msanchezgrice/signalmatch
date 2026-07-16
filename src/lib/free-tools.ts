export type FreeTool = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  outcome: string;
};

export const freeTools: FreeTool[] = [
  {
    slug: "creator-cpa-break-even-calculator",
    title: "Creator CPA break-even calculator",
    shortTitle: "CPA break-even",
    description:
      "Estimate the maximum creator payout that still keeps a campaign inside your target CAC and margin.",
    outcome: "Set a CPA offer that can clear margin before you publish.",
  },
  {
    slug: "campaign-budget-forecast",
    title: "Campaign budget and conversion forecast",
    shortTitle: "Budget forecast",
    description:
      "Model clicks, conversion rate, approved conversions, spend, revenue, and remaining budget before inviting creators.",
    outcome: "Know whether the campaign cap can support the volume you expect.",
  },
  {
    slug: "creator-earnings-calculator",
    title: "Creator earnings and payout calculator",
    shortTitle: "Creator earnings",
    description:
      "Translate expected traffic and approval rates into estimated creator earnings after reversals.",
    outcome: "Show creators the range of outcomes before they commit.",
  },
  {
    slug: "utm-referral-link-builder",
    title: "UTM and referral link builder",
    shortTitle: "UTM builder",
    description:
      "Generate campaign-safe URLs with UTM parameters and a SignalMatch referral code.",
    outcome: "Give every creator a clean tracking link.",
  },
  {
    slug: "creator-fit-scorecard",
    title: "Creator-fit scorecard",
    shortTitle: "Fit scorecard",
    description:
      "Score audience alignment, trust, creative match, channel fit, compliance risk, and evidence quality.",
    outcome:
      "Prioritize creators with a repeatable rubric instead of gut feel.",
  },
  {
    slug: "attribution-window-planner",
    title: "Attribution-window planner",
    shortTitle: "Attribution planner",
    description:
      "Choose a window based on consideration time, price, sales motion, channel, and refund risk.",
    outcome: "Make attribution terms explicit before conversions arrive.",
  },
  {
    slug: "campaign-brief-generator",
    title: "Campaign brief generator",
    shortTitle: "Brief generator",
    description:
      "Draft a creator-ready campaign brief with conversion rules, prohibited claims, disclosures, and review terms.",
    outcome: "Start every partnership from a concrete written agreement.",
  },
  {
    slug: "conversion-tracking-checklist",
    title: "Conversion tracking and payout checklist",
    shortTitle: "Tracking checklist",
    description:
      "Audit the events, identifiers, approval policy, payout readiness, and dispute records a CPA campaign needs.",
    outcome: "Catch launch blockers before creators start sending traffic.",
  },
];
