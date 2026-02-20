import { redirect } from "next/navigation";

import { RoleForm } from "@/components/forms/role-form";
import { dashboardPathForRole, getAuthContext } from "@/server/auth";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const authContext = await getAuthContext();
  const params = await searchParams;

  if (authContext?.role) {
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
      <RoleForm currentRole={authContext?.role} preferredRole={preferredRole} />
    </div>
  );
}
