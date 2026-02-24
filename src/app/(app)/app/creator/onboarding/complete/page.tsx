import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getAuthContext } from "@/server/auth";
import { getCreatorProfileByUserId } from "@/server/db/read";
import { setUserRole, upsertCreatorProfile } from "@/server/db/write";
import {
  CREATOR_PREFILL_COOKIE_NAME,
  decodeCreatorPrefillToken,
} from "@/server/lib/creator-profile-prefill";
import { creatorProfileSchema } from "@/server/lib/validators";

function dedupe(values: string[]) {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const value of values) {
    const normalized = value.trim();
    if (!normalized) {
      continue;
    }

    const key = normalized.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    output.push(normalized);
  }

  return output;
}

export default async function CreatorOnboardingCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ prefill?: string }>;
}) {
  const authContext = await getAuthContext();
  const params = await searchParams;
  const cookieStore = await cookies();

  if (!authContext) {
    redirect("/creators/sign-up");
  }

  if (authContext.role === "BUILDER") {
    redirect("/app/builder/start");
  }

  if (!authContext.role) {
    await setUserRole(authContext.userId, "CREATOR");
  }

  const existingProfile = await getCreatorProfileByUserId(authContext.userId);
  if (existingProfile) {
    redirect("/app/creator/start");
  }

  const prefillFromQuery =
    typeof params.prefill === "string" && params.prefill.length > 0
      ? params.prefill
      : null;
  const prefillToken =
    prefillFromQuery ?? cookieStore.get(CREATOR_PREFILL_COOKIE_NAME)?.value ?? null;
  const prefill = decodeCreatorPrefillToken(prefillToken);

  if (!prefill) {
    redirect("/app/creator/onboarding");
  }

  const parsed = creatorProfileSchema.safeParse({
    display_name: prefill.display_name ?? "",
    bio: prefill.bio,
    avatar_url: prefill.avatar_url,
    niches: dedupe([...(prefill.niches ?? []), ...(prefill.tool_stack ?? [])]).slice(0, 8),
    audience_tags: prefill.audience_tags ?? [],
    channels: prefill.channels ?? [],
  });

  if (!parsed.success) {
    redirect("/app/creator/onboarding");
  }

  await upsertCreatorProfile({
    userId: authContext.userId,
    displayName: parsed.data.display_name,
    bio: parsed.data.bio,
    avatarUrl: parsed.data.avatar_url,
    niches: parsed.data.niches,
    audienceTags: parsed.data.audience_tags,
    channels: parsed.data.channels,
  });

  redirect("/app/creator/deals?onboarding=1");
}
