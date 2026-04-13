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
  const isSpanish = language === "es";

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
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
        className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 transition hover:border-sky-500/40 hover:text-white disabled:opacity-60"
      >
        <LogOut className="h-4 w-4" />
        <span className="max-sm:hidden">
          {isSpanish ? "Salir" : "Sign out"}
        </span>
      </button>
    </>
  );
}
