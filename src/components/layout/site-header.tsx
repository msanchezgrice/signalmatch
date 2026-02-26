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
  const onCreatorAuthFlow = onCreatorSignUp || onCreatorSignIn;

  return (
    <header className="sticky top-0 z-50 border-b app-chrome-header backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            SignalMatch
          </Link>
          {!onCreatorAuthFlow ? (
            <nav className="hidden items-center gap-5 text-sm app-muted-text md:flex">
              {isCreatorFlow ? (
                <>
                  <Link href="/creators/success-stories" className="hover:text-[var(--app-text)]">
                    Success Stories
                  </Link>
                  <Link href="/explore/campaigns" className="hover:text-[var(--app-text)]">
                    Products Shared
                  </Link>
                  <Link href="/creators" className="hover:text-[var(--app-text)]">
                    How It Works
                  </Link>
                </>
              ) : (
                <>
                <Link href="/explore/creators" className="hover:text-[var(--app-text)]">
                  Creator Directory
                </Link>
                <Link href="/builders" className="hover:text-[var(--app-text)]">
                  How It Works
                </Link>
                </>
              )}
            </nav>
          ) : null}
        </div>
        <div className="flex items-center gap-2.5">
          <SignedOut>
            {onCreatorAuthFlow ? (
              <>
                {onCreatorSignUp ? (
                  <Link href="/creators/sign-in">
                    <Button variant="outline" size="sm">
                      Already have an account? Sign in
                    </Button>
                  </Link>
                ) : null}
                {onCreatorSignIn ? (
                  <Link href="/creators/sign-up">
                    <Button size="sm">Create creator account</Button>
                  </Link>
                ) : null}
              </>
            ) : isCreatorFlow ? (
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
