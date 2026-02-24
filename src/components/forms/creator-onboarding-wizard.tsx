"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2, Info, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { inferSocialProfileFromUrl } from "@/lib/social-profile-scrape";

const schema = z.object({
  display_name: z.string().min(2, "Display name must be at least 2 characters."),
  bio: z.string().max(600).optional(),
  avatar_url: z.string().url("Avatar URL must be a valid URL.").optional().or(z.literal("")),
  niches_csv: z.string().optional(),
  audience_tags_csv: z.string().optional(),
  tool_stack_csv: z.string().optional(),
  primary_platform: z.string().min(1),
  primary_handle: z.string().min(1, "Primary handle is required."),
  primary_url: z.string().url("Primary profile URL must be valid."),
  primary_followers: z.number().int().min(0),
  primary_avg_impressions: z.number().int().min(0),
  secondary_platform: z.string().optional(),
  secondary_handle: z.string().optional(),
  secondary_url: z.string().optional(),
  secondary_followers: z.number().int().min(0),
  secondary_avg_impressions: z.number().int().min(0),
});

type FormData = z.infer<typeof schema>;
type Step = 1 | 2 | 3;

function normalizeChannels(channels: unknown) {
  if (!Array.isArray(channels)) {
    return [];
  }

  return channels
    .map((item) => item as Record<string, unknown>)
    .map((item) => ({
      platform: String(item.platform ?? "x"),
      handle: String(item.handle ?? ""),
      url: String(item.url ?? ""),
      followers: Number(item.followers ?? 0),
      avg_impressions: Number(item.avg_impressions ?? 0),
    }))
    .filter((item) => item.handle && item.url)
    .slice(0, 2);
}

