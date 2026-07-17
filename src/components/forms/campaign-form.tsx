"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, CircleDollarSign, Info, ShieldCheck, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { useAnalytics } from "@/components/providers/analytics-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const schema = z.object({
  product_id: z.string().uuid(),
  title: z.string().min(3, "Name this offer"),
  brief: z.string().min(20, "Add a little more detail so creators know who this is for").max(1500),
  target_tags_csv: z.string().optional(),
  conversion_type: z.enum(["signup", "activation"]).default("signup"),
  cpa_amount_dollars: z.coerce.number().min(1).max(10_000),
  approval_mode: z.enum(["auto", "manual"]).default("manual"),
});

type FormInput = z.input<typeof schema>;
type FormData = z.output<typeof schema>;
type Step = 1 | 2 | 3;

const goalDefaults: Record<string, { title: string; brief: string; conversionType: "signup" | "activation"; payout: number }> = {
  "qualified-signup": {
    title: "Drive qualified product signups",
    brief: "Reward creators when a referred person creates a legitimate account that matches our target customer.",
    conversionType: "signup",
    payout: 8,
  },
  "paid-customer": {
    title: "Turn creator referrals into paid customers",
    brief: "Reward creators when a referred account becomes a paying customer for the first time.",
    conversionType: "activation",
    payout: 40,
  },
  "booked-demo": {
    title: "Generate qualified product demos",
    brief: "Reward creators when a referred prospect matches our criteria and completes a booked demo.",
    conversionType: "activation",
    payout: 25,
  },
  purchase: {
    title: "Drive first-time customer purchases",
    brief: "Reward creators when a new referred customer completes an eligible first purchase.",
    conversionType: "activation",
    payout: 20,
  },
};

