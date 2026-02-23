"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  const isCreatorFlow =
    pathname.startsWith("/creators") || pathname.startsWith("/explore/campaigns");

  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p>© {new Date().getFullYear()} SignalMatch</p>
          <p className="mt-1">
            {isCreatorFlow
              ? "Creator-friendly partnerships for products you trust."
              : "Performance partnerships for product growth teams."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-zinc-600">
          {isCreatorFlow ? (
            <>
              <Link href="/creators" className="hover:text-zinc-900">
                Creator Guide
              </Link>
              <Link href="/creators/success-stories" className="hover:text-zinc-900">
                Success Stories
              </Link>
              <Link href="/explore/campaigns" className="hover:text-zinc-900">
                Products Shared
              </Link>
              <Link href="/creators/sign-up" className="hover:text-zinc-900">
                Create creator account
              </Link>
            </>
          ) : (
            <>
              <Link href="/" className="hover:text-zinc-900">
                Home
              </Link>
              <Link href="/builders" className="hover:text-zinc-900">
                Builder Guide
              </Link>
              <Link href="/explore/creators" className="hover:text-zinc-900">
                Creator Directory
              </Link>
              <Link href="/builders/sign-up" className="hover:text-zinc-900">
                Builder signup
              </Link>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
