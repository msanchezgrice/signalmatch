import { redirect } from "next/navigation";

import { CampaignForm } from "@/components/forms/campaign-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthContext } from "@/server/auth";
import { getBuilderProducts } from "@/server/db/read";

type Props = { searchParams: Promise<{ goal?: string }> };

export default async function NewCampaignPage({ searchParams }: Props) {
  const authContext = await getAuthContext();

  if (!authContext) {
    redirect("/");
  }

  if (authContext.role !== "BUILDER") {
    redirect("/app");
  }

  const products = await getBuilderProducts(authContext.userId);
  const { goal } = await searchParams;

  if (!products.length) {
    redirect("/app/builder/products/new");
  }

  return (
    <Card className="app-surface">
      <CardHeader>
        <CardTitle>Build a performance offer</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm app-muted-text">
          Choose the result, explain the audience, and set what a creator earns.
          You will review funding, tracking, and creator matches before launch.
        </p>
        <CampaignForm
          products={products as Array<{ id: string; name: string }>}
          initialGoal={goal}
        />
      </CardContent>
    </Card>
  );
}
