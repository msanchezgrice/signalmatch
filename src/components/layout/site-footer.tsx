import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p>© {new Date().getFullYear()} SignalMatch</p>
          <p className="mt-1">Performance partnerships for product growth teams.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-zinc-600">
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
        </div>
      </div>
    </footer>
  );
}
