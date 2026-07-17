import { sampleCreators } from "@/lib/sample-creators";

export const showcaseCreators = sampleCreators.map((creator) => ({
  id: creator.id,
  example: true as const,
  displayName: creator.name,
  handle: creator.handle,
  bio: `${creator.name} creates practical ${creator.niche.toLowerCase()} content for ${creator.audience.toLowerCase()}, with an emphasis on products viewers can try and evaluate themselves.`,
  avatarUrl: creator.avatarUrl,
  niches: [creator.niche, creator.platform, "Software"],
  audienceTags: creator.reasons,
  suggestedPayout: creator.suggestedPayout,
  averageReach: creator.averageReach,
  channels: [
    {
      platform: creator.platform.toLowerCase(),
      handle: creator.handle.replace(/^@/, ""),
      followersLabel: creator.audience,
      reachLabel: creator.averageReach,
    },
  ],
}));

export function getShowcaseCreator(id: string) {
  return showcaseCreators.find((creator) => creator.id === id);
}
