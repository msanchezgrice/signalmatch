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
  product_id: z.string().uuid(),
  title: z.string().min(3),
  brief: z.string().optional(),
  target_tags_csv: z.string().optional(),
  conversion_type: z.enum(["signup", "activation"]).default("signup"),
  cpa_amount_cents: z.coerce.number().int().nonnegative(),
  approval_mode: z.enum(["auto", "manual"]).default("auto"),
  approval_timeout_days: z.coerce.number().int().min(1).max(30).default(7),
  budget_total_cents: z.coerce.number().int().nonnegative(),
  budget_available_cents: z.coerce.number().int().nonnegative(),
  status: z.enum(["draft", "active", "paused", "ended"]).default("draft"),
});

type FormData = any;

export function CampaignForm({ products }: { products: Array<{ id: string; name: string }> }) {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      product_id: products[0]?.id ?? "",
      conversion_type: "signup",
      approval_mode: "auto",
      approval_timeout_days: 7,
      cpa_amount_cents: 500,
      budget_total_cents: 0,
      budget_available_cents: 0,
      status: "draft",
    },
  });

  async function onSubmit(data: FormData) {
    try {
      const payload = {
        ...data,
        payout_model: "cpa",
        target_tags: data.target_tags_csv
          ?.split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
      };

      const res = await fetch("/api/builder/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed");
      }

      toast.success("Campaign created");
      router.push(`/app/builder/campaigns/${json.campaign.id}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create campaign");
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <p className="mb-1 text-sm text-zinc-600">Product</p>
        <select className="w-full rounded-md border bg-white p-2" {...form.register("product_id")}>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>
      <Input placeholder="Campaign title" {...form.register("title")} />
      <Textarea placeholder="Brief" rows={4} {...form.register("brief")} />
      <Input placeholder="Target tags (comma-separated)" {...form.register("target_tags_csv")} />
      <div className="grid gap-4 md:grid-cols-2">
        <Input placeholder="conversion_type" {...form.register("conversion_type")} />
        <Input placeholder="approval_mode" {...form.register("approval_mode")} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Input placeholder="CPA cents" type="number" {...form.register("cpa_amount_cents")} />
        <Input
          placeholder="Budget total cents"
          type="number"
          {...form.register("budget_total_cents")}
        />
        <Input
          placeholder="Budget available cents"
          type="number"
          {...form.register("budget_available_cents")}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          placeholder="Approval timeout days"
          type="number"
          {...form.register("approval_timeout_days")}
        />
        <Input placeholder="status" {...form.register("status")} />
      </div>
      <Button type="submit">Create campaign</Button>
    </form>
  );
}