function parseCsv(value?: string) {
  return (value ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function mergeCsvValues(current: string | undefined, incoming: string[], max = 8) {
  return Array.from(new Set([...parseCsv(current), ...incoming])).slice(0, max).join(", ");
}

export function CreatorOnboardingWizard({
  defaults,
}: {
  defaults?: {
    display_name?: string;
    bio?: string;
    avatar_url?: string;
    niches?: string[];
    audience_tags?: string[];
    tool_stack?: string[];
    channels?: unknown;
  } | null;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [scrapingPrimary, setScrapingPrimary] = useState(false);
  const [scrapingSecondary, setScrapingSecondary] = useState(false);
  const channels = normalizeChannels(defaults?.channels);
  const primary = channels[0];
  const secondary = channels[1];

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      display_name: defaults?.display_name ?? "",
      bio: defaults?.bio ?? "",
      avatar_url: defaults?.avatar_url ?? "",
      niches_csv: defaults?.niches?.join(", ") ?? "",
      audience_tags_csv: defaults?.audience_tags?.join(", ") ?? "",
      tool_stack_csv: defaults?.tool_stack?.join(", ") ?? "",
      primary_platform: primary?.platform ?? "x",
      primary_handle: primary?.handle ?? "",
      primary_url: primary?.url ?? "https://x.com/",
      primary_followers: primary?.followers ?? 0,
      primary_avg_impressions: primary?.avg_impressions ?? 0,
      secondary_platform: secondary?.platform ?? "linkedin",
      secondary_handle: secondary?.handle ?? "",
      secondary_url: secondary?.url ?? "",
      secondary_followers: secondary?.followers ?? 0,
      secondary_avg_impressions: secondary?.avg_impressions ?? 0,
    },
  });

  const stepTitle = useMemo(() => {
    if (step === 1) return "Profile basics";
    if (step === 2) return "Social channels";
    return "Audience reach";
  }, [step]);

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

      const prefill = json.prefill as {
        display_name?: string;
        bio?: string;
        niches?: string[];
        audience_tags?: string[];
        tool_stack?: string[];
        channels?: Array<{ followers?: number; avg_impressions?: number }>;
      };

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
        if (prefill.tool_stack?.length) {
          form.setValue(
            "tool_stack_csv",
            mergeCsvValues(form.getValues("tool_stack_csv"), prefill.tool_stack, 12),
            {
              shouldDirty: true,
            },
          );
        }
      }

      const firstChannel = Array.isArray(prefill.channels) ? prefill.channels[0] : null;
      if (firstChannel) {
        form.setValue(followersField, Number(firstChannel.followers ?? 0), { shouldDirty: true });
        form.setValue(impressionsField, Number(firstChannel.avg_impressions ?? 0), {
          shouldDirty: true,
        });
      }

      toast.success("Profile scraped and fields prefilled.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not scrape profile.");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(values: FormData) {
    setSubmitting(true);
    try {
      const payload: {
        display_name: string;
        bio?: string;
        avatar_url?: string;
        niches: string[];
        audience_tags: string[];
        channels: Array<{
          platform: string;
          handle: string;
          url: string;
          followers: number;
          avg_impressions: number;
        }>;
      } = {
        display_name: values.display_name,
        bio: values.bio || undefined,
        avatar_url: values.avatar_url || undefined,
        niches: Array.from(
          new Set([...parseCsv(values.niches_csv), ...parseCsv(values.tool_stack_csv)]),
        ).slice(0, 8),
        audience_tags: parseCsv(values.audience_tags_csv),
        channels: [
          {
            platform: values.primary_platform,
            handle: values.primary_handle,
            url: values.primary_url,
            followers: values.primary_followers,
            avg_impressions: values.primary_avg_impressions,
          },
        ],
      };

      const hasSecondaryHandle = Boolean(values.secondary_handle?.trim());
      const hasSecondaryUrl = Boolean(values.secondary_url?.trim());

      if (hasSecondaryHandle || hasSecondaryUrl) {
        if (!hasSecondaryHandle || !hasSecondaryUrl) {
          throw new Error("Add both secondary handle and secondary profile URL, or leave both empty.");
        }

        let parsedSecondaryUrl: URL;
        try {
          parsedSecondaryUrl = new URL(values.secondary_url!.trim());
        } catch {
          throw new Error("Secondary profile URL must be valid.");
        }

        payload.channels.push({
          platform: values.secondary_platform || "linkedin",
          handle: values.secondary_handle!.trim(),
          url: parsedSecondaryUrl.toString(),
          followers: values.secondary_followers,
          avg_impressions: values.secondary_avg_impressions,
        });
      }

      const res = await fetch("/api/creator/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.formErrors?.join(", ") || json.error || "Could not save onboarding.");
      }

      toast.success("Creator onboarding complete");
      router.push("/app/creator/start");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save onboarding.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
          Step {step} of 3
        </p>
        <p className="mt-1 text-lg font-semibold text-zinc-900">{stepTitle}</p>
      </div>

      {step === 1 ? (
        <section className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Display name</label>
              <Input placeholder="Your creator name" {...form.register("display_name")} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Avatar URL (optional)</label>
              <Input placeholder="https://..." {...form.register("avatar_url")} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Bio</label>
            <Textarea
              rows={4}
              placeholder="What do you post about, and who is your audience?"
              {...form.register("bio")}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-sm font-medium">
                Interests / niches
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-zinc-500 hover:text-zinc-800">
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    Comma-separated topics like AI tools, growth marketing, and startup operations.
                  </TooltipContent>
                </Tooltip>
              </label>
              <Input placeholder="ai tools, creator economy, SaaS" {...form.register("niches_csv")} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Audience tags</label>
              <Input placeholder="founders, marketers, developers" {...form.register("audience_tags_csv")} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Products you use / AI tool stack
            </label>
            <Input
              placeholder="chatgpt, claude, cursor, notion, canva"
              {...form.register("tool_stack_csv")}
            />
            <p className="mt-1 text-xs text-zinc-500">
              We use this to match you with products you already understand and trust.
            </p>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="space-y-5">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <p className="text-sm font-semibold text-zinc-900">Primary channel</p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Platform</label>
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
              <div>
                <label className="mb-1 block text-sm font-medium">Handle</label>
                <Input placeholder="@yourhandle" {...form.register("primary_handle")} />
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium">Profile URL</label>
              <Input placeholder="https://x.com/yourhandle" {...form.register("primary_url")} />
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => scrapeFromUrl("primary")}
                disabled={submitting || scrapingPrimary}
              >
                {scrapingPrimary ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Scrape from URL
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <p className="text-sm font-semibold text-zinc-900">Secondary channel (optional)</p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Platform</label>
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
                <label className="mb-1 block text-sm font-medium">Handle</label>
                <Input placeholder="@yoursecondhandle" {...form.register("secondary_handle")} />
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium">Profile URL</label>
              <Input
                placeholder="https://www.linkedin.com/in/your-profile"
                {...form.register("secondary_url")}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => scrapeFromUrl("secondary")}
                disabled={submitting || scrapingSecondary}
              >
                {scrapingSecondary ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Scrape from URL
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="space-y-5">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <p className="text-sm font-semibold text-zinc-900">Primary channel reach</p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Follower count</label>
                <Input
                  type="number"
                  min={0}
                  {...form.register("primary_followers", { valueAsNumber: true })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Avg impressions per post</label>
                <Input
                  type="number"
                  min={0}
                  {...form.register("primary_avg_impressions", { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <p className="text-sm font-semibold text-zinc-900">Secondary channel reach (optional)</p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Follower count</label>
                <Input
                  type="number"
                  min={0}
                  {...form.register("secondary_followers", { valueAsNumber: true })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Avg impressions per post</label>
                <Input
                  type="number"
                  min={0}
                  {...form.register("secondary_avg_impressions", { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <p className="inline-flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4" />
              This profile will be used to match you with relevant campaigns.
            </p>
          </div>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {step > 1 ? (
          <Button type="button" variant="outline" onClick={() => setStep((step - 1) as Step)} disabled={submitting}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        ) : null}
        {step < 3 ? (
          <Button type="button" onClick={() => setStep((step + 1) as Step)} disabled={submitting}>
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Complete onboarding
          </Button>
        )}
      </div>
    </form>
  );
}
