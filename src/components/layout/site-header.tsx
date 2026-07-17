"use client";

import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const pathname = usePathname();
  const isCreatorFlow =
    pathname.startsWith("/creators") ||
    pathname.startsWith("/explore/campaigns") ||
    pathname.startsWith("/explore/products");
  const onCreatorSignUp = pathname.startsWith("/creators/sign-up");
  const onCreatorSignIn = pathname.startsWith("/creators/sign-in");
  const onCreatorAuthFlow = onCreatorSignUp || onCreatorSignIn;

  return (
    <header className="app-chrome-header sticky top-0 z-50 border-b backdrop-blur">
      <a href="#main-content" className="global-skip-link">
        Skip to content
      </a>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-lg font-semibold tracking-tight"
          >
            <Image
              src="/brand/signalmatch-mark.png"
              alt=""
              aria-hidden="true"
              width={32}
              height={32}
              className="size-8"
              priority
            />
            <span>SignalMatch</span>
          </Link>
          {!onCreatorAuthFlow ? (
            <nav
              aria-label="Primary navigation"
              className="app-muted-text hidden items-center gap-5 text-sm md:flex"
            >
              <Link href="/resources" className="hover:text-[var(--app-text)]">
                Resources
              </Link>
              <Link href="/tools" className="hover:text-[var(--app-text)]">
                Tools
              </Link>
              {isCreatorFlow ? (
                <>
                  <Link
                    href="/creators/success-stories"
                    className="hover:text-[var(--app-text)]"
                  >
                    Success Stories
                  </Link>
                  <Link
                    href="/explore/products"
                    className="hover:text-[var(--app-text)]"
                  >
                    Products
                  </Link>
                  <Link
                    href="/explore/campaigns"
                    className="hover:text-[var(--app-text)]"
                  >
                    Campaigns
                  </Link>
                  <Link
                    href="/creators"
                    className="hover:text-[var(--app-text)]"
                  >
                    How It Works
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/explore/creators"
                    className="hover:text-[var(--app-text)]"
                  >
                    Creator Directory
                  </Link>
                  <Link
                    href="/builders"
                    className="hover:text-[var(--app-text)]"
                  >
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
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="hidden sm:inline-flex"
                  >
                    <Link href="/creators/sign-in">
                      Already have an account? Sign in
                    </Link>
                  </Button>
                ) : null}
                {onCreatorSignIn ? (
                  <Button asChild size="sm">
                    <Link href="/creators/sign-up">Create creator account</Link>
                  </Button>
                ) : null}
              </>
            ) : isCreatorFlow ? (
              <>
                {!onCreatorSignIn ? (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="hidden sm:inline-flex"
                  >
                    <Link href="/creators/sign-in">Creator sign in</Link>
                  </Button>
                ) : null}
                {!onCreatorSignUp ? (
                  <Button asChild size="sm">
                    <Link href="/creators/sign-up">Create creator account</Link>
                  </Button>
                ) : null}
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  <Link href="/builders/sign-in">Builder sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/builders/sign-up">Find creators</Link>
                </Button>
              </>
            )}
          </SignedOut>
          <SignedIn>
            <Button asChild variant="outline" size="sm">
              <Link href="/app">Dashboard</Link>
            </Button>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
