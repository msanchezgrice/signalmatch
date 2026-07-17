export type SampleCreator = {
  id: string;
  name: string;
  handle: string;
  platform: "YouTube" | "TikTok" | "LinkedIn" | "Newsletter" | "Instagram";
  niche: string;
  audience: string;
  averageReach: string;
  matchScore: number;
  suggestedPayout: string;
  avatarUrl: string;
  reasons: string[];
};

export const sampleCreators: SampleCreator[] = [
  {
    id: "maya-chen",
    name: "Maya Chen",
    handle: "@mayabuilds",
    platform: "YouTube",
    niche: "SaaS tutorials",
    audience: "38K founders and product leads",
    averageReach: "18K–32K",
    matchScore: 94,
    suggestedPayout: "$35–$55 per paid signup",
    avatarUrl: "/creators/profiles/maya-chen.webp",
    reasons: ["Founder-heavy audience", "Hands-on product walkthroughs", "Strong signup intent"],
  },
  {
    id: "jordan-ellis",
    name: "Jordan Ellis",
    handle: "@growthnotes",
    platform: "Newsletter",
    niche: "Growth systems",
    audience: "24K startup operators",
    averageReach: "12K–18K",
    matchScore: 91,
    suggestedPayout: "$25–$45 per qualified signup",
    avatarUrl: "/creators/profiles/jordan-ellis.webp",
    reasons: ["B2B software buyers", "Weekly tool recommendations", "High email click intent"],
  },
  {
    id: "nia-brooks",
    name: "Nia Brooks",
    handle: "@niatestsai",
    platform: "TikTok",
    niche: "AI productivity",
    audience: "112K early adopters",
    averageReach: "35K–60K",
    matchScore: 88,
    suggestedPayout: "$12–$24 per activated user",
    avatarUrl: "/creators/profiles/nia-brooks.webp",
    reasons: ["Fast product demonstrations", "AI-curious audience", "Consistent comment activity"],
  },
  {
    id: "theo-martin",
    name: "Theo Martin",
    handle: "@theosaas",
    platform: "LinkedIn",
    niche: "Founder operations",
    audience: "19K founders and RevOps leads",
    averageReach: "8K–16K",
    matchScore: 86,
    suggestedPayout: "$40–$70 per booked demo",
    avatarUrl: "/creators/profiles/theo-martin.webp",
    reasons: ["Decision-maker audience", "Detailed workflow posts", "B2B buying context"],
  },
  {
    id: "sofia-reyes",
    name: "Sofia Reyes",
    handle: "@sofiasystems",
    platform: "Instagram",
    niche: "Solo business",
    audience: "54K independent operators",
    averageReach: "21K–34K",
    matchScore: 83,
    suggestedPayout: "$18–$32 per qualified signup",
    avatarUrl: "/creators/profiles/sofia-reyes.webp",
    reasons: ["Small-business audience", "Saveable workflow content", "Strong story engagement"],
  },
  {
    id: "devon-park",
    name: "Devon Park",
    handle: "@devonautomates",
    platform: "YouTube",
    niche: "Automation and no-code",
    audience: "71K builders and agencies",
    averageReach: "26K–44K",
    matchScore: 81,
    suggestedPayout: "$30–$50 per activated account",
    avatarUrl: "/creators/profiles/devon-park.webp",
    reasons: ["Implementation-focused videos", "Tool-buying audience", "Evergreen search traffic"],
  },
];
