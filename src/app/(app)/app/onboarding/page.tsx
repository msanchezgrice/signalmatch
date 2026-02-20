import { RoleForm } from "@/components/forms/role-form";
import { getAuthContext } from "@/server/auth";

export default async function OnboardingPage() {
  const authContext = await getAuthContext();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">Choose your role</h1>
      <p className="text-zinc-600">You can switch later, but your dashboard defaults to this mode.</p>
      <RoleForm currentRole={authContext?.role} />
    </div>
  );
}
