"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Globe,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { Language } from "../lib/translations";
import { cx } from "../lib/ui";

type AuthShellProps = {
  language: Language;
  setLanguage: (lang: Language) => void;
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  sideEyebrow?: string;
  sideTitle?: ReactNode;
  sideDescription?: ReactNode;
  sideActionHref?: string;
  sideActionLabel?: string;
  disabled?: boolean;
};

export function AuthShell({
  language,
  setLanguage,
  eyebrow,
  title,
  description,
  children,
  footer,
  sideEyebrow,
  sideTitle,
  sideDescription,
  sideActionHref,
  sideActionLabel,
  disabled = false,
}: AuthShellProps) {
  const isSpanish = language === "es";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.2),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.14),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-60 [mask-image:radial-gradient(circle_at_top,#000_30%,transparent_80%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-[calc(1.25rem+env(safe-area-inset-top))] sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-slate-800/70 bg-slate-950/65 px-4 py-4 backdrop-blur-xl sm:gap-4 sm:px-6">
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

          <div className="flex flex-wrap items-center justify-end gap-2 max-sm:w-full max-sm:justify-start">
            <div className="hidden items-center gap-2 rounded-full border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-400 sm:inline-flex">
              <Globe className="h-3.5 w-3.5" />
              <span>{isSpanish ? "Idioma" : "Language"}</span>
            </div>

            <button
              type="button"
              onClick={() => setLanguage("en")}
              disabled={disabled}
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
              disabled={disabled}
              className={cx(
                "rounded-xl border px-4 py-2 text-sm transition disabled:opacity-60",
                language === "es"
                  ? "border-sky-400 bg-sky-500 text-black"
                  : "border-slate-700 bg-slate-950 text-white hover:border-sky-500/40"
              )}
            >
              ES
            </button>
          </div>
        </header>

        <div className="grid flex-1 gap-6 py-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-center lg:py-8">
          <section className="order-2 flex flex-col justify-center lg:order-1 lg:pr-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2">
              <Sparkles className="h-4 w-4 text-sky-300" />
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
                {sideEyebrow ||
                  (isSpanish ? "Pago real, claro" : "Clear real pay")}
              </span>
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              {sideTitle ||
                (isSpanish ? (
                  <>
                    Mira si tu turno{" "}
                    <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                      valió la pena
                    </span>
                    .
                  </>
                ) : (
                  <>
                    See whether the shift{" "}
                    <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                      was worth it
                    </span>
                    .
                  </>
                ))}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              {sideDescription ||
                (isSpanish
                  ? "WIWI convierte millas, gasolina, impuestos y tiempo en una sola respuesta clara para que tomes mejores decisiones antes de tu próximo turno."
                  : "WIWI turns miles, fuel, taxes, and time into one clear answer so you can make better decisions before your next shift.")}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[26px] border border-slate-800/80 bg-slate-950/70 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.35)] backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/10 text-emerald-300">
                  <Wallet className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm text-slate-400">
                  {isSpanish ? "Pago real por hora" : "Real hourly pay"}
                </p>
                <p className="mt-2 text-2xl font-black tracking-tight text-white">
                  $23.40
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {isSpanish
                    ? "Después de gasolina e impuestos."
                    : "After fuel and taxes."}
                </p>
              </div>

              <div className="rounded-[26px] border border-slate-800/80 bg-slate-950/70 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.35)] backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-500/10 text-sky-300">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm text-slate-400">
                  {isSpanish ? "Meta semanal" : "Weekly target"}
                </p>
                <p className="mt-2 text-2xl font-black tracking-tight text-white">
                  86%
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {isSpanish
                    ? "Progreso visible en cada turno."
                    : "Visible progress on every shift."}
                </p>
              </div>

              <div className="rounded-[26px] border border-slate-800/80 bg-slate-950/70 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.35)] backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-400/30 bg-purple-500/10 text-purple-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm text-slate-400">
                  {isSpanish ? "Listo para manejar" : "Built for drivers"}
                </p>
                <p className="mt-2 text-2xl font-black tracking-tight text-white">
                  10+
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {isSpanish
                    ? "Apps compatibles desde el inicio."
                    : "Gig apps supported from day one."}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-[28px] border border-slate-800/80 bg-slate-950/60 p-6 backdrop-blur-sm">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                {isSpanish ? "Por qué WIWI" : "Why WIWI"}
              </p>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-4 text-sm text-slate-300">
                  {isSpanish
                    ? "Sigue DoorDash, Uber, Lyft, Instacart y más desde una sola app."
                    : "Track DoorDash, Uber, Lyft, Instacart, and more from one place."}
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-4 text-sm text-slate-300">
                  {isSpanish
                    ? "Guarda tus supuestos de gasolina, MPG e impuestos para cálculos consistentes."
                    : "Save your gas, MPG, and tax assumptions for consistent calculations."}
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-4 text-sm text-slate-300">
                  {isSpanish
                    ? "Mantén una vista clara de tus mejores turnos y tu meta semanal."
                    : "Keep a clear view of your best shifts and weekly goal."}
                </div>
              </div>

              {sideActionHref && sideActionLabel ? (
                <Link
                  href={sideActionHref}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
                >
                  <span>{sideActionLabel}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </section>

          <section className="order-1 lg:order-2">
            <div className="rounded-[32px] border border-slate-800/80 bg-slate-950/75 p-6 shadow-[0_32px_120px_rgba(2,6,23,0.5)] backdrop-blur-sm sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
                  {eyebrow}
                </span>
              </div>

              <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
                {title}
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-300">{description}</p>

              <div className="mt-8">{children}</div>

              {footer ? <div className="mt-8 text-sm text-slate-400">{footer}</div> : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
