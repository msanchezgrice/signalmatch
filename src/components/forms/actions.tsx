"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type ActionButtonProps = {
  label: string;
  action: string;
  payload?: Record<string, unknown>;
  variant?: "default" | "outline" | "destructive";
};

export function ActionButton({ label, action, payload, variant = "default" }: ActionButtonProps) {
  const router = useRouter();
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
            window.location.href = json.checkout_url as string;
            return;
          }
          if (json.url) {
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
