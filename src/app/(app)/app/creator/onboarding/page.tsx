import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { CreatorOnboardingWizard } from "@/components/forms/creator-onboarding-wizard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthContext } from "@/server/auth";
import { getCreatorProfileByUserId } from "@/server/db/read";
import { setUserRole } from "@/server/db/write";
import {
  CREATOR_PREFILL_COOKIE_NAME,
  decodeCreatorPrefillToken,
  mergeCreatorDefaults,
} from "@/server/lib/creator-profile-prefill";

export default async function CreatorOnboardingPage({
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

  const prefillFromQuery =
    typeof params.prefill === "string" && params.prefill.length > 0
      ? params.prefill
      : null;
  const prefillToken =
    prefillFromQuery ?? cookieStore.get(CREATOR_PREFILL_COOKIE_NAME)?.value ?? null;
  const prefill = decodeCreatorPrefillToken(prefillToken);

  const profile = await getCreatorProfileByUserId(authContext.userId);
  if (profile) {
    redirect("/app/creator/start");
  }

  const defaults = mergeCreatorDefaults(profile as any, prefill);

  return (
    <Card className="app-surface">
      <CardHeader>
        <CardTitle>Creator onboarding wizard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm app-muted-text">
          Add your social URLs, follower counts, audience interests, and profile details so builders can send high-fit partnerships.
        </p>
        {prefill ? (
          <p className="mb-4 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            We pre-filled this wizard from your {prefill.source_platform === "linkedin" ? "LinkedIn" : "X"} profile.
            Review and edit anything before saving.
          </p>
        ) : null}
        <CreatorOnboardingWizard defaults={defaults as any} />
      </CardContent>
    </Card>
  );
}
