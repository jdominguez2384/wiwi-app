"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Globe } from "lucide-react";
import type { Language } from "../lib/translations";
import { cx } from "../lib/ui";

export function WiwiShell({
  language,
  setLanguage,
  children,
  navActions,
  languageDisabled = false,
  contentClassName,
}: {
  language: Language;
  setLanguage: (lang: Language) => void;
  children: ReactNode;
  navActions?: ReactNode;
  languageDisabled?: boolean;
  contentClassName?: string;
}) {
  const isSpanish = language === "es";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(59,130,246,0.12),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-60 [mask-image:radial-gradient(circle_at_top,#000_30%,transparent_80%)]" />

      <div className="relative z-10">
        <nav className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 shadow-lg shadow-sky-500/20">
                <span className="text-base font-black text-white">W</span>
              </div>
              <div className="leading-tight">
                <p className="text-2xl font-black tracking-tight text-white">WIWI</p>
                <p className="text-xs text-slate-400">
                  {isSpanish ? "¿Valió la pena?" : "Was It Worth It?"}
                </p>
              </div>
            </Link>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <div className="hidden items-center gap-2 rounded-full border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-400 sm:inline-flex">
                <Globe className="h-3.5 w-3.5" />
                <span>{isSpanish ? "Idioma" : "Language"}</span>
              </div>

              <button
                type="button"
                onClick={() => setLanguage("en")}
                disabled={languageDisabled}
                className={cx(
                  "rounded-xl border px-4 py-2 text-sm transition disabled:opacity-60",
                  language === "en"
                    ? "border-sky-400 bg-sky-500 text-black"
                    : "border-slate-700 bg-slate-950 text-white hover:border-sky-500/40"
                )}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("es")}
                disabled={languageDisabled}
                className={cx(
                  "rounded-xl border px-4 py-2 text-sm transition disabled:opacity-60",
                  language === "es"
                    ? "border-sky-400 bg-sky-500 text-black"
                    : "border-slate-700 bg-slate-950 text-white hover:border-sky-500/40"
                )}
              >
                ES
              </button>

              {navActions}
            </div>
          </div>
        </nav>

        <div
          className={cx(
            "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8",
            contentClassName
          )}
        >
          {children}
        </div>
      </div>
    </main>
  );
}
