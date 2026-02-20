import Link from "next/link";
import { redirect } from "next/navigation";

import { UserButton } from "@clerk/nextjs";

import { getAuthContext } from "@/server/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const authContext = await getAuthContext();

  if (!authContext) {
    redirect("/");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-5 text-sm">
            <Link href="/" className="font-semibold">
              SignalMatch
            </Link>
            <Link href="/app">Home</Link>
            <Link href="/app/onboarding">Role</Link>
            <Link href="/app/builder/campaigns">Builder</Link>
            <Link href="/app/creator/partnerships">Creator</Link>
            <Link href="/app/admin">Admin</Link>
          </div>
          <UserButton />
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">{children}</main>
    </div>
  );
}
