import { ArrowRight, BarChart3, Check, CircleDollarSign, Code2, Link2, Search, ShieldCheck, Target, UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ActionButton } from "@/components/forms/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleCreators } from "@/lib/sample-creators";
import { getAuthContext } from "@/server/auth";
import { getCampaignById, getCampaignConversionsForBuilder, getCampaignPartnershipsForBuilder, getCreatorDirectory, getMyCampaignAnalytics } from "@/server/db/read";

type Props = { params: Promise<{ id: string }> };

export default async function BuilderCampaignDetailPage({ params }: Props) {
  const authContext = await getAuthContext();
  if (!authContext) redirect("/");
  if (authContext.role !== "BUILDER") redirect("/app");

  const { id } = await params;
  const campaign = await getCampaignById(id);
  if (!campaign || campaign.owner_user_id !== authContext.userId) notFound();

  const [analytics, partnerships, conversions, creators] = await Promise.all([
    getMyCampaignAnalytics(authContext.userId, id),
    getCampaignPartnershipsForBuilder(authContext.userId, id),
    getCampaignConversionsForBuilder(authContext.userId, id),
    getCreatorDirectory({ limit: 20, offset: 0, verificationStatus: "any" }),
  ]);

  const isFunded = campaign.budget_available_cents > 0;
  const hasInvites = partnerships.length > 0;
  const hasConversions = conversions.length > 0;
  const payout = campaign.cpa_amount_cents / 100;
  const resultLabel = campaign.conversion_type === "signup" ? "approved new account" : "approved qualified result";
  const launchSignals = [
    { label: "Offer defined", done: true },
    { label: "Campaign funded", done: isFunded },
    { label: "Creator invited", done: hasInvites },
    { label: "First result received", done: hasConversions },
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-[var(--app-border-strong)] bg-[#10263a] text-white shadow-[0_24px_80px_rgba(19,56,79,0.12)]">
        <div className="grid gap-7 p-6 md:p-9 lg:grid-cols-[1fr_0.7fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">Performance offer</Badge>
              <Badge className={campaign.status === "active" ? "bg-[#58e0d3] text-[#10263a]" : "bg-amber-300 text-amber-950"}>{campaign.status}</Badge>
            </div>
            <h1 className="mt-5 max-w-3xl text-3xl leading-tight font-semibold tracking-tight md:text-4xl">{campaign.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">{campaign.brief || "Add a creator-facing brief before inviting partners."}</p>
            <div className="mt-6 inline-flex max-w-full items-center gap-3 rounded-2xl border border-white/12 bg-white/7 px-4 py-3 text-sm">
              <Target className="size-5 shrink-0 text-[#58e0d3]" />
              <span>Pay <strong>${payout.toFixed(0)}</strong> for each {resultLabel}.</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/12 bg-white/6 p-5">
            <p className="font-mono text-[11px] tracking-[0.16em] text-white/55 uppercase">Launch readiness</p>
            <div className="mt-4 space-y-3">
              {launchSignals.map((signal, index) => (
                <div key={signal.label} className="flex items-center gap-3 text-sm">
                  <span className={`grid size-7 place-items-center rounded-full border font-mono text-[10px] ${signal.done ? "border-[#58e0d3] bg-[#58e0d3] text-[#10263a]" : "border-white/20 text-white/50"}`}>
                    {signal.done ? <Check className="size-3.5" /> : index + 1}
                  </span>
                  <span className={signal.done ? "text-white" : "text-white/55"}>{signal.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="app-surface">
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><CircleDollarSign className="size-5 text-[#087f77]" />1. Fund the creator budget</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><p className="text-3xl font-semibold">${(campaign.budget_available_cents / 100).toFixed(2)}</p><p className="app-muted-text mt-1 text-sm">available for approved creator results</p></div>
            <p className="app-muted-text text-sm leading-6">Funding activates this offer. At ${payout.toFixed(0)} per result, $100 covers up to {Math.max(1, Math.floor(100 / Math.max(1, payout)))} approved results.</p>
            <div className="flex flex-wrap gap-2">
              {[50, 100, 250].map((amount) => <ActionButton key={amount} label={`Add $${amount}`} action={`/api/builder/campaigns/${id}/fund`} payload={{ amount_cents: amount * 100 }} useIdempotencyKey variant={amount === 100 ? "default" : "outline"} />)}
            </div>
            <p className="app-subtle-text text-xs">Stripe opens a secure checkout. Unused budget remains attached to this campaign.</p>
          </CardContent>
        </Card>

        <Card className="app-surface">
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><UsersRound className="size-5 text-[#087f77]" />2. Choose creators</CardTitle></CardHeader>
          <CardContent>
            {creators.creators.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {creators.creators.slice(0, 6).map((creator) => (
                  <div key={creator.creator_profile_id} className="space-y-3 rounded-2xl border border-[var(--app-border)] bg-white/60 p-4">
                    <div className="flex items-center gap-3">
                      <Image src={creator.avatar_url ?? `https://api.dicebear.com/9.x/shapes/svg?seed=${creator.creator_profile_id}`} alt="" width={42} height={42} unoptimized className="size-11 rounded-xl object-cover" />
                      <div className="min-w-0"><p className="truncate font-semibold">{creator.display_name}</p><p className="app-subtle-text truncate text-xs">{creator.niches.slice(0, 2).join(" · ") || "Creator"}</p></div>
                    </div>
                    <ActionButton label="Invite to this offer" action={`/api/builder/campaigns/${id}/invite`} payload={{ creator_user_id: creator.user_id, terms_snapshot: { cpa_amount_cents: campaign.cpa_amount_cents, conversion_type: campaign.conversion_type } }} variant="outline" />
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p className="app-muted-text text-sm leading-6">The live creator directory is still growing. Preview fictional sample matches to learn what to compare, or invite a creator you already know.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {sampleCreators.slice(0, 3).map((creator) => (
                    <div key={creator.id} className="rounded-2xl border border-[var(--app-border)] bg-white/60 p-3">
                      <div className="flex items-center gap-2"><Image src={creator.avatarUrl} alt="" width={36} height={36} unoptimized className="size-9 rounded-xl bg-[#e8fbf8]" /><div className="min-w-0"><p className="truncate text-sm font-semibold">{creator.name}</p><p className="app-subtle-text text-[11px]">Sample · {creator.matchScore}% match</p></div></div>
                      <p className="app-muted-text mt-3 text-xs leading-5">{creator.reasons[0]}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild><Link href="/app/builder/creators"><Search className="size-4" />Explore creator matches</Link></Button>
                  <Button asChild variant="outline"><a href="mailto:?subject=Join%20my%20SignalMatch%20creator%20campaign&body=I%27d%20like%20to%20invite%20you%20to%20a%20performance%20creator%20campaign.%20Create%20your%20profile%20at%20https%3A%2F%2Fwww.signalmatch.me%2Fcreators%2Fsign-up">Invite someone I know</a></Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Link visits", value: analytics?.clicks ?? 0, icon: Link2 },
          { label: "Approved results", value: analytics?.approved_conversions ?? 0, icon: Check },
          { label: "Waiting for review", value: analytics?.pending_conversions ?? 0, icon: ShieldCheck },
          { label: "Creator earnings paid", value: `$${((Number(analytics?.total_paid_out_cents) || 0) / 100).toFixed(2)}`, icon: BarChart3 },
        ].map((metric) => <Card key={metric.label} className="app-surface"><CardContent className="p-5"><metric.icon className="size-4 text-[#087f77]" /><p className="mt-4 text-2xl font-semibold">{metric.value}</p><p className="app-muted-text mt-1 text-xs">{metric.label}</p></CardContent></Card>)}
      </section>

      <Card className="app-surface">
        <CardHeader><CardTitle className="flex items-center gap-2"><Code2 className="size-5 text-[#7257ff]" />3. Connect result tracking</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
            <div>
              <h3 className="font-semibold">What happens behind the scenes</h3>
              <ol className="app-muted-text mt-3 space-y-3 text-sm leading-6">
                <li><strong className="app-strong-text">1.</strong> An accepted creator receives a unique SignalMatch link.</li>
                <li><strong className="app-strong-text">2.</strong> Their visitor lands on your product with the creator reference attached.</li>
                <li><strong className="app-strong-text">3.</strong> Your server tells SignalMatch when the visitor completes the approved result.</li>
                <li><strong className="app-strong-text">4.</strong> You review it, and the creator earns ${payout.toFixed(0)} from this campaign budget.</li>
              </ol>
            </div>
            <details className="rounded-2xl border border-[#7257ff]/15 bg-[#7257ff]/5 p-4 text-sm">
              <summary className="cursor-pointer font-semibold text-[#5440bd]">Advanced developer setup</summary>
              <p className="app-muted-text mt-3 leading-5">Create the private server key from the Products page. Your server sends the creator reference, result type, and a stable event ID to <code className="font-mono">POST /api/conversions</code>.</p>
              <Button asChild variant="outline" size="sm" className="mt-4"><Link href="/app/builder/products">Open product tracking setup<ArrowRight className="size-4" /></Link></Button>
            </details>
          </div>
        </CardContent>
      </Card>

      <Card className="app-surface">
        <CardHeader><CardTitle>Creator relationships</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {partnerships.length === 0 ? <p className="app-muted-text rounded-2xl border border-dashed border-[var(--app-border-strong)] p-6 text-center">No invitations yet. Fund the offer, then choose a creator above.</p> : partnerships.map((partnership: any) => <div key={partnership.id} className="flex flex-col gap-2 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between"><span>{partnership.display_name || "Creator"} · {partnership.status}</span><code className="overflow-x-auto rounded-lg bg-[var(--app-muted-surface)] px-2 py-1 font-mono text-xs">/r/{partnership.ref_code}</code></div>)}
        </CardContent>
      </Card>

      <Card className="app-surface">
        <CardHeader><CardTitle>Results</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {conversions.length === 0 ? <p className="app-muted-text rounded-2xl border border-dashed border-[var(--app-border-strong)] p-6 text-center">No results yet. They appear here after an invited creator’s visitor completes your chosen outcome.</p> : conversions.map((conversion: any) => <div key={conversion.id} className="flex flex-col gap-2 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between"><span>{conversion.event_type} · {conversion.status} · {conversion.ref_code}</span>{conversion.status === "pending" ? <ActionButton label="Approve result" action={`/api/builder/conversions/${conversion.id}/approve`} variant="outline" /> : null}</div>)}
        </CardContent>
      </Card>
    </div>
  );
}
