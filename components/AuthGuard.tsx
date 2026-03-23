"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "../lib/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const user = await getCurrentUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setIsChecking(false);
    }

    checkUser();
  }, [router]);

  if (isChecking) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <p className="text-zinc-300">Checking account...</p>
      </main>
    );
  }

  return <>{children}</>;
}