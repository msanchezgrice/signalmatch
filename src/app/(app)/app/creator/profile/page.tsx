import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreatorProfileForm } from "@/components/forms/creator-profile-form";
import { getAuthContext } from "@/server/auth";
import { getCreatorProfileByUserId } from "@/server/db/read";
import {
  CREATOR_PREFILL_COOKIE_NAME,
  decodeCreatorPrefillToken,
  mergeCreatorDefaults,
} from "@/server/lib/creator-profile-prefill";

export default async function CreatorProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ prefill?: string }>;
}) {
  const authContext = await getAuthContext();
  const params = await searchParams;
  const cookieStore = await cookies();

  if (!authContext) {
    redirect("/");
  }

  if (authContext.role !== "CREATOR") {
    redirect("/app");
  }

  const profile = await getCreatorProfileByUserId(authContext.userId);
  const prefillTokenFromQuery =
    typeof params.prefill === "string" && params.prefill.length > 0
      ? params.prefill
      : null;
  const prefillToken = prefillTokenFromQuery ?? cookieStore.get(CREATOR_PREFILL_COOKIE_NAME)?.value ?? null;
  const prefill = decodeCreatorPrefillToken(prefillToken);
  const defaults = mergeCreatorDefaults(profile as any, prefill);

  return (
    <Card className="border-zinc-200/80 bg-white/95">
      <CardHeader>
        <CardTitle>Creator profile</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-zinc-600">
          Complete this in two steps so builders can match you to high-fit campaigns.
        </p>
        {prefill ? (
          <p className="mb-4 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            We pre-filled this profile from your {prefill.source_platform === "linkedin" ? "LinkedIn" : "X"} URL.
            Review and edit anything before saving.
          </p>
        ) : null}
        <CreatorProfileForm defaults={defaults as any} />
      </CardContent>
    </Card>
  );
}
