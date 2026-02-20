import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreatorProfileForm } from "@/components/forms/creator-profile-form";
import { getAuthContext } from "@/server/auth";
import { getCreatorProfileByUserId } from "@/server/db/read";

export default async function CreatorProfilePage() {
  const authContext = await getAuthContext();

  if (!authContext) {
    redirect("/");
  }

  if (authContext.role !== "CREATOR") {
    redirect("/app");
  }

  const profile = await getCreatorProfileByUserId(authContext.userId);

  return (
    <Card className="border-zinc-200/80 bg-white/95">
      <CardHeader>
        <CardTitle>Creator profile</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-zinc-600">
          Complete this in two steps so builders can match you to high-fit campaigns.
        </p>
        <CreatorProfileForm defaults={profile as any} />
      </CardContent>
    </Card>
  );
}
