"use client";

import { AlertTriangle, RotateCw } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useLanguage } from "./LanguageProvider";
import { useSettings } from "./SettingsProvider";
import { useShifts } from "./ShiftProvider";

const DATA_ROUTES = [
  "/dashboard",
  "/history",
  "/add-shift",
  "/edit-shift",
  "/insights",
  "/settings",
];

export function AppDataNotice() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const { refreshUser } = useAuth();
  const { settingsError, reloadSettings } = useSettings();
  const { shiftsError, reloadShifts } = useShifts();
  const error = shiftsError || settingsError;
  const isDataRoute = DATA_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!error || !isDataRoute) return null;

  async function handleRetry() {
    await refreshUser();
    await Promise.all([reloadSettings(), reloadShifts()]);
  }

  return (
    <div className="fixed inset-x-4 top-4 z-[70] mx-auto flex max-w-2xl items-center gap-3 rounded-2xl border border-orange-400/40 bg-slate-950/95 p-4 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
      <AlertTriangle className="h-5 w-5 shrink-0 text-orange-300" />
      <p className="min-w-0 flex-1 text-sm leading-5 text-slate-200" role="alert">
        {language === "es"
          ? "No pudimos cargar algunos datos. Tus datos guardados no fueron modificados."
          : error}
      </p>
      <button
        type="button"
        onClick={handleRetry}
        className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-white transition hover:border-sky-400"
      >
        <RotateCw className="h-3.5 w-3.5" />
        <span>{language === "es" ? "Reintentar" : "Retry"}</span>
      </button>
    </div>
  );
}
