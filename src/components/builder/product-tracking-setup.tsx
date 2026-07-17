"use client";

import { Check, Clipboard, KeyRound, RotateCw, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function ProductTrackingSetup({ productId, hasKey }: { productId: string; hasKey: boolean }) {
  const [loading, setLoading] = useState(false);
  const [confirmRotate, setConfirmRotate] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  async function createKey() {
    setLoading(true);
    try {
      const response = await fetch(`/api/builder/products/${productId}/api-key`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Could not create tracking key");
      setGeneratedKey(json.api_key as string);
      setConfirmRotate(false);
      toast.success(hasKey ? "Server key rotated" : "Server key created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create tracking key");
    } finally {
      setLoading(false);
    }
  }

  if (generatedKey) {
    return (
      <div className="rounded-2xl border border-[#07988d]/25 bg-[#e8fbf8] p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-[#0b5f59]"><Check className="size-4" />Save this private server key now</p>
        <p className="mt-2 text-xs leading-5 text-[#214e4a]">It is shown once. Store it in your server’s environment variables—never in frontend or browser code.</p>
        <code className="mt-3 block overflow-x-auto rounded-xl bg-[#10263a] p-3 font-mono text-xs text-[#a9fff5]">{generatedKey}</code>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            size="sm"
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(generatedKey);
              toast.success("Server key copied");
            }}
          >
            <Clipboard className="size-4" />Copy key
          </Button>
          <Button size="sm" type="button" variant="outline" onClick={() => setGeneratedKey(null)}>I saved it</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-muted-surface)] p-4">
        <p className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="size-4 text-[#087f77]" />How results reach SignalMatch</p>
        <p className="app-muted-text mt-2 text-xs leading-5">Your server sends a secure notification after a referred visitor completes the result you defined. This private key proves the notification came from your product.</p>
        <details className="mt-3 text-xs">
          <summary className="cursor-pointer font-semibold">Advanced developer details</summary>
          <div className="app-muted-text mt-2 space-y-2 leading-5">
            <p>Use the key in the <code className="font-mono">Authorization: Bearer</code> header when calling <code className="font-mono">POST /api/conversions</code>.</p>
            <p>Each notification also includes the creator referral code and a stable event ID so retries do not create duplicate payouts.</p>
          </div>
        </details>
      </div>

      {confirmRotate ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-semibold">Rotating disables the current server key immediately.</p>
          <p className="mt-1 text-xs leading-5 text-amber-800">Update your production server with the new key before sending more results.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" type="button" variant="destructive" onClick={createKey} disabled={loading}><RotateCw className="size-4" />{loading ? "Rotating…" : "Rotate and show new key"}</Button>
            <Button size="sm" type="button" variant="outline" onClick={() => setConfirmRotate(false)}><X className="size-4" />Cancel</Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={loading}
          onClick={() => (hasKey ? setConfirmRotate(true) : createKey())}
        >
          {hasKey ? <RotateCw className="size-4" /> : <KeyRound className="size-4" />}
          {loading ? "Creating…" : hasKey ? "Rotate private server key" : "Create private server key"}
        </Button>
      )}
    </div>
  );
}
