"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Info, Loader2, ScanSearch } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const schema = z.object({
  name: z.string().min(2),
  url: z.string().url(),
  description: z.string().optional(),
  category_tags_csv: z.string().optional(),
  pricing_type: z.enum(["free", "freemium", "paid"]).default("freemium"),
});

type FormData = any;
type Step = 1 | 2;
type SiteAnalysis = {
  title: string | null;
  summary: string | null;
  key_points: string[];
  category_tags: string[];
  target_personas: Array<{ name: string; rationale: string }>;
};

export function ProductForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SiteAnalysis | null>(null);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      url: "",
      description: "",
      category_tags_csv: "",
      pricing_type: "freemium",
    },
  });

  async function runAnalyzer() {
    const url = form.getValues("url");
    if (!url) {
      toast.error("Enter a website URL first");
      return;
    }

    setAnalyzing(true);
    try {
      const response = await fetch("/api/builder/site-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Could not analyze website");
      }

      const parsed = json.analysis as SiteAnalysis;
      setAnalysis(parsed);

      if (!form.getValues("name") && parsed.title) {
        form.setValue("name", parsed.title.trim().slice(0, 80));
      }
      if (!form.getValues("description") && parsed.summary) {
        form.setValue("description", parsed.summary.trim().slice(0, 500));
      }
      if (!form.getValues("category_tags_csv") && parsed.category_tags.length > 0) {
        form.setValue("category_tags_csv", parsed.category_tags.join(", "));
      }

      toast.success("Website analyzed and product draft filled");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  }

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
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600">
        Step {step} of 2
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-sm font-medium">
              Website URL
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="text-zinc-500 hover:text-zinc-800">
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  We use this to extract headline messaging, features, and likely customer personas.
                </TooltipContent>
              </Tooltip>
            </label>
            <Input placeholder="https://yourproduct.com" {...form.register("url")} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="outline" onClick={runAnalyzer} disabled={analyzing}>
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanSearch className="h-4 w-4" />}
              Analyze website
            </Button>
            <Button
              type="button"
              onClick={() => setStep(2)}
              disabled={!form.getValues("url")}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {analysis ? (
            <Card className="border-zinc-200/80 bg-white/95">
              <CardHeader>
                <CardTitle className="text-base">Analyzer output</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-zinc-600">
                <div>
                  <p className="font-medium text-zinc-900">Suggested summary</p>
                  <p>{analysis.summary || "No summary extracted."}</p>
                </div>
                <div>
                  <p className="font-medium text-zinc-900">Core points</p>
                  <ul className="list-disc space-y-1 pl-5">
                    {analysis.key_points.slice(0, 4).map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-zinc-900">Target personas</p>
                  <ul className="space-y-1">
                    {analysis.target_personas.map((persona) => (
                      <li key={persona.name}>
                        <span className="font-medium text-zinc-900">{persona.name}:</span>{" "}
                        {persona.rationale}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Product name</label>
            <Input placeholder="SignalMatch" {...form.register("name")} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <Textarea
              placeholder="What problem does your product solve and for whom?"
              rows={5}
              {...form.register("description")}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Category tags</label>
            <Input
              placeholder="ai-devtools, growth, automation"
              {...form.register("category_tags_csv")}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Pricing model</label>
            <select
              className="w-full rounded-md border border-zinc-200 bg-white p-2 text-sm"
              {...form.register("pricing_type")}
            >
              <option value="free">Free</option>
              <option value="freemium">Freemium</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button type="submit">Create product</Button>
          </div>
        </div>
      )}
    </form>
  );
}
