"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SignUp } from "@clerk/nextjs";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { inferSocialProfileFromUrl } from "@/lib/social-profile-scrape";

type PrefillChannel = {
  platform: string;
  handle: string;
  url: string;
  followers: number;
  avg_impressions: number;
};

type CreatorSignupPrefill = {
  source_url?: string;
  source_platform?: "linkedin" | "x";
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  niches?: string[];
  audience_tags?: string[];
  tool_stack?: string[];
  channels?: PrefillChannel[];
};

const schema = z.object({
  display_name: z.string().min(2, "Add a display name."),
  bio: z.string().max(600).optional(),
  primary_platform: z.string().min(1),
  primary_handle: z.string().min(1, "Add your primary handle."),
  primary_url: z.string().url("Add a valid primary profile URL."),
  primary_followers: z.number().int().min(0),
  primary_avg_impressions: z.number().int().min(0),
  secondary_platform: z.string().optional(),
  secondary_handle: z.string().optional(),
  secondary_url: z.string().optional(),
  secondary_followers: z.number().int().min(0),
  secondary_avg_impressions: z.number().int().min(0),
  niches_csv: z.string().optional(),
  audience_tags_csv: z.string().optional(),
  tool_stack_csv: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
type Step = 1 | 2 | 3;

function parseCsv(value?: string, max = 12) {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const item of (value ?? "").split(",")) {
    const normalized = item.trim();
    if (!normalized) {
      continue;
    }

    const key = normalized.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    output.push(normalized);
    if (output.length >= max) {
      break;
    }
  }

  return output;
}

function normalizeChannels(channels: CreatorSignupPrefill["channels"]) {
  if (!Array.isArray(channels)) {
    return [];
  }

  return channels.slice(0, 2);
}

function mergeCsvValues(current: string | undefined, incoming: string[], max = 8) {
  const merged = parseCsv(current, max).concat(incoming);
  return parseCsv(merged.join(", "), max).join(", ");
}

export function CreatorSignupHappyPath({
  initialPrefill,
  redirectUrl,
  signInUrl,
}: {
  initialPrefill: CreatorSignupPrefill | null;
  redirectUrl: string;
  signInUrl: string;
}) {
  const [step, setStep] = useState<Step>(1);
  const [savingDraft, setSavingDraft] = useState(false);
  const [scrapingPrimary, setScrapingPrimary] = useState(false);
  const [scrapingSecondary, setScrapingSecondary] = useState(false);
  const channels = normalizeChannels(initialPrefill?.channels);
  const primary = channels[0];
  const secondary = channels[1];

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      display_name: initialPrefill?.display_name ?? "",
      bio: initialPrefill?.bio ?? "",
      primary_platform: primary?.platform ?? initialPrefill?.source_platform ?? "x",
      primary_handle: primary?.handle ?? "",
      primary_url:
        primary?.url ??
        initialPrefill?.source_url ??
        (initialPrefill?.source_platform === "linkedin"
          ? "https://www.linkedin.com/in/"
          : "https://x.com/"),
      primary_followers: primary?.followers ?? 0,
      primary_avg_impressions: primary?.avg_impressions ?? 0,
      secondary_platform: secondary?.platform ?? "linkedin",
      secondary_handle: secondary?.handle ?? "",
      secondary_url: secondary?.url ?? "",
      secondary_followers: secondary?.followers ?? 0,
      secondary_avg_impressions: secondary?.avg_impressions ?? 0,
      niches_csv: (initialPrefill?.niches ?? []).join(", "),
      audience_tags_csv: (initialPrefill?.audience_tags ?? []).join(", "),
      tool_stack_csv: (initialPrefill?.tool_stack ?? []).join(", "),
    },
  });

  async function continueToStep2() {
    const ok = await form.trigger([
      "display_name",
      "bio",
      "primary_platform",
      "primary_handle",
      "primary_url",
    ]);
    if (!ok) {
      toast.error("Please complete the required profile and social fields.");
      return;
    }

    setStep(2);
  }

  async function scrapeFromUrl(target: "primary" | "secondary") {
    const isPrimary = target === "primary";
    const urlField = isPrimary ? "primary_url" : "secondary_url";
    const platformField = isPrimary ? "primary_platform" : "secondary_platform";
    const handleField = isPrimary ? "primary_handle" : "secondary_handle";
    const followersField = isPrimary ? "primary_followers" : "secondary_followers";
    const impressionsField = isPrimary ? "primary_avg_impressions" : "secondary_avg_impressions";
    const setLoading = isPrimary ? setScrapingPrimary : setScrapingSecondary;

    const rawUrl = form.getValues(urlField) ?? "";
    const inferred = inferSocialProfileFromUrl(rawUrl);
    if (!inferred) {
      toast.error("Enter a valid profile URL to scrape.");
      return;
    }

    setLoading(true);
    try {
      form.setValue(urlField, inferred.normalizedUrl, { shouldDirty: true, shouldValidate: true });
      form.setValue(platformField, inferred.platform, { shouldDirty: true, shouldValidate: true });
      form.setValue(handleField, inferred.handle, { shouldDirty: true, shouldValidate: true });

      if (!inferred.analysisPlatform) {
        toast.success("Detected platform and handle from URL.");
        return;
      }

      const res = await fetch("/api/public/creator-profile-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: inferred.normalizedUrl,
          platform: inferred.analysisPlatform,
        }),
      });
      const json = await res.json();

      if (!res.ok || !json?.prefill) {
        throw new Error(json?.error || "Could not scrape this profile.");
      }

      const prefill = json.prefill as CreatorSignupPrefill;
      const firstChannel = Array.isArray(prefill.channels) ? prefill.channels[0] : null;

      if (isPrimary) {
        if (!form.getValues("display_name") && prefill.display_name) {
          form.setValue("display_name", prefill.display_name, { shouldDirty: true });
        }
        if (!form.getValues("bio") && prefill.bio) {
          form.setValue("bio", prefill.bio, { shouldDirty: true });
        }

        if (prefill.niches?.length) {
          form.setValue("niches_csv", mergeCsvValues(form.getValues("niches_csv"), prefill.niches, 8), {
            shouldDirty: true,
          });
        }
        if (prefill.audience_tags?.length) {
          form.setValue(
            "audience_tags_csv",
            mergeCsvValues(form.getValues("audience_tags_csv"), prefill.audience_tags, 8),
            { shouldDirty: true },
          );
        }
      }

      if (firstChannel) {
        form.setValue(followersField, Number(firstChannel.followers ?? 0), { shouldDirty: true });
        form.setValue(impressionsField, Number(firstChannel.avg_impressions ?? 0), { shouldDirty: true });
      }

      toast.success("Profile scraped and fields prefilled.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not scrape profile.");
    } finally {
      setLoading(false);
    }
  }

  async function continueToAccountStep() {
    const ok = await form.trigger([
      "primary_followers",
      "primary_avg_impressions",
      "secondary_followers",
      "secondary_avg_impressions",
      "niches_csv",
      "audience_tags_csv",
      "tool_stack_csv",
      "secondary_platform",
      "secondary_handle",
      "secondary_url",
    ]);

    if (!ok) {
      toast.error("Please fix the onboarding fields before continuing.");
      return;
    }

    const values = form.getValues();
    const hasSecondaryHandle = Boolean(values.secondary_handle?.trim());
    const hasSecondaryUrl = Boolean(values.secondary_url?.trim());

    if (hasSecondaryHandle || hasSecondaryUrl) {
      if (!hasSecondaryHandle || !hasSecondaryUrl) {
        toast.error("Add both secondary handle and secondary URL, or leave both empty.");
        return;
      }

      try {
        new URL(values.secondary_url!.trim());
      } catch {
        toast.error("Secondary profile URL must be valid.");
        return;
      }
    }

    const draftPayload = {
      display_name: values.display_name.trim(),
      bio: values.bio?.trim() || undefined,
      source_platform: initialPrefill?.source_platform,
      source_url: initialPrefill?.source_url,
      niches: parseCsv(values.niches_csv, 8),
      audience_tags: parseCsv(values.audience_tags_csv, 8),
      tool_stack: parseCsv(values.tool_stack_csv, 12),
      channels: [
        {
          platform: values.primary_platform,
          handle: values.primary_handle.trim(),
          url: values.primary_url.trim(),
          followers: values.primary_followers,
          avg_impressions: values.primary_avg_impressions,
        },
        ...(hasSecondaryHandle && hasSecondaryUrl
          ? [
              {
                platform: values.secondary_platform || "linkedin",
                handle: values.secondary_handle!.trim(),
                url: values.secondary_url!.trim(),
                followers: values.secondary_followers,
                avg_impressions: values.secondary_avg_impressions,
              },
            ]
          : []),
      ],
    };

    setSavingDraft(true);
    try {
      const res = await fetch("/api/public/creator-onboarding-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftPayload),
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Could not save onboarding draft.");
      }

      setStep(3);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save onboarding draft.");
    } finally {
      setSavingDraft(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 md:p-10">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
          Creator onboarding
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
          Share your creator profile first, then create your account.
        </h1>
        <p className="mt-4 text-zinc-600">
          This reduces signup friction. We pre-fill your details and put Clerk account creation at the final step.
        </p>
        {initialPrefill ? (
          <p className="mt-5 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            Scraped details detected. Review and edit before creating your account.
          </p>
        ) : null}
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-4 md:p-6">
        <div className="mb-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600">
          Step {step} of 3
          {step === 1 ? " · Social profile" : null}
          {step === 2 ? " · Audience and tool stack" : null}
          {step === 3 ? " · Create account" : null}
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Display name</label>
                <Input placeholder="Your creator name" {...form.register("display_name")} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Primary platform</label>
                <select
                  className="w-full rounded-md border border-zinc-200 bg-white p-2 text-sm"
                  {...form.register("primary_platform")}
                >
                  <option value="x">X</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                  <option value="newsletter">Newsletter</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Bio (optional)</label>
              <Textarea rows={4} placeholder="Who follows you and what do you share?" {...form.register("bio")} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Primary handle</label>
                <Input placeholder="@yourhandle" {...form.register("primary_handle")} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Primary profile URL</label>
                <Input placeholder="https://x.com/yourhandle" {...form.register("primary_url")} />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => scrapeFromUrl("primary")}
                  disabled={savingDraft || scrapingPrimary}
                >
                  {scrapingPrimary ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Scrape from URL
                </Button>
              </div>
            </div>

            <Button type="button" onClick={continueToStep2}>
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-zinc-200 p-4">
              <p className="text-sm font-semibold text-zinc-900">Reach metrics</p>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Primary followers</label>
                  <Input type="number" min={0} {...form.register("primary_followers", { valueAsNumber: true })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Avg impressions per post</label>
                  <Input type="number" min={0} {...form.register("primary_avg_impressions", { valueAsNumber: true })} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 p-4">
              <p className="text-sm font-semibold text-zinc-900">Secondary social URL (optional)</p>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Secondary platform</label>
                  <select
                    className="w-full rounded-md border border-zinc-200 bg-white p-2 text-sm"
                    {...form.register("secondary_platform")}
                  >
                    <option value="linkedin">LinkedIn</option>
                    <option value="x">X</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="instagram">Instagram</option>
                    <option value="newsletter">Newsletter</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Secondary handle</label>
                  <Input placeholder="@yoursecondhandle" {...form.register("secondary_handle")} />
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium">Secondary profile URL</label>
                <Input placeholder="https://www.linkedin.com/in/your-profile" {...form.register("secondary_url")} />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => scrapeFromUrl("secondary")}
                  disabled={savingDraft || scrapingSecondary}
                >
                  {scrapingSecondary ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Scrape from URL
                </Button>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Secondary followers</label>
                  <Input type="number" min={0} {...form.register("secondary_followers", { valueAsNumber: true })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Secondary avg impressions</label>
                  <Input type="number" min={0} {...form.register("secondary_avg_impressions", { valueAsNumber: true })} />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Interests / topics</label>
                <Input placeholder="ai automation, creator economy, SaaS" {...form.register("niches_csv")} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Audience tags</label>
                <Input placeholder="founders, marketers, developers" {...form.register("audience_tags_csv")} />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Products you use / AI tool stack</label>
              <Input
                placeholder="chatgpt, claude, cursor, notion, canva"
                {...form.register("tool_stack_csv")}
              />
              <p className="mt-1 text-xs text-zinc-500">
                We use this to match you with products you already understand and trust.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={savingDraft}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button type="button" onClick={continueToAccountStep} disabled={savingDraft}>
                {savingDraft ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Continue to account creation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <p className="inline-flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                Great. Your onboarding details are saved. Create your account to continue.
              </p>
            </div>
            <div className="flex justify-center">
              <SignUp
                routing="path"
                path="/creators/sign-up"
                signInUrl={signInUrl}
                fallbackRedirectUrl={redirectUrl}
                forceRedirectUrl={redirectUrl}
              />
            </div>
            <p className="text-center text-xs text-zinc-500">
              Already have an account?{" "}
              <Link href={signInUrl} className="font-medium text-zinc-800 underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
