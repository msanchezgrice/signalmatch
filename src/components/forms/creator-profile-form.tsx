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
  display_name: z.string().min(2),
  bio: z.string().optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
  niches_csv: z.string().optional(),
  audience_tags_csv: z.string().optional(),
  platform: z.string().min(1),
  handle: z.string().min(1),
  channel_url: z.string().url(),
  followers: z.number().int().min(0),
  avg_impressions: z.number().int().min(0),
});

type FormData = z.infer<typeof schema>;
type Step = 1 | 2;

function normalizeFirstChannel(channels: unknown) {
  if (!Array.isArray(channels) || channels.length === 0) {
    return null;
  }
  const first = channels[0] as Record<string, unknown>;
  return {
    platform: String(first.platform ?? "x"),
    handle: String(first.handle ?? ""),
    url: String(first.url ?? "https://x.com/"),
    followers: Number(first.followers ?? 0),
    avg_impressions: Number(first.avg_impressions ?? 0),
  };
}

export function CreatorProfileForm({
  defaults,
}: {
  defaults?: {
    display_name?: string;
    bio?: string;
    avatar_url?: string;
    niches?: string[];
    audience_tags?: string[];
    channels?: unknown;
  } | null;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const firstChannel = normalizeFirstChannel(defaults?.channels);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      display_name: defaults?.display_name ?? "",
      bio: defaults?.bio ?? "",
      avatar_url: defaults?.avatar_url ?? "",
      niches_csv: defaults?.niches?.join(", ") ?? "",
      audience_tags_csv: defaults?.audience_tags?.join(", ") ?? "",
      platform: firstChannel?.platform ?? "x",
      handle: firstChannel?.handle ?? "",
      channel_url: firstChannel?.url ?? "https://x.com/",
      followers: firstChannel?.followers ?? 0,
      avg_impressions: firstChannel?.avg_impressions ?? 0,
    },
  });

  async function onSubmit(data: FormData) {
    try {
      const payload = {
        display_name: data.display_name,
        bio: data.bio || undefined,
        avatar_url: data.avatar_url || undefined,
        niches: data.niches_csv
          ?.split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        audience_tags: data.audience_tags_csv
          ?.split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        channels: [
          {
            platform: data.platform,
            handle: data.handle,
            url: data.channel_url,
            followers: data.followers,
            avg_impressions: data.avg_impressions,
          },
        ],
      };

      const res = await fetch("/api/creator/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.formErrors?.join(", ") || json.error || "Save failed");
      }

      toast.success("Profile saved");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save profile");
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600">
        Step {step} of 2
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Display name</label>
              <Input placeholder="Launch-ready AI Curator" {...form.register("display_name")} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Avatar URL (optional)</label>
              <Input placeholder="https://..." {...form.register("avatar_url")} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Bio</label>
            <Textarea placeholder="Describe your angle, audience, and credibility." rows={4} {...form.register("bio")} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-sm font-medium">
                Niches
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-zinc-500 hover:text-zinc-800">
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    Comma-separated themes like ai-devtools, founders, marketing.
                  </TooltipContent>
                </Tooltip>
              </label>
              <Input placeholder="ai-devtools, agentic-coding" {...form.register("niches_csv")} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Audience tags</label>
              <Input placeholder="builders, operators, founders" {...form.register("audience_tags_csv")} />
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
              <label className="mb-1 block text-sm font-medium">Primary platform</label>
              <select
                className="w-full rounded-md border border-zinc-200 bg-white p-2 text-sm"
                {...form.register("platform")}
              >
                <option value="x">X</option>
                <option value="youtube">YouTube</option>
                <option value="linkedin">LinkedIn</option>
                <option value="tiktok">TikTok</option>
                <option value="newsletter">Newsletter</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Handle</label>
              <Input placeholder="yourhandle" {...form.register("handle")} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Profile/channel URL</label>
            <Input placeholder="https://x.com/yourhandle" {...form.register("channel_url")} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Followers</label>
              <Input type="number" {...form.register("followers", { valueAsNumber: true })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Avg impressions per post</label>
              <Input
                type="number"
                {...form.register("avg_impressions", { valueAsNumber: true })}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button type="submit">Save profile</Button>
          </div>
        </div>
      )}
    </form>
  );
}
