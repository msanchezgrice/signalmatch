"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
type Step = 1 | 2;

export function CampaignForm({ products }: { products: Array<{ id: string; name: string }> }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
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
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600">
        Step {step} of 2
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Product</label>
            <select className="w-full rounded-md border bg-white p-2" {...form.register("product_id")}>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Campaign title</label>
            <Input placeholder="Get qualified AI founders to signup" {...form.register("title")} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Campaign brief</label>
            <Textarea placeholder="Describe who to target and what counts as success." rows={4} {...form.register("brief")} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Target tags</label>
            <Input placeholder="founders, ai-devtools" {...form.register("target_tags_csv")} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Conversion type</label>
              <select className="w-full rounded-md border bg-white p-2" {...form.register("conversion_type")}>
                <option value="signup">Signup</option>
                <option value="activation">Activation</option>
              </select>
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-sm font-medium">
                Approval mode
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-zinc-500 hover:text-zinc-800">
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    Use manual mode for initial quality control; auto mode approves immediately when events arrive.
                  </TooltipContent>
                </Tooltip>
              </label>
              <select className="w-full rounded-md border bg-white p-2" {...form.register("approval_mode")}>
                <option value="manual">Manual</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
          <Button type="button" onClick={() => setStep(2)}>
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">CPA amount (cents)</label>
              <Input type="number" {...form.register("cpa_amount_cents")} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Budget total (cents)</label>
              <Input type="number" {...form.register("budget_total_cents")} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Budget available (cents)</label>
              <Input type="number" {...form.register("budget_available_cents")} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Approval timeout days</label>
              <Input type="number" {...form.register("approval_timeout_days")} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Campaign status</label>
              <select className="w-full rounded-md border bg-white p-2" {...form.register("status")}>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="ended">Ended</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button type="submit">Create campaign</Button>
          </div>
        </div>
      )}
    </form>
  );
}
