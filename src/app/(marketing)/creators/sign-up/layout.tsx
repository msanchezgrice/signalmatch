import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a creator account | SignalMatch",
  robots: { index: false, follow: false },
};

export default function CreatorSignUpLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
