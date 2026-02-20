import { redirect } from "next/navigation";

import { ProductForm } from "@/components/forms/product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthContext } from "@/server/auth";

export default async function NewProductPage() {
  const authContext = await getAuthContext();

  if (!authContext || (authContext.role !== "BUILDER" && authContext.role !== "ADMIN")) {
    redirect("/app/onboarding");
  }

  return (
    <Card className="border-zinc-200/80 bg-white/95">
      <CardHeader>
        <CardTitle>Create product</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductForm />
      </CardContent>
    </Card>
  );
}
