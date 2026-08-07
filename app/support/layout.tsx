import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with your WIWI account, shifts, and calculations.",
  alternates: { canonical: "/support" },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
