"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const platforms = [
  { id: "linkedin", label: "LinkedIn", example: "linkedin.com/in/your-profile or @yourname" },
  { id: "x", label: "X (Formerly Twitter)", example: "x.com/yourhandle or @yourhandle" },
] as const;

type Platform = (typeof platforms)[number]["id"];

export function CreatorPersonaDiscovery() {
  const router = useRouter();
  const [platform, setPlatform] = useState<Platform>("linkedin");
  const [profileUrl, setProfileUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);

  const placeholder = useMemo(
    () => platforms.find((item) => item.id === platform)?.example ?? "@yourname",
    [platform],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = profileUrl.trim();

    if (!value) {
      return;
    }

    setIsSubmitting(true);
    setStatusText("Reading your profile...");

    try {
      const res = await fetch("/api/public/creator-profile-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value, platform }),
      });

      const json = await res.json();

      if (!res.ok || !json?.prefill_token) {
        throw new Error(json?.error || "Could not analyze profile");
      }

      router.push("/creators/sign-up");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not analyze profile");
      setStatusText(null);
      setIsSubmitting(false);
    }
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
                disabled={isSubmitting}
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
            inputMode="text"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            disabled={isSubmitting || profileUrl.trim().length === 0}
            className="h-12 min-w-40 rounded-xl"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing
              </span>
            ) : (
              "Analyze profile"
            )}
          </Button>
        </div>

        {statusText ? <p className="text-sm text-zinc-600">{statusText}</p> : null}

        <p className="text-sm text-zinc-500">
          Tip: paste a profile URL, <code>www...</code> link, or just a handle like <code>@yourname</code>.
        </p>
      </form>
    </section>
  );
}
