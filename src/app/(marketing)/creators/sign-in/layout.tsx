import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creator sign in | SignalMatch",
  robots: { index: false, follow: false },
};

export default function CreatorSignInLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
