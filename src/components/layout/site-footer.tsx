export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-8 text-sm text-zinc-500 md:px-8">
        <p>© {new Date().getFullYear()} SignalMatch</p>
        <p>Pay for outcomes. Fast creator payouts.</p>
      </div>
    </footer>
  );
}
