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
  display_name: z.string().min(2),
  bio: z.string().optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
  niches_csv: z.string().optional(),
  audience_tags_csv: z.string().optional(),
  channels_json: z.string().min(2),
});

type FormData = z.infer<typeof schema>;

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
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      display_name: defaults?.display_name ?? "",
      bio: defaults?.bio ?? "",
      avatar_url: defaults?.avatar_url ?? "",
      niches_csv: defaults?.niches?.join(", ") ?? "",
      audience_tags_csv: defaults?.audience_tags?.join(", ") ?? "",
      channels_json: JSON.stringify(
        defaults?.channels ?? [
          {
            platform: "x",
            handle: "",
            url: "https://x.com/",
            followers: 0,
            avg_impressions: 0,
          },
        ],
        null,
        2,
      ),
    },
  });

  async function onSubmit(data: FormData) {
    try {
      const channels = JSON.parse(data.channels_json);
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
        channels,
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
      <div className="grid gap-4 md:grid-cols-2">
        <Input placeholder="Display name" {...form.register("display_name")} />
        <Input placeholder="Avatar URL" {...form.register("avatar_url")} />
      </div>
      <Textarea placeholder="Bio" rows={4} {...form.register("bio")} />
      <Input placeholder="Niches (comma-separated)" {...form.register("niches_csv")} />
      <Input
        placeholder="Audience tags (comma-separated)"
        {...form.register("audience_tags_csv")}
      />
      <div>
        <p className="mb-2 text-sm text-zinc-600">
          Channels JSON: [{"{"}"platform":"x","handle":"...","url":"...","followers":1200,"avg_impressions":500{"}"}]
        </p>
        <Textarea rows={8} className="font-mono text-xs" {...form.register("channels_json")} />
      </div>
      <Button type="submit">Save profile</Button>
    </form>
  );
}
