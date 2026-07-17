import { redirect } from "next/navigation";

import { ProductForm } from "@/components/forms/product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthContext } from "@/server/auth";

export default async function NewProductPage() {
  const authContext = await getAuthContext();

  if (!authContext) {
    redirect("/");
  }

  if (authContext.role !== "BUILDER") {
    redirect("/app");
  }

  return (
    <Card className="app-surface">
      <CardHeader>
        <CardTitle>Create product</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm app-muted-text">
          Paste your domain—even without https://—and SignalMatch will draft the
          product story, category, and likely customer audience for you to review.
        </p>
        <ProductForm />
      </CardContent>
    </Card>
  );
}
