import type { Metadata } from "next";

import { getMarketingMetadata } from "@/lib/marketing-metadata";

export const metadata: Metadata = getMarketingMetadata("/creators");

export default function CreatorsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
