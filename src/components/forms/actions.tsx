"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/components/providers/analytics-provider";

type ActionButtonProps = {
  label: string;
  action: string;
  payload?: Record<string, unknown>;
  variant?: "default" | "outline" | "destructive";
};

export function ActionButton({
  label,
  action,
  payload,
  variant = "default",
}: ActionButtonProps) {
  const router = useRouter();
  const { capture } = useAnalytics();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      variant={variant}
      size="sm"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          const res = await fetch(action, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload ?? {}),
          });
          const json = await res.json();
          if (!res.ok) {
            throw new Error(json.error || "Action failed");
          }
          toast.success("Done");
          if (json.checkout_url) {
            const campaignId = action.match(/campaigns\/([^/]+)\/fund/)?.[1];
            if (campaignId) {
              capture("checkout_started", { campaignId });
            }
            window.location.href = json.checkout_url as string;
            return;
          }
          if (json.url) {
            if (action.includes("/stripe/connect/")) {
              capture("stripe_connect_started", {});
            }
            window.location.href = json.url as string;
            return;
          }
          if (json.api_key) {
            await navigator.clipboard.writeText(json.api_key as string);
            toast.success("API key copied to clipboard");
          }
          router.refresh();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Action failed");
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? "Working..." : label}
    </Button>
  );
}
