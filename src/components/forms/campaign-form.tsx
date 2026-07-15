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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAnalytics } from "@/components/providers/analytics-provider";

const schema = z.object({
  product_id: z.string().uuid(),
  title: z.string().min(3),
  brief: z.string().optional(),
  target_tags_csv: z.string().optional(),
  conversion_type: z.enum(["signup", "activation"]).default("signup"),
  cpa_amount_cents: z.coerce.number().int().nonnegative(),
  approval_mode: z.enum(["auto", "manual"]).default("auto"),
  approval_timeout_days: z.coerce.number().int().min(1).max(30).default(7),
});

type FormData = any;
type Step = 1 | 2;

export function CampaignForm({
  products,
}: {
  products: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const { capture } = useAnalytics();
  const [step, setStep] = useState<Step>(1);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      product_id: products[0]?.id ?? "",
      conversion_type: "signup",
      approval_mode: "auto",
      approval_timeout_days: 7,
      cpa_amount_cents: 500,
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
      capture("campaign_created", {
        campaignId: json.campaign.id,
        productId: data.product_id,
      });
      router.push(`/app/builder/campaigns/${json.campaign.id}`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create campaign",
      );
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="app-muted-surface app-muted-text rounded-xl border p-3 text-sm">
        Step {step} of 2
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Product</label>
            <select
              className="app-surface w-full rounded-md border p-2"
              {...form.register("product_id")}
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Campaign title
            </label>
            <Input
              placeholder="Get qualified AI founders to signup"
              {...form.register("title")}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Campaign brief
            </label>
            <Textarea
              placeholder="Describe who to target and what counts as success."
              rows={4}
              {...form.register("brief")}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Target tags
            </label>
            <Input
              placeholder="founders, ai-devtools"
              {...form.register("target_tags_csv")}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Conversion type
              </label>
              <select
                className="app-surface w-full rounded-md border p-2"
                {...form.register("conversion_type")}
              >
                <option value="signup">Signup</option>
                <option value="activation">Activation</option>
              </select>
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-sm font-medium">
                Approval mode
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="app-subtle-text hover:text-[var(--app-text)]"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    Use manual mode for initial quality control; auto mode
                    approves immediately when events arrive.
                  </TooltipContent>
                </Tooltip>
              </label>
              <select
                className="app-surface w-full rounded-md border p-2"
                {...form.register("approval_mode")}
              >
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
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                CPA amount (cents)
              </label>
              <Input type="number" {...form.register("cpa_amount_cents")} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Approval timeout days
              </label>
              <Input
                type="number"
                {...form.register("approval_timeout_days")}
              />
            </div>
          </div>
          <p className="app-muted-surface app-muted-text rounded-xl border p-3 text-sm leading-6">
            New campaigns start as drafts with a zero balance. Funding through
            Stripe activates the campaign; only verified payments can increase
            the available budget.
          </p>
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
