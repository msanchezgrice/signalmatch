"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/components/providers/analytics-provider";

type ActionButtonProps = {
  label: string;
  action: string;
  payload?: Record<string, unknown>;
  variant?: "default" | "outline" | "destructive";
  useIdempotencyKey?: boolean;
};

export function ActionButton({
  label,
  action,
  payload,
  variant = "default",
  useIdempotencyKey = false,
}: ActionButtonProps) {
  const router = useRouter();
  const { capture } = useAnalytics();
  const [loading, setLoading] = useState(false);
  const idempotencyKeyRef = useRef<string | null>(null);

  return (
    <Button
      variant={variant}
      size="sm"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          if (useIdempotencyKey && !idempotencyKeyRef.current) {
            idempotencyKeyRef.current = crypto.randomUUID();
          }

          const res = await fetch(action, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...(payload ?? {}),
              ...(idempotencyKeyRef.current
                ? { idempotency_key: idempotencyKeyRef.current }
                : {}),
            }),
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
