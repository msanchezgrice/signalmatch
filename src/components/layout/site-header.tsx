"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const pathname = usePathname();
  const isCreatorFlow =
    pathname.startsWith("/creators") || pathname.startsWith("/explore/campaigns");
  const onCreatorSignUp = pathname.startsWith("/creators/sign-up");
  const onCreatorSignIn = pathname.startsWith("/creators/sign-in");

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            SignalMatch
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-zinc-600 md:flex">
            {isCreatorFlow ? (
              <>
                <Link href="/creators/success-stories" className="hover:text-zinc-900">
                  Success Stories
                </Link>
                <Link href="/explore/campaigns" className="hover:text-zinc-900">
                  Products Shared
                </Link>
                <Link href="/creators" className="hover:text-zinc-900">
                  How It Works
                </Link>
              </>
            ) : (
              <>
              <Link href="/explore/creators" className="hover:text-zinc-900">
                Creator Directory
              </Link>
              <Link href="/builders" className="hover:text-zinc-900">
                How It Works
              </Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2.5">
          <SignedOut>
            {isCreatorFlow ? (
              <>
                {!onCreatorSignIn ? (
                  <Link href="/creators/sign-in">
                    <Button variant="outline" size="sm">
                      Creator sign in
                    </Button>
                  </Link>
                ) : null}
                {!onCreatorSignUp ? (
                  <Link href="/creators/sign-up">
                    <Button size="sm">Create creator account</Button>
                  </Link>
                ) : null}
              </>
            ) : (
              <>
                <Link href="/builders/sign-in">
                  <Button variant="outline" size="sm">
                    Builder sign in
                  </Button>
                </Link>
                <Link href="/builders/sign-up">
                  <Button size="sm">Find creators</Button>
                </Link>
              </>
            )}
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
