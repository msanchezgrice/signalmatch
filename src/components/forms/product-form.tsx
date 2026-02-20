"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().min(2),
  url: z.string().url(),
  description: z.string().optional(),
  category_tags_csv: z.string().optional(),
  pricing_type: z.enum(["free", "freemium", "paid"]).default("freemium"),
});

type FormData = any;

export function ProductForm() {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      pricing_type: "freemium",
    },
  });

  async function onSubmit(data: FormData) {
    try {
      const payload = {
        ...data,
        category_tags: data.category_tags_csv
          ?.split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
      };

      const res = await fetch("/api/builder/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed");
      }

      toast.success("Product created");
      router.push("/app/builder/products");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create product");
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Input placeholder="Product name" {...form.register("name")} />
      <Input placeholder="https://product-url.com" {...form.register("url")} />
      <Textarea placeholder="Description" rows={4} {...form.register("description")} />
      <Input placeholder="Category tags (comma-separated)" {...form.register("category_tags_csv")} />
      <Input placeholder="pricing type: free | freemium | paid" {...form.register("pricing_type")} />
      <Button type="submit">Create product</Button>
    </form>
  );
}
