import { redirect } from "next/navigation";

import { CampaignForm } from "@/components/forms/campaign-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthContext } from "@/server/auth";
import { getBuilderProducts } from "@/server/db/read";

export default async function NewCampaignPage() {
  const authContext = await getAuthContext();

  if (!authContext) {
    redirect("/");
  }

  if (authContext.role !== "BUILDER") {
    redirect("/app");
  }

  const products = await getBuilderProducts(authContext.userId);

  if (!products.length) {
    redirect("/app/builder/products/new");
  }

  return (
    <Card className="border-zinc-200/80 bg-white/95">
      <CardHeader>
        <CardTitle>Create campaign</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-zinc-600">
          Use the guided setup to define conversion quality, approval controls,
          and budget constraints before inviting creators.
        </p>
        <CampaignForm products={products as Array<{ id: string; name: string }>} />
      </CardContent>
    </Card>
  );
}
