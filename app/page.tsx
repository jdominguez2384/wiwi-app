"use client";

import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Clock,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { useLanguage } from "../components/LanguageProvider";
import { useState } from "react";

export default function HomePage() {
  const { language, setLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.22),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.12),transparent_35%)]" />

      <div className="relative z-10">
        <nav className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 shadow-lg shadow-sky-500/20">
                <span className="text-sm font-black text-white">W</span>
              </div>
              <div className="leading-tight">
                <p className="text-3xl font-black tracking-tight text-white">
                  WIWI
                </p>
                <p className="text-xs text-slate-400">
                  {language === "en" ? "Was It Worth It?" : "¿Valió la pena?"}
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/dashboard"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                {language === "en" ? "Dashboard" : "Panel"}
              </Link>

              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage("en")}
                  className={`rounded-xl border px-4 py-2 text-sm transition ${
                    language === "en"
                      ? "border-sky-400 bg-sky-500 text-black"
                      : "border-slate-700 bg-slate-900 text-white hover:border-sky-500/40"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("es")}
                  className={`rounded-xl border px-4 py-2 text-sm transition ${
                    language === "es"
                      ? "border-sky-400 bg-sky-500 text-black"
                      : "border-slate-700 bg-slate-900 text-white hover:border-sky-500/40"
                  }`}
                >
                  ES
                </button>
              </div>

              <Link
                href="/login"
                className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-sky-400"
              >
                {language === "en" ? "Sign In" : "Entrar"}
              </Link>
            </div>

            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 transition hover:border-sky-500/40 hover:text-white md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {menuOpen ? (
            <div className="border-t border-slate-800/50 bg-slate-950/95 px-4 py-4 md:hidden">
              <div className="flex flex-col gap-3">
                <Link
                  href="/dashboard"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  {language === "en" ? "Dashboard" : "Panel"}
                </Link>

                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage("en")}
                    className={`rounded-xl border px-4 py-2 text-sm transition ${
                      language === "en"
                        ? "border-sky-400 bg-sky-500 text-black"
                        : "border-slate-700 bg-slate-900 text-white"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage("es")}
                    className={`rounded-xl border px-4 py-2 text-sm transition ${
                      language === "es"
                        ? "border-sky-400 bg-sky-500 text-black"
                        : "border-slate-700 bg-slate-900 text-white"
                    }`}
                  >
                    ES
                  </button>
                </div>

                <Link
                  href="/login"
                  className="rounded-xl bg-sky-500 px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-sky-400"
                  onClick={() => setMenuOpen(false)}
                >
                  {language === "en" ? "Sign In" : "Entrar"}
                </Link>
              </div>
            </div>
          ) : null}
        </nav>

        <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(14,165,233,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-60 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2">
                <span className="text-sm font-medium text-sky-400">
                  {language === "en"
                    ? "Track Your True Earnings"
                    : "Calcula tus ganancias reales"}
                </span>
              </div>

              <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                {language === "en" ? (
                  <>
                    Know What You{" "}
                    <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
                      Really Made
                    </span>
                  </>
                ) : (
                  <>
                    Mira Lo Que{" "}
                    <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
                      Realmente Ganaste
                    </span>
                  </>
                )}
              </h1>

              <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-slate-300">
                {language === "en"
                  ? "Calculate your real earnings after gas, taxes, and expenses. See if your gig work shifts are truly worth it."
                  : "Calcula tus ganancias reales después de gasolina, impuestos y gastos. Mira si tus turnos de trabajo gig realmente valieron la pena."}
              </p>

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="rounded-xl bg-sky-500 px-8 py-4 text-lg font-semibold text-black shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
                >
                  {language === "en" ? "Get Started Free" : "Comienza Gratis"}
                </Link>

                <Link
                  href="/login"
                  className="rounded-xl border border-slate-700 px-8 py-4 text-lg font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-white"
                >
                  {language === "en" ? "Sign In" : "Entrar"}
                </Link>
              </div>
            </div>

            <div className="mx-auto mt-20 max-w-5xl">
              <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-sm">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                        <DollarSign className="h-5 w-5 text-emerald-400" />
                      </div>
                      <span className="text-sm text-slate-400">
                        {language === "en" ? "Net Earnings" : "Ganancia Neta"}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-white">$1,847</div>
                    <div className="mt-2 text-sm text-emerald-400">
                      {language === "en" ? "+12% this week" : "+12% esta semana"}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10">
                        <Clock className="h-5 w-5 text-sky-400" />
                      </div>
                      <span className="text-sm text-slate-400">
                        {language === "en"
                          ? "Real Hourly Pay"
                          : "Pago Real por Hora"}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-white">$24.50</div>
                    <div className="mt-2 text-sm text-slate-400">
                      {language === "en"
                        ? "After all expenses"
                        : "Después de todos los gastos"}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                        <TrendingUp className="h-5 w-5 text-purple-400" />
                      </div>
                      <span className="text-sm text-slate-400">
                        {language === "en" ? "This Week" : "Esta Semana"}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-white">32 hrs</div>
                    <div className="mt-2 text-sm text-purple-400">
                      {language === "en"
                        ? "8 shifts completed"
                        : "8 turnos completados"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-900/40 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-white">
                {language === "en"
                  ? "Everything You Need to Track Your Gig Work"
                  : "Todo lo que necesitas para seguir tu trabajo gig"}
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-slate-400">
                {language === "en"
                  ? "Simple, powerful tools to understand your real earnings"
                  : "Herramientas simples y potentes para entender tus ganancias reales"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="group">
                <div className="h-full rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 transition-all hover:border-sky-500/30 hover:bg-slate-800/50">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-sky-500/10 transition-colors group-hover:bg-sky-500/20">
                    <DollarSign className="h-6 w-6 text-sky-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    {language === "en" ? "Real Earnings" : "Ganancias Reales"}
                  </h3>
                  <p className="text-slate-400">
                    {language === "en"
                      ? "Calculate net earnings after gas, taxes, and all expenses automatically."
                      : "Calcula automáticamente tus ganancias netas después de gasolina, impuestos y todos los gastos."}
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="h-full rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 transition-all hover:border-sky-500/30 hover:bg-slate-800/50">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/20">
                    <TrendingUp className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    {language === "en"
                      ? "Smart Analytics"
                      : "Analítica Inteligente"}
                  </h3>
                  <p className="text-slate-400">
                    {language === "en"
                      ? "Track your performance over time and see which shifts are most profitable."
                      : "Sigue tu rendimiento con el tiempo y mira cuáles turnos son más rentables."}
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="h-full rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 transition-all hover:border-sky-500/30 hover:bg-slate-800/50">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 transition-colors group-hover:bg-purple-500/20">
                    <Clock className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    {language === "en"
                      ? "Time Tracking"
                      : "Seguimiento de Tiempo"}
                  </h3>
                  <p className="text-slate-400">
                    {language === "en"
                      ? "See your true hourly rate including all time spent working and driving."
                      : "Mira tu tarifa real por hora incluyendo todo el tiempo trabajando y manejando."}
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="h-full rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 transition-all hover:border-sky-500/30 hover:bg-slate-800/50">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10 transition-colors group-hover:bg-orange-500/20">
                    <Shield className="h-6 w-6 text-orange-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    {language === "en" ? "Tax Ready" : "Listo para Impuestos"}
                  </h3>
                  <p className="text-slate-400">
                    {language === "en"
                      ? "Automatic tax set-aside calculations so you're always prepared."
                      : "Cálculos automáticos para separar impuestos y estar siempre preparado."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-r from-sky-500/10 to-blue-500/10 p-12">
              <h2 className="mb-4 text-4xl font-bold text-white">
                {language === "en"
                  ? "Start Tracking Your Real Earnings Today"
                  : "Empieza a seguir tus ganancias reales hoy"}
              </h2>
              <p className="mb-8 text-xl text-slate-400">
                {language === "en"
                  ? "Join thousands of gig workers who know exactly what they're making."
                  : "Únete a miles de trabajadores gig que saben exactamente cuánto están ganando."}
              </p>
              <Link
                href="/signup"
                className="inline-flex rounded-xl bg-sky-500 px-10 py-4 text-lg font-semibold text-black shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
              >
                {language === "en" ? "Get Started Free" : "Comienza Gratis"}
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-800/50 py-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 lg:flex-row lg:px-8">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-sky-600">
                <span className="text-sm font-bold text-white">W</span>
              </div>
              <span className="text-slate-400">
                © 2026 WIWI. All rights reserved.
              </span>
            </div>

            <div className="flex gap-6 text-slate-400">
              <a href="#" className="transition-colors hover:text-white">
                {language === "en" ? "Privacy" : "Privacidad"}
              </a>
              <a href="#" className="transition-colors hover:text-white">
                {language === "en" ? "Terms" : "Términos"}
              </a>
              <a href="#" className="transition-colors hover:text-white">
                {language === "en" ? "Support" : "Soporte"}
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}