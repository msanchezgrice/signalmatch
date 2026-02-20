"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function RoleForm({ currentRole }: { currentRole?: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submitRole(role: "CREATOR" | "BUILDER") {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to save role");
      }

      toast.success("Role updated");
      router.push(role === "CREATOR" ? "/app/creator/profile" : "/app/builder/campaigns");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save role");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => submitRole("BUILDER")}
          className={`rounded-2xl border p-6 text-left transition ${
            currentRole === "BUILDER" ? "border-primary bg-primary/10" : "border-zinc-200 bg-white"
          }`}
          disabled={loading}
        >
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">Builder</p>
          <h3 className="mt-2 text-lg font-semibold">Launch CPA campaigns</h3>
          <p className="mt-2 text-sm text-zinc-600">Create products, fund budget, invite creators, and track results.</p>
        </button>

        <button
          type="button"
          onClick={() => submitRole("CREATOR")}
          className={`rounded-2xl border p-6 text-left transition ${
            currentRole === "CREATOR" ? "border-primary bg-primary/10" : "border-zinc-200 bg-white"
          }`}
          disabled={loading}
        >
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">Creator</p>
          <h3 className="mt-2 text-lg font-semibold">Earn per qualified signup</h3>
          <p className="mt-2 text-sm text-zinc-600">Set your niche profile, accept deals, share links, and get paid fast.</p>
        </button>
      </div>
      <Button type="button" variant="outline" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Choose a role above"}
      </Button>
    </div>
  );
}
