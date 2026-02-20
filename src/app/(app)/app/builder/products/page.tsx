import Link from "next/link";
import { redirect } from "next/navigation";

import { ActionButton } from "@/components/forms/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthContext } from "@/server/auth";
import { getBuilderProducts } from "@/server/db/read";

export default async function BuilderProductsPage() {
  const authContext = await getAuthContext();

  if (!authContext) {
    redirect("/");
  }

  if (authContext.role !== "BUILDER") {
    redirect("/app");
  }

  const products = await getBuilderProducts(authContext.userId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <Link href="/app/builder/products/new">
          <Button>Create product</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {products.map((product: any) => (
          <Card key={product.id} className="border-zinc-200/80 bg-white/95">
            <CardHeader>
              <CardTitle className="text-lg">{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-zinc-600">
              <p>{product.url}</p>
              <p>{product.description || "No description"}</p>
              <ActionButton
                label="Generate conversion API key"
                action={`/api/builder/products/${product.id}/api-key`}
                variant="outline"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
