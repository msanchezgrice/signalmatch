"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  const isCreatorFlow =
    pathname.startsWith("/creators") ||
    pathname.startsWith("/explore/campaigns");
  const onCreatorAuthFlow =
    pathname.startsWith("/creators/sign-up") ||
    pathname.startsWith("/creators/sign-in");

  return (
    <footer className="app-surface border-t">
      <div className="app-subtle-text mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 text-sm md:grid-cols-[minmax(220px,0.8fr)_1.2fr] md:px-8">
        <div className="max-w-sm">
          <Link
            href="/"
            className="app-strong-text inline-flex items-center gap-2.5 font-semibold"
          >
            <Image
              src="/brand/signalmatch-mark.png"
              alt=""
              aria-hidden="true"
              width={32}
              height={32}
              className="size-8"
            />
            SignalMatch
          </Link>
          <p className="mt-3 leading-6">
            {isCreatorFlow
              ? "Creator-friendly partnerships for products you trust."
              : "Performance partnerships for product growth teams."}
          </p>
          <p className="mt-2 text-xs">
            © {new Date().getFullYear()} SignalMatch
          </p>
        </div>
        {!onCreatorAuthFlow ? (
          <nav
            aria-label="Footer navigation"
            className="app-muted-text flex flex-wrap content-start gap-x-5 gap-y-3 md:justify-end"
          >
            <Link href="/resources" className="hover:text-[var(--app-text)]">
              Resources
            </Link>
            <Link href="/about" className="hover:text-[var(--app-text)]">
              About
            </Link>
            <Link href="/privacy" className="hover:text-[var(--app-text)]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[var(--app-text)]">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-[var(--app-text)]">
              Contact
            </Link>
            {isCreatorFlow ? (
              <>
                <Link href="/creators" className="hover:text-[var(--app-text)]">
                  Creator Guide
                </Link>
                <Link
                  href="/creators/success-stories"
                  className="hover:text-[var(--app-text)]"
                >
                  Success Stories
                </Link>
                <Link
                  href="/explore/campaigns"
                  className="hover:text-[var(--app-text)]"
                >
                  Products Shared
                </Link>
                <Link
                  href="/creators/sign-up"
                  className="hover:text-[var(--app-text)]"
                >
                  Create creator account
                </Link>
              </>
            ) : (
              <>
                <Link href="/" className="hover:text-[var(--app-text)]">
                  Home
                </Link>
                <Link href="/builders" className="hover:text-[var(--app-text)]">
                  Builder Guide
                </Link>
                <Link
                  href="/explore/creators"
                  className="hover:text-[var(--app-text)]"
                >
                  Creator Directory
                </Link>
                <Link
                  href="/builders/sign-up"
                  className="hover:text-[var(--app-text)]"
                >
                  Builder signup
                </Link>
              </>
            )}
          </nav>
        ) : null}
      </div>
    </footer>
  );
}
