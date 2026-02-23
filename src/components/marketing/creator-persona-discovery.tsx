"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const platforms = [
  { id: "linkedin", label: "LinkedIn", example: "https://www.linkedin.com/in/your-profile" },
  { id: "x", label: "X (Formerly Twitter)", example: "https://x.com/yourhandle" },
] as const;

type Platform = (typeof platforms)[number]["id"];

export function CreatorPersonaDiscovery() {
  const router = useRouter();
  const [platform, setPlatform] = useState<Platform>("linkedin");
  const [profileUrl, setProfileUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const placeholder = useMemo(
    () => platforms.find((item) => item.id === platform)?.example ?? "https://",
    [platform],
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = profileUrl.trim();

    if (!value) {
      return;
    }

    const query = new URLSearchParams({
      source_platform: platform,
      source_profile: value,
    });

    setIsSubmitting(true);
    router.push(`/creators/sign-up?${query.toString()}`);
  }

  return (
    <section className="rounded-3xl border border-zinc-200 bg-zinc-50/80 p-6 md:p-8">
      <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
        Find your niche, get started
      </h2>
      <p className="mt-3 max-w-3xl text-zinc-600">
        Drop your LinkedIn or X profile and we will tailor campaign ideas you can genuinely promote.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          {platforms.map((item) => {
            const isActive = platform === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPlatform(item.id)}
                className={`rounded-2xl border px-4 py-3 text-center text-base font-medium transition ${
                  isActive
                    ? "border-blue-400 bg-blue-50 text-blue-700"
                    : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <Input
            value={profileUrl}
            onChange={(event) => setProfileUrl(event.target.value)}
            placeholder={placeholder}
            className="h-12 rounded-xl border-zinc-200 bg-white text-base"
            inputMode="url"
          />
          <Button
            type="submit"
            disabled={isSubmitting || profileUrl.trim().length === 0}
            className="h-12 min-w-40 rounded-xl"
          >
            {isSubmitting ? "Analyzing" : "Analyze profile"}
          </Button>
        </div>

        <p className="text-sm text-zinc-500">
          Tip: paste a full profile URL (including <code>https://</code>) for best results.
        </p>
      </form>
    </section>
  );
}
