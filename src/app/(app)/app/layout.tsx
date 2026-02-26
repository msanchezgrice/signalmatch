import Link from "next/link";
import { redirect } from "next/navigation";

import { UserButton } from "@clerk/nextjs";

import { getAuthContext } from "@/server/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const authContext = await getAuthContext();

  if (!authContext) {
    redirect("/");
  }

  const navLinks =
    authContext.role === "BUILDER"
      ? [
          { href: "/app/builder/start", label: "Overview" },
          { href: "/app/builder/products", label: "Products" },
          { href: "/app/builder/campaigns", label: "Campaigns" },
        ]
      : authContext.role === "CREATOR"
        ? [
            { href: "/app/creator/start", label: "Overview" },
            { href: "/app/creator/profile", label: "Profile" },
            { href: "/app/creator/partnerships", label: "Partnerships" },
            { href: "/app/creator/deals", label: "Deals" },
            { href: "/app/creator/payouts", label: "Payouts" },
          ]
        : [{ href: "/app/onboarding", label: "Get Started" }];

  const roleThemeClass =
    authContext.role === "BUILDER"
      ? "app-theme-builder"
      : authContext.role === "CREATOR"
        ? "app-theme-creator"
        : "app-theme-neutral";

  const roleBadge =
    authContext.role === "BUILDER"
      ? "Builder"
      : authContext.role === "CREATOR"
        ? "Creator"
        : "Onboarding";

  return (
    <div className={`app-shell ${roleThemeClass} min-h-screen`}>
      <header className="app-chrome-header">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-5 text-sm">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight app-strong-text">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground">
                SM
              </span>
              <span>SignalMatch</span>
            </Link>
            <span className="rounded-full border px-2 py-0.5 text-xs app-subtle-text">
              {roleBadge}
            </span>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="app-nav-link">
                {link.label}
              </Link>
            ))}
          </div>
          <UserButton />
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">{children}</main>
    </div>
  );
}
