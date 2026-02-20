import { redirect } from "next/navigation";

import { getAuthContext } from "@/server/auth";

export default async function AppEntryPage() {
  const authContext = await getAuthContext();

  if (!authContext?.role) {
    redirect("/app/onboarding");
  }

  if (authContext.role === "CREATOR") {
    redirect("/app/creator/profile");
  }

  if (authContext.role === "BUILDER") {
    redirect("/app/builder/campaigns");
  }

  redirect("/app/admin");
}
