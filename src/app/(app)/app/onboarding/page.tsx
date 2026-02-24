import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { RoleForm } from "@/components/forms/role-form";
import { dashboardPathForRole, getAuthContext } from "@/server/auth";
import { CREATOR_PREFILL_COOKIE_NAME } from "@/server/lib/creator-profile-prefill";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; prefill?: string }>;
}) {
  const authContext = await getAuthContext();
  const params = await searchParams;
  const cookieStore = await cookies();
  const creatorPrefillFromQuery =
    typeof params.prefill === "string" && params.prefill.length > 0
      ? params.prefill
      : null;
  const creatorPrefillFromCookie =
    cookieStore.get(CREATOR_PREFILL_COOKIE_NAME)?.value ?? null;
  const hasCreatorPrefill = Boolean(
    creatorPrefillFromQuery || creatorPrefillFromCookie,
  );

  if (authContext?.role) {
    if (authContext.role === "CREATOR" && creatorPrefillFromQuery) {
      redirect(`/app/creator/profile?prefill=${encodeURIComponent(creatorPrefillFromQuery)}`);
    }

    if (authContext.role === "CREATOR" && creatorPrefillFromCookie) {
      redirect("/app/creator/profile");
    }

    redirect(dashboardPathForRole(authContext.role));
  }

  const preferredRole =
    params.role === "BUILDER" || params.role === "CREATOR"
      ? params.role
      : null;
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        Choose your SignalMatch workspace
      </h1>
      <p className="max-w-2xl text-zinc-600">
        Builder and creator experiences are intentionally separated so each side
        sees only the workflows relevant to them.
      </p>
      <RoleForm
        currentRole={authContext?.role}
        preferredRole={preferredRole}
        creatorPrefillQueryToken={creatorPrefillFromQuery}
        hasCreatorPrefill={hasCreatorPrefill}
      />
    </div>
  );
}
