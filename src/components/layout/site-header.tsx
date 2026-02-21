import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            SignalMatch
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-zinc-600 md:flex">
            <Link href="/explore/creators" className="hover:text-zinc-900">
              Creator Directory
            </Link>
            <Link href="/builders" className="hover:text-zinc-900">
              How It Works
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2.5">
          <SignedOut>
            <Link href="/builders/sign-in">
              <Button variant="outline" size="sm">
                Builder sign in
              </Button>
            </Link>
            <Link href="/builders/sign-up">
              <Button size="sm">Find creators</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/app">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
