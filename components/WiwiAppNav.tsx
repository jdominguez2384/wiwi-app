"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  History,
  Home,
  LogOut,
  Menu,
  Plus,
  Settings,
  X,
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
    href: "/insights",
    icon: BarChart3,
    label: { en: "Insights", es: "Analisis" },
  },
  {
    href: "/add-shift",
    icon: Plus,
    label: { en: "Add", es: "Agregar" },
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
  const [menuOpen, setMenuOpen] = useState(false);
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

      <div className="relative md:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-500/40 hover:text-white"
          aria-expanded={menuOpen}
          aria-label={isSpanish ? "Abrir menu" : "Open menu"}
        >
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span>{isSpanish ? "Menu" : "Menu"}</span>
        </button>

        {menuOpen ? (
          <div className="absolute right-0 top-12 z-50 w-72 rounded-3xl border border-slate-800 bg-slate-950/95 p-3 shadow-[0_24px_80px_rgba(2,6,23,0.65)] backdrop-blur-xl">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cx(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                      isActive
                        ? "bg-sky-500 text-black"
                        : "text-slate-200 hover:bg-slate-900 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label[language]}</span>
                  </Link>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={disabled}
              className="mt-2 flex w-full items-center gap-3 rounded-2xl border border-slate-800 px-4 py-3 text-sm text-slate-200 transition hover:border-sky-500/40 hover:text-white disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
              <span>{isSpanish ? "Salir" : "Sign out"}</span>
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
