"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useLanguage } from "./LanguageProvider";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { language } = useLanguage();
  const { user, isLoadingUser, authError, refreshUser } = useAuth();

  useEffect(() => {
    if (!isLoadingUser && !user && !authError) {
      router.replace("/login");
    }
  }, [authError, isLoadingUser, router, user]);

  if (authError) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-orange-400/30 bg-slate-950/90 p-6 text-center shadow-2xl shadow-slate-950/50">
          <AlertTriangle className="mx-auto h-7 w-7 text-orange-300" />
          <h1 className="mt-4 text-xl font-bold text-white">
            {language === "es"
              ? "No pudimos verificar tu sesion"
              : "We could not verify your session"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {language === "es"
              ? "Revisa tu conexion e intentalo de nuevo. Tus datos guardados no fueron modificados."
              : "Check your connection and try again. Your saved data was not changed."}
          </p>
          <button
            type="button"
            onClick={() => void refreshUser()}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-sky-400"
          >
            <RotateCw className="h-4 w-4" />
            <span>{language === "es" ? "Reintentar" : "Retry"}</span>
          </button>
        </div>
      </main>
    );
  }

  if (isLoadingUser || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <p className="text-zinc-300">Checking account...</p>
      </main>
    );
  }

  return <>{children}</>;
}
