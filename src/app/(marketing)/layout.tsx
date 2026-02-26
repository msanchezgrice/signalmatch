"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const useCustomShell = pathname === "/" || pathname === "/creators";

  if (useCustomShell) {
    return <div className="min-h-screen bg-transparent">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-transparent">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
