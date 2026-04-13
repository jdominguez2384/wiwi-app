"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  History,
  Home,
  LogOut,
  Plus,
  Settings,
} from "lucide-react";
import type { Language } from "../lib/translations";
import { signOut } from "../lib/auth";
import { cx } from "../lib/ui";

const navItems = [
  {
    href: "/dashboard",
    icon: Home,
    label: { en: "Home", es: "Inicio" },
  },
  {
    href: "/history",
    icon: History,
    label: { en: "History", es: "Historial" },
  },
  {
    href: "/add-shift",
    icon: Plus,
    label: { en: "Add", es: "Agregar" },
  },
  {
    href: "/insights",
    icon: BarChart3,
    label: { en: "Insights", es: "Analisis" },
  },
  {
    href: "/settings",
    icon: Settings,
    label: { en: "Settings", es: "Ajustes" },
  },
];

function isActivePath(pathname: string | null, href: string) {
  if (pathname === href) return true;
  if (href === "/history" && pathname?.startsWith("/edit-shift")) return true;
  return false;
}

export function WiwiAppNav({
  language,
  disabled = false,
}: {
  language: Language;
  disabled?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isSpanish = language === "es";

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <>
      <div className="hidden items-center gap-2 md:flex">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cx(
                "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition",
                isActive
                  ? "border-sky-400 bg-sky-500 text-black"
                  : "border-slate-700 bg-slate-950 text-slate-200 hover:border-sky-500/40 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="max-sm:hidden">{item.label[language]}</span>
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={disabled}
        className="hidden items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 transition hover:border-sky-500/40 hover:text-white disabled:opacity-60 md:inline-flex"
      >
        <LogOut className="h-4 w-4" />
        <span>{isSpanish ? "Salir" : "Sign out"}</span>
      </button>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800/80 bg-slate-950/95 px-2 pb-[calc(0.45rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-18px_60px_rgba(2,6,23,0.65)] backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(pathname, item.href);
            const isAdd = item.href === "/add-shift";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  "flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[0.68rem] font-medium transition",
                  isActive
                    ? "text-sky-200"
                    : "text-slate-500 hover:text-slate-200",
                  isAdd
                    ? isActive
                      ? "bg-sky-500 text-black shadow-lg shadow-sky-500/20"
                      : "bg-sky-500 text-black shadow-lg shadow-sky-500/20 hover:bg-sky-400 hover:text-black"
                    : isActive
                      ? "bg-slate-900"
                      : ""
                )}
              >
                <Icon className={cx("h-5 w-5", isAdd ? "h-6 w-6" : "")} />
                <span className="truncate">{item.label[language]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
