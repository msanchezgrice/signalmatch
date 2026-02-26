"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Info,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Role = "CREATOR" | "BUILDER";

const roleMeta: Record<
  Role,
  {
    title: string;
    subtitle: string;
    checklist: string[];
    destination: string;
  }
> = {
  BUILDER: {
    title: "Builder workspace",
    subtitle: "Launch campaigns and pay for approved outcomes only.",
    checklist: [
      "Create product records and conversion API keys",
      "Invite creators with clear CPA terms",
      "Approve conversions and control budget in one place",
    ],
    destination: "/app/builder/start",
  },
  CREATOR: {
    title: "Creator workspace",
    subtitle: "Accept partnerships and monetize trusted recommendations.",
    checklist: [
      "Set up a profile with niche and channel stats",
      "Accept invites and share unique referral links",
      "Track payouts and connect Stripe for fast settlement",
    ],
    destination: "/app/creator/onboarding",
  },
};

export function RoleForm({
  currentRole,
  preferredRole,
  creatorPrefillQueryToken,
  hasCreatorPrefill,
}: {
  currentRole?: string | null;
  preferredRole?: "CREATOR" | "BUILDER" | null;
  creatorPrefillQueryToken?: string | null;
  hasCreatorPrefill?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(
    (currentRole as Role | null) ?? preferredRole ?? null,
  );

  async function submitRole(role: Role) {
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

      const destination =
        role === "CREATOR" && creatorPrefillQueryToken
          ? `/app/creator/onboarding?prefill=${encodeURIComponent(creatorPrefillQueryToken)}`
          : role === "CREATOR" && hasCreatorPrefill
            ? "/app/creator/onboarding"
          : roleMeta[role].destination;

      toast.success("Workspace configured");
      router.push(destination);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save role");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-xs app-subtle-text">
        <Compass className="h-4 w-4" />
        <span>Step 1 of 2: Choose workspace</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(Object.keys(roleMeta) as Role[]).map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setSelectedRole(role)}
            className={`rounded-2xl border p-6 text-left transition ${
              selectedRole === role
                ? "border-primary bg-primary/10"
                : "app-surface hover:border-[var(--app-border-strong)]"
            }`}
            disabled={loading}
          >
            <p className="text-sm font-medium uppercase tracking-wide app-subtle-text">
              {role === "BUILDER" ? "Builder" : "Creator"}
            </p>
            <h3 className="mt-2 text-lg font-semibold">{roleMeta[role].title}</h3>
            <p className="mt-2 text-sm app-muted-text">{roleMeta[role].subtitle}</p>
          </button>
        ))}
      </div>

      {selectedRole ? (
        <div className="rounded-2xl border app-surface p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold app-strong-text">
              Step 2 of 2: Confirm {selectedRole === "BUILDER" ? "builder" : "creator"} workspace
            </p>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="rounded p-1 app-subtle-text hover:text-[var(--app-text)]">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                Each account uses a single workspace path to keep navigation and actions focused.
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="space-y-2">
            {roleMeta[selectedRole].checklist.map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm app-muted-text">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              type="button"
              disabled={loading}
              onClick={() => submitRole(selectedRole)}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Continue to workspace
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="flex items-center gap-2 text-xs app-subtle-text">
              <Sparkles className="h-3.5 w-3.5" />
              You can create another account if you want to operate the other side.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
