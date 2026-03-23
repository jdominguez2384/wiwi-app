"use client";

import Link from "next/link";
import { useLanguage } from "../components/LanguageProvider";

export default function HomePage() {
  const { language, setLanguage } = useLanguage();

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-xl">

        {/* Language Toggle */}
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => setLanguage("en")}
            className={`rounded-xl border px-4 py-2 ${
              language === "en" ? "bg-white text-black" : "bg-transparent text-white"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("es")}
            className={`rounded-xl border px-4 py-2 ${
              language === "es" ? "bg-white text-black" : "bg-transparent text-white"
            }`}
          >
            ES
          </button>
        </div>

        {/* Branding */}
        <p className="text-sm text-zinc-400">WIWI</p>

        <h1 className="text-3xl font-semibold mt-2 text-white leading-tight">
          {language === "en"
            ? "Was it worth it?"
            : "¿Valió la pena?"}
        </h1>

        <p className="text-zinc-400 mt-3">
          {language === "en"
            ? "Track your real hourly pay after gas, miles, and taxes."
            : "Calcula tu ganancia real después de gasolina, millas e impuestos."}
        </p>

        {/* Value Props */}
        <div className="mt-6 space-y-2 text-sm text-zinc-400">
          <p>• {language === "en" ? "Real hourly pay" : "Pago real por hora"}</p>
          <p>• {language === "en" ? "After expenses & taxes" : "Después de gastos e impuestos"}</p>
          <p>• {language === "en" ? "Know if a shift was worth it" : "Saber si valió la pena trabajar"}</p>
        </div>

        {/* CTA */}
        <div className="mt-8 space-y-3">
          <Link
            href="/signup"
            className="block w-full rounded-xl bg-white text-black px-4 py-3 text-center font-medium"
          >
            {language === "en" ? "Start tracking" : "Comenzar"}
          </Link>

          <Link
            href="/login"
            className="block w-full rounded-xl border border-zinc-700 text-white px-4 py-3 text-center"
          >
            {language === "en" ? "Sign in" : "Iniciar sesión"}
          </Link>
        </div>
      </div>
    </main>
  );
}