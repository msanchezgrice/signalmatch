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

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-5 text-sm">
            <Link href="/" className="font-semibold">
              SignalMatch
            </Link>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
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
