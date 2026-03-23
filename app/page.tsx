"use client";

import Link from "next/link";
import { useLanguage } from "../components/LanguageProvider";

export default function HomePage() {
  const { language, setLanguage } = useLanguage();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium tracking-[0.2em] text-sky-400">
              WIWI
            </p>
            <p className="text-xs text-zinc-500">
              {language === "en" ? "Was It Worth It?" : "¿Valió la pena?"}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setLanguage("en")}
              className={`rounded-xl border px-4 py-2 text-sm transition ${
                language === "en"
                  ? "border-sky-400 bg-sky-500 text-black"
                  : "border-zinc-700 bg-zinc-900 text-white hover:border-sky-500/40"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("es")}
              className={`rounded-xl border px-4 py-2 text-sm transition ${
                language === "es"
                  ? "border-sky-400 bg-sky-500 text-black"
                  : "border-zinc-700 bg-zinc-900 text-white hover:border-sky-500/40"
              }`}
            >
              ES
            </button>
          </div>
        </header>

        <section className="flex flex-1 items-center py-12">
          <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-sm text-sky-300">
                {language === "en"
                  ? "Gig work, but with the real numbers"
                  : "Trabajo gig, pero con números reales"}
              </div>

              <h1 className="max-w-xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
                {language === "en" ? (
                  <>
                    Know what you
                    <span className="block text-sky-400">actually made.</span>
                  </>
                ) : (
                  <>
                    Mira lo que
                    <span className="block text-sky-400">
                      realmente ganaste.
                    </span>
                  </>
                )}
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
                {language === "en"
                  ? "WIWI helps delivery and rideshare drivers track real hourly pay after miles, gas, and tax set-aside—so you know if a shift was actually worth it."
                  : "WIWI ayuda a conductores de delivery y rideshare a calcular su pago real por hora después de millas, gasolina y separación para impuestos, para saber si un turno realmente valió la pena."}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-6 py-3 text-base font-medium text-black transition hover:bg-sky-400"
                >
                  {language === "en" ? "Start tracking" : "Comenzar"}
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-950 px-6 py-3 text-base font-medium text-white transition hover:border-sky-500/40 hover:text-sky-300"
                >
                  {language === "en" ? "Sign in" : "Iniciar sesión"}
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="text-sm font-medium text-sky-400">
                    {language === "en"
                      ? "Real hourly pay"
                      : "Pago real por hora"}
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">
                    {language === "en"
                      ? "Not just gross earnings."
                      : "No solo ganancias brutas."}
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="text-sm font-medium text-sky-400">
                    {language === "en"
                      ? "After expenses"
                      : "Después de gastos"}
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">
                    {language === "en"
                      ? "Miles, fuel, and taxes included."
                      : "Incluye millas, gasolina e impuestos."}
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="text-sm font-medium text-sky-400">
                    {language === "en"
                      ? "Worth-it check"
                      : "Vale la pena"}
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">
                    {language === "en"
                      ? "See whether a shift made sense."
                      : "Mira si el turno realmente convino."}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:pl-8">
              <div className="rounded-[28px] border border-zinc-800 bg-zinc-950 p-5 shadow-2xl shadow-sky-950/20">
                <div className="rounded-[24px] border border-zinc-800 bg-black p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-sky-400">
                        WIWI
                      </p>
                      <h2 className="mt-2 text-xl font-semibold">
                        {language === "en"
                          ? "Shift summary"
                          : "Resumen del turno"}
                      </h2>
                    </div>
                    <div className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sm text-sky-300">
                      {language === "en" ? "Worth it" : "Valió la pena"}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                      <p className="text-xs text-zinc-500">
                        {language === "en"
                          ? "Gross earnings"
                          : "Ganancia bruta"}
                      </p>
                      <p className="mt-2 text-2xl font-semibold">$126.50</p>
                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                      <p className="text-xs text-zinc-500">
                        {language === "en"
                          ? "Net earnings"
                          : "Ganancia neta"}
                      </p>
                      <p className="mt-2 text-2xl font-semibold">$92.14</p>
                    </div>

                    <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4">
                      <p className="text-xs text-sky-300">
                        {language === "en"
                          ? "Real hourly pay"
                          : "Pago real por hora"}
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-sky-400">
                        $23.04
                      </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                      <p className="text-xs text-zinc-500">
                        {language === "en" ? "Miles driven" : "Millas"}
                      </p>
                      <p className="mt-2 text-2xl font-semibold">41.2</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">
                        {language === "en"
                          ? "Weekly goal progress"
                          : "Progreso de meta semanal"}
                      </span>
                      <span className="font-medium text-sky-400">72%</span>
                    </div>
                    <div className="mt-3 h-3 w-full rounded-full bg-zinc-800">
                      <div className="h-3 w-[72%] rounded-full bg-sky-500" />
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-zinc-500">
                    {language === "en"
                      ? "Track each shift. Know your real pay. Stop guessing."
                      : "Registra cada turno. Mira tu pago real. Deja de adivinar."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}