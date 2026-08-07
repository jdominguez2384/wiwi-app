import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete Your Account",
  description: "Delete your WIWI account and associated shift data.",
  alternates: { canonical: "/delete-account" },
};

export default function DeleteAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
