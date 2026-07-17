"use client";

import {
  ArrowRight,
  BarChart3,
  Check,
  CircleDollarSign,
  PackageCheck,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/components/providers/analytics-provider";

type GoalId = "qualified-signup" | "paid-customer" | "booked-demo" | "purchase";

const goals: Array<{
  id: GoalId;
  title: string;
  description: string;
  example: string;
}> = [
  {
    id: "qualified-signup",
    title: "Qualified signups",
    description: "Reward creators when a referred person creates a real account.",
    example: "Example: $8 for each approved signup",
  },
  {
    id: "paid-customer",
    title: "Paid customers",
    description: "Reward creators after a referred account becomes a paying customer.",
    example: "Example: $40 for each new subscriber",
  },
  {
    id: "booked-demo",
    title: "Booked demos",
    description: "Reward creators for qualified prospects who schedule with your team.",
    example: "Example: $25 for each qualified demo",
  },
  {
    id: "purchase",
    title: "Purchases",
    description: "Reward creators when their audience completes an eligible purchase.",
    example: "Example: 15% or $20 per first order",
  },
];

const storageKey = "signalmatch-builder-ftue-v2";

export function BuilderLaunchGuide({
  hasProducts,
  hasCampaigns,
  productCount,
  campaignCount,
  hasTrackingKey,
  hasFundedCampaign,
  hasCreatorInvite,
  hasConversion,
}: {
  hasProducts: boolean;
  hasCampaigns: boolean;
  productCount: number;
  campaignCount: number;
  hasTrackingKey: boolean;
  hasFundedCampaign: boolean;
  hasCreatorInvite: boolean;
  hasConversion: boolean;
}) {
  const { capture } = useAnalytics();
  const [screen, setScreen] = useState<0 | 1 | 2 | 3>(0);
  const [goal, setGoal] = useState<GoalId>("paid-customer");

  useEffect(() => {
    if (!window.sessionStorage.getItem("signalmatch-builder-ftue-started")) {
      capture("ftue_started", { audience: "builder" });
      window.sessionStorage.setItem("signalmatch-builder-ftue-started", "1");
    }
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;

    let restoreTimer: number | undefined;
    try {
      const parsed = JSON.parse(saved) as { goal?: GoalId; completed?: boolean };
      restoreTimer = window.setTimeout(() => {
        if (parsed.goal && goals.some((item) => item.id === parsed.goal)) {
          setGoal(parsed.goal);
        }
        if (parsed.completed) {
          setScreen(3);
        }
      }, 0);
    } catch {
      window.localStorage.removeItem(storageKey);
    }

    return () => {
      if (restoreTimer !== undefined) window.clearTimeout(restoreTimer);
    };
  }, [capture]);

  const selectedGoal = useMemo(
    () => goals.find((item) => item.id === goal) ?? goals[1],
    [goal],
  );

  const nextHref = !hasProducts
    ? "/app/builder/products/new"
    : !hasCampaigns
      ? `/app/builder/campaigns/new?goal=${goal}`
      : !hasFundedCampaign
        ? "/app/builder/campaigns"
        : !hasCreatorInvite
          ? "/app/builder/creators"
          : !hasTrackingKey
            ? "/app/builder/products"
            : "/app/builder/campaigns";

  const nextLabel = !hasProducts
    ? "Add your product"
    : !hasCampaigns
      ? "Build your first offer"
      : !hasFundedCampaign
        ? "Fund your campaign"
        : !hasCreatorInvite
          ? "Find matching creators"
          : !hasTrackingKey
            ? "Connect result tracking"
            : "Review campaign activity";

  function finishWelcome() {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ goal, completed: true }),
    );
    capture("ftue_completed", { audience: "builder", goal });
    setScreen(3);
  }

  if (screen < 3) {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-[var(--app-border-strong)] bg-[var(--app-surface)] shadow-[0_24px_80px_rgba(19,56,79,0.12)]">
        <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="relative overflow-hidden bg-[#10263a] p-7 text-white md:p-10">
            <div className="absolute -top-20 -right-16 size-64 rounded-full bg-[#7257ff]/35 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 size-72 rounded-full bg-[#08a89b]/35 blur-3xl" />
            <div className="relative">
              <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">
                Welcome to SignalMatch
              </Badge>
              <h1 className="mt-5 text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
                Turn creator attention into a result you can measure.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
                You choose the result and payout. SignalMatch helps you find creators,
                issue trackable links, review results, and pay only for approved outcomes.
              </p>

              <ol className="mt-10 space-y-5 text-sm">
                {[
                  ["1", "Choose the business result"],
                  ["2", "Understand the campaign journey"],
                  ["3", "Start your personalized launch plan"],
                ].map(([number, label], index) => (
                  <li
                    key={number}
                    className={`flex items-center gap-3 ${screen === index ? "text-white" : "text-white/50"}`}
                  >
                    <span
                      className={`grid size-8 place-items-center rounded-full border font-mono text-xs ${
                        screen === index
                          ? "border-[#58e0d3] bg-[#58e0d3] text-[#10263a]"
                          : "border-white/20"
                      }`}
                    >
                      {screen > index ? <Check className="size-4" /> : number}
                    </span>
                    {label}
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <section className="p-6 md:p-10">
            {screen === 0 ? (
              <div>
                <p className="font-mono text-xs font-semibold tracking-[0.18em] text-[#087f77] uppercase">
                  First, choose your goal
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                  What should creators help you drive?
                </h2>
                <p className="app-muted-text mt-2 text-sm leading-6">
                  This becomes the result you pay for. You can change it before launch.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {goals.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setGoal(item.id);
                        capture("goal_selected", { goal: item.id });
                      }}
                      className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-[#07988d] ${
                        goal === item.id
                          ? "border-[#07988d] bg-[#e8fbf8] shadow-[0_8px_24px_rgba(7,152,141,0.12)]"
                          : "border-[var(--app-border)] bg-white/70"
                      }`}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-semibold">{item.title}</span>
                        <span
                          className={`grid size-5 place-items-center rounded-full border ${
                            goal === item.id
                              ? "border-[#07988d] bg-[#07988d] text-white"
                              : "border-[var(--app-border-strong)]"
                          }`}
                        >
                          {goal === item.id ? <Check className="size-3" /> : null}
                        </span>
                      </span>
                      <span className="app-muted-text mt-2 block text-sm leading-5">
                        {item.description}
                      </span>
                      <span className="mt-3 block font-mono text-[11px] text-[#087f77]">
                        {item.example}
                      </span>
                    </button>
                  ))}
                </div>
                <Button className="mt-6" type="button" onClick={() => setScreen(1)}>
                  Continue with {selectedGoal.title.toLowerCase()}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            ) : null}

            {screen === 1 ? (
              <div>
                <p className="font-mono text-xs font-semibold tracking-[0.18em] text-[#087f77] uppercase">
                  The whole journey
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                  Here is what happens after you start.
                </h2>
                <div className="mt-7 space-y-4">
                  {[
                    {
                      icon: PackageCheck,
                      title: "Add the product creators will promote",
                      copy: "We scan your site to draft the positioning and ideal audience.",
                    },
                    {
                      icon: Target,
                      title: `Define an approved ${selectedGoal.title.toLowerCase()}`,
                      copy: "Set what qualifies, how much it is worth, and whether you review it manually.",
                    },
                    {
                      icon: UsersRound,
                      title: "Choose creators with audience fit",
                      copy: "Review match reasons, audience signals, and suggested payout ranges before inviting.",
                    },
                    {
                      icon: BarChart3,
                      title: "Track, review, and pay",
                      copy: "Each creator gets a unique link. Approved results draw from your funded campaign budget.",
                    },
                  ].map((item, index) => (
                    <div key={item.title} className="flex gap-4 rounded-2xl border border-[var(--app-border)] bg-white/65 p-4">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e8fbf8] text-[#087f77]">
                        <item.icon className="size-5" />
                      </span>
                      <div>
                        <p className="font-semibold">
                          <span className="mr-2 font-mono text-xs text-[#087f77]">0{index + 1}</span>
                          {item.title}
                        </p>
                        <p className="app-muted-text mt-1 text-sm leading-5">{item.copy}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setScreen(0)}>
                    Back
                  </Button>
                  <Button type="button" onClick={() => setScreen(2)}>
                    Show my launch plan
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            ) : null}

            {screen === 2 ? (
              <div>
                <span className="grid size-12 place-items-center rounded-2xl bg-[#7257ff]/10 text-[#7257ff]">
                  <Sparkles className="size-6" />
                </span>
                <p className="mt-6 font-mono text-xs font-semibold tracking-[0.18em] text-[#087f77] uppercase">
                  Your launch plan is ready
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                  Start with {nextLabel.toLowerCase()}.
                </h2>
                <p className="app-muted-text mt-3 max-w-xl text-sm leading-6">
                  Your goal is <strong className="app-strong-text">{selectedGoal.title.toLowerCase()}</strong>.
                  We will carry that context into campaign setup and keep technical tracking details out of the way until they are needed.
                </p>
                <div className="mt-7 rounded-2xl border border-[#07988d]/25 bg-[#e8fbf8] p-5">
                  <p className="text-sm font-semibold text-[#0b5f59]">What you control</p>
                  <div className="mt-3 grid gap-3 text-sm text-[#214e4a] sm:grid-cols-3">
                    <span className="flex items-center gap-2"><Target className="size-4" /> Result</span>
                    <span className="flex items-center gap-2"><CircleDollarSign className="size-4" /> Payout</span>
                    <span className="flex items-center gap-2"><ShieldCheck className="size-4" /> Approval</span>
                  </div>
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button type="button" onClick={finishWelcome}>
                    Open my workspace
                    <ArrowRight className="size-4" />
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setScreen(1)}>
                    Back
                  </Button>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    );
  }

  const steps = [
    {
      title: "Product story",
      copy: hasProducts ? `${productCount} product${productCount === 1 ? "" : "s"} ready` : "Add the product creators will promote",
      done: hasProducts,
      href: hasProducts ? "/app/builder/products" : "/app/builder/products/new",
    },
    {
      title: "Performance offer",
      copy: hasCampaigns ? `${campaignCount} campaign${campaignCount === 1 ? "" : "s"} created` : `Define an approved ${selectedGoal.title.toLowerCase()}`,
      done: hasCampaigns,
      href: hasCampaigns ? "/app/builder/campaigns" : `/app/builder/campaigns/new?goal=${goal}`,
    },
    {
      title: "Funded campaign",
      copy: "Add the budget used for approved creator results",
      done: hasFundedCampaign,
      href: "/app/builder/campaigns",
    },
    {
      title: "Creator shortlist",
      copy: "Compare example matches, then search or invite creators",
      done: hasCreatorInvite,
      href: "/app/builder/creators",
    },
    {
      title: "Tracking test",
      copy: hasTrackingKey ? "Server key created; verify the first result" : "Create a private server key, then verify one result",
      done: hasConversion,
      href: hasTrackingKey ? "/app/builder/campaigns" : "/app/builder/products",
    },
  ];

  const completed = steps.filter((item) => item.done).length;
  const progress = Math.max(12, (completed / steps.length) * 100);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-[var(--app-border-strong)] bg-[#10263a] text-white shadow-[0_24px_80px_rgba(19,56,79,0.13)]">
        <div className="grid gap-8 p-6 md:p-9 lg:grid-cols-[1fr_0.75fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">Builder launch workspace</Badge>
              <button type="button" onClick={() => setScreen(0)} className="text-xs text-white/60 underline-offset-4 hover:text-white hover:underline">
                Change goal
              </button>
            </div>
            <h1 className="mt-5 max-w-2xl text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
              Launch a creator offer for {selectedGoal.title.toLowerCase()}.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
              Complete each launch signal in order. SignalMatch handles creator-specific links and attribution after your offer is ready.
            </p>
            <Button asChild className="mt-6 bg-[#58e0d3] text-[#10263a] hover:bg-[#79eadf]">
              <Link href={nextHref}>
                {nextLabel}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="rounded-2xl border border-white/12 bg-white/6 p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] tracking-[0.16em] text-white/55 uppercase">Campaign readiness</p>
                <p className="mt-2 text-3xl font-semibold">{Math.round(progress)}%</p>
              </div>
              <span className="text-xs text-white/55">{completed} of {steps.length} signals complete</span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[#58e0d3] transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-4 text-xs leading-5 text-white/60">
              You can save drafts at every step. Creators cannot be paid until you fund and launch a campaign.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-3xl border app-surface p-5 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-semibold tracking-[0.16em] text-[#087f77] uppercase">Your launch path</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">Do the next useful thing</h2>
            </div>
            <Search className="size-5 text-[#087f77]" />
          </div>
          <div className="mt-5 divide-y divide-[var(--app-border)]">
            {steps.map((item, index) => (
              <Link key={item.title} href={item.href} className="group flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                <span className={`grid size-9 shrink-0 place-items-center rounded-full border font-mono text-xs ${item.done ? "border-[#07988d] bg-[#07988d] text-white" : "border-[var(--app-border-strong)] bg-white"}`}>
                  {item.done ? <Check className="size-4" /> : index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{item.title}</span>
                  <span className="app-muted-text mt-1 block text-sm">{item.copy}</span>
                </span>
                <ArrowRight className="app-subtle-text mt-2 size-4 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl border app-surface p-5 md:p-6">
          <span className="grid size-10 place-items-center rounded-xl bg-[#7257ff]/10 text-[#7257ff]"><ShieldCheck className="size-5" /></span>
          <h2 className="mt-4 text-lg font-semibold">How SignalMatch knows a creator drove a result</h2>
          <p className="app-muted-text mt-3 text-sm leading-6">
            Each creator gets a unique referral link. When their visitor completes your chosen result, your website securely tells SignalMatch. You review the result, then the approved payout is added to the creator’s earnings.
          </p>
          <details className="mt-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-muted-surface)] p-4 text-sm">
            <summary className="cursor-pointer font-semibold">Advanced developer setup</summary>
            <p className="app-muted-text mt-3 leading-5">
              The private server API key authenticates those result notifications. Keep it on your server—never in browser code. Setup instructions and a test event appear after you create a campaign.
            </p>
          </details>
        </aside>
      </section>
    </div>
  );
}
