import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            SignalMatch
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-zinc-600 md:flex">
            <Link href="/builders" className="hover:text-zinc-900">
              Builders
            </Link>
            <Link href="/creators" className="hover:text-zinc-900">
              Creators
            </Link>
            <Link href="/explore/creators" className="hover:text-zinc-900">
              Explore Creators
            </Link>
            <Link href="/explore/campaigns" className="hover:text-zinc-900">
              Explore Campaigns
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">Get started</Button>
            </SignUpButton>
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
