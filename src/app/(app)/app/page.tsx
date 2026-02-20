import { redirect } from "next/navigation";

import { dashboardPathForRole, getAuthContext } from "@/server/auth";

export default async function AppEntryPage() {
  const authContext = await getAuthContext();

  redirect(dashboardPathForRole(authContext?.role));
}