export function CampaignForm({
  products,
  initialGoal = "paid-customer",
}: {
  products: Array<{ id: string; name: string }>;
  initialGoal?: string;
}) {
  const router = useRouter();
  const { capture } = useAnalytics();
  const [step, setStep] = useState<Step>(1);
  const defaults = goalDefaults[initialGoal] ?? goalDefaults["paid-customer"];
  const form = useForm<FormInput, undefined, FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      product_id: products[0]?.id ?? "",
      title: defaults.title,
      brief: defaults.brief,
      target_tags_csv: "",
      conversion_type: defaults.conversionType,
      approval_mode: "manual",
      cpa_amount_dollars: defaults.payout,
    },
  });

  const conversionType = form.watch("conversion_type");
  const approvalMode = form.watch("approval_mode");
  const payout = Number(form.watch("cpa_amount_dollars") || 0);

  async function continueFrom(stepToValidate: Step, next: Step) {
    const fields: Array<keyof FormInput> =
      stepToValidate === 1
        ? ["product_id", "conversion_type"]
        : ["title", "brief", "target_tags_csv"];
    if (await form.trigger(fields)) setStep(next);
  }

  async function onSubmit(data: FormData) {
    try {
      const payload = {
        product_id: data.product_id,
        title: data.title,
        brief: data.brief,
        target_tags: data.target_tags_csv
          ?.split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        conversion_type: data.conversion_type,
        payout_model: "cpa",
        cpa_amount_cents: Math.round(data.cpa_amount_dollars * 100),
        approval_mode: data.approval_mode,
        approval_timeout_days: 7,
      };

      const response = await fetch("/api/builder/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Could not create offer");

      toast.success("Offer created. Next, review funding and creator matches.");
      capture("campaign_created", { campaignId: json.campaign.id, productId: data.product_id });
      router.push(`/app/builder/campaigns/${json.campaign.id}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create offer");
    }
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-3 gap-2" aria-label={`Step ${step} of 3`}>
        {["Result", "Creator brief", "Payout & review"].map((label, index) => {
          const number = (index + 1) as Step;
          return (
            <div key={label} className="min-w-0">
              <div className={`h-1.5 rounded-full ${number <= step ? "bg-[#07988d]" : "bg-[var(--app-border)]"}`} />
              <p className={`mt-2 truncate text-xs ${number === step ? "font-semibold" : "app-subtle-text"}`}>{label}</p>
            </div>
          );
        })}
      </div>

      {step === 1 ? (
        <section className="space-y-5">
          <div>
            <p className="font-mono text-xs font-semibold tracking-[0.16em] text-[#087f77] uppercase">Step 1 · Business result</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">What should a creator deliver?</h2>
            <p className="app-muted-text mt-2 text-sm leading-6">Choose the product and the moment that earns a payout. You can define the exact qualification rules in the next step.</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold">Product creators will promote</label>
            <select className="app-surface w-full rounded-xl border p-3 text-sm" {...form.register("product_id")}>
              {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
            </select>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {[
              {
                value: "signup" as const,
                title: "New account",
                copy: "Pay after a referred person creates a legitimate account.",
                example: "Best for free trials and lead capture",
              },
              {
                value: "activation" as const,
                title: "Qualified result after signup",
                copy: "Pay after the person purchases, subscribes, books, or reaches a milestone you define.",
                example: "Best for paid customers and qualified demos",
              },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => form.setValue("conversion_type", option.value, { shouldDirty: true })}
                className={`rounded-2xl border p-4 text-left transition hover:border-[#07988d] ${conversionType === option.value ? "border-[#07988d] bg-[#e8fbf8]" : "border-[var(--app-border)] bg-white/65"}`}
              >
                <span className="flex items-center justify-between gap-3 font-semibold">
                  {option.title}
                  <span className={`grid size-5 place-items-center rounded-full border ${conversionType === option.value ? "border-[#07988d] bg-[#07988d] text-white" : "border-[var(--app-border-strong)]"}`}>
                    {conversionType === option.value ? <Check className="size-3" /> : null}
                  </span>
                </span>
                <span className="app-muted-text mt-2 block text-sm leading-5">{option.copy}</span>
                <span className="mt-3 block font-mono text-[11px] text-[#087f77]">{option.example}</span>
              </button>
            ))}
          </div>

          <Button type="button" onClick={() => continueFrom(1, 2)}>
            Describe the creator offer
            <ArrowRight className="size-4" />
          </Button>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="space-y-5">
          <div>
            <p className="font-mono text-xs font-semibold tracking-[0.16em] text-[#087f77] uppercase">Step 2 · Creator brief</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Make the offer easy to understand.</h2>
            <p className="app-muted-text mt-2 text-sm leading-6">Creators should know who the product helps, what content fits, and exactly what counts as an approved result.</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Offer name</label>
            <Input placeholder="Drive qualified product signups" {...form.register("title")} />
            {form.formState.errors.title ? <p className="mt-1 text-xs text-destructive">{form.formState.errors.title.message}</p> : null}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">What should creators know?</label>
            <Textarea placeholder="Who is the ideal customer? What result qualifies? What should creators avoid promising?" rows={6} {...form.register("brief")} />
            {form.formState.errors.brief ? <p className="mt-1 text-xs text-destructive">{form.formState.errors.brief.message}</p> : null}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Ideal audience signals</label>
            <Input placeholder="startup founders, AI tools, product-led growth" {...form.register("target_tags_csv")} />
            <p className="app-subtle-text mt-1.5 text-xs">Separate phrases with commas. We use these to explain why creators match.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(1)}><ArrowLeft className="size-4" />Back</Button>
            <Button type="button" onClick={() => continueFrom(2, 3)}>Set payout<ArrowRight className="size-4" /></Button>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="space-y-5">
          <div>
            <p className="font-mono text-xs font-semibold tracking-[0.16em] text-[#087f77] uppercase">Step 3 · Payout and review</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Decide what one approved result is worth.</h2>
            <p className="app-muted-text mt-2 text-sm leading-6">Your campaign starts as an unfunded draft. Nothing is charged until you add budget on the next screen.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
                Creator payout per approved result
                <Tooltip><TooltipTrigger asChild><button type="button" className="app-subtle-text"><Info className="size-3.5" /></button></TooltipTrigger><TooltipContent className="max-w-xs">The amount a creator earns after you approve one eligible result.</TooltipContent></Tooltip>
              </label>
              <div className="relative">
                <CircleDollarSign className="app-subtle-text pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input className="pl-9" type="number" min="1" step="1" {...form.register("cpa_amount_dollars")} />
              </div>
              <p className="app-subtle-text mt-1.5 text-xs">Enter dollars, not cents.</p>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Who approves results?</label>
              <select className="app-surface w-full rounded-md border p-2 text-sm" {...form.register("approval_mode")}>
                <option value="manual">I review each result</option>
                <option value="auto">Approve automatically</option>
              </select>
              <p className="app-subtle-text mt-1.5 text-xs">Manual review is recommended for your first campaign.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#07988d]/25 bg-[#e8fbf8] p-5">
            <div className="flex items-start gap-3">
              <Target className="mt-0.5 size-5 shrink-0 text-[#087f77]" />
              <div>
                <p className="font-semibold text-[#0b5f59]">Your offer in one sentence</p>
                <p className="mt-2 text-sm leading-6 text-[#214e4a]">
                  Pay <strong>${Number.isFinite(payout) ? payout.toFixed(0) : "0"}</strong> when a referred person completes an approved {conversionType === "signup" ? "new account signup" : "qualified result"}. {approvalMode === "manual" ? "You review every result before payout." : "Eligible results are approved automatically."}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#7257ff]/15 bg-[#7257ff]/5 p-4 text-sm">
            <p className="flex items-center gap-2 font-semibold text-[#5440bd]"><ShieldCheck className="size-4" />Tracking comes next</p>
            <p className="app-muted-text mt-2 leading-5">After creation, SignalMatch will show your funding status, creator matches, referral-link journey, and developer setup in that order.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(2)}><ArrowLeft className="size-4" />Back</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Creating…" : "Create offer and review"}</Button>
          </div>
        </section>
      ) : null}
    </form>
  );
}
