import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WIWI Pro Preview",
  robots: { index: false, follow: false },
};

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return children;
}
