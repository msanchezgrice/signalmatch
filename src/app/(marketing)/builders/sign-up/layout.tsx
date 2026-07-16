import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a builder account | SignalMatch",
  robots: { index: false, follow: false },
};

export default function BuilderSignUpLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
