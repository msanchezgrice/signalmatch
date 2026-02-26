"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  const isCreatorFlow =
    pathname.startsWith("/creators") || pathname.startsWith("/explore/campaigns");
  const onCreatorAuthFlow =
    pathname.startsWith("/creators/sign-up") || pathname.startsWith("/creators/sign-in");

  return (
    <footer className="border-t app-surface">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-sm app-subtle-text md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p>© {new Date().getFullYear()} SignalMatch</p>
          <p className="mt-1">
            {isCreatorFlow
              ? "Creator-friendly partnerships for products you trust."
              : "Performance partnerships for product growth teams."}
          </p>
        </div>
        {!onCreatorAuthFlow ? (
          <div className="flex flex-wrap items-center gap-4 app-muted-text">
            {isCreatorFlow ? (
              <>
                <Link href="/creators" className="hover:text-[var(--app-text)]">
                  Creator Guide
                </Link>
                <Link href="/creators/success-stories" className="hover:text-[var(--app-text)]">
                  Success Stories
                </Link>
                <Link href="/explore/campaigns" className="hover:text-[var(--app-text)]">
                  Products Shared
                </Link>
                <Link href="/creators/sign-up" className="hover:text-[var(--app-text)]">
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
                <Link href="/explore/creators" className="hover:text-[var(--app-text)]">
                  Creator Directory
                </Link>
                <Link href="/builders/sign-up" className="hover:text-[var(--app-text)]">
                  Builder signup
                </Link>
              </>
            )}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
