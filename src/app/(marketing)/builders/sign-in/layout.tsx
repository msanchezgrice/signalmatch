import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Builder sign in | SignalMatch",
  robots: { index: false, follow: false },
};

export default function BuilderSignInLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
