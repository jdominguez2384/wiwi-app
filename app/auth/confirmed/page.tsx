"use client";

import Link from "next/link";
import { useLanguage } from "../../../components/LanguageProvider";

export default function ConfirmedPage() {
  const { language, setLanguage } = useLanguage();

  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => setLanguage("en")}
            className={`rounded-xl border px-4 py-2 ${
              language === "en" ? "bg-black text-white" : "bg-white"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("es")}
            className={`rounded-xl border px-4 py-2 ${
              language === "es" ? "bg-black text-white" : "bg-white"
            }`}
          >
            ES
          </button>
        </div>

        <p className="text-sm text-zinc-500">WIWI</p>

        <h1 className="text-3xl font-semibold mt-2">
          {language === "en"
            ? "Email confirmed"
            : "Correo confirmado"}
        </h1>

        <p className="text-zinc-600 mt-3">
          {language === "en"
            ? "Your email has been confirmed. You can sign in now."
            : "Tu correo ha sido confirmado. Ya puedes iniciar sesión."}
        </p>

        <div className="mt-6 space-y-3">
          <Link
            href="/login"
            className="block w-full rounded-xl bg-black text-white px-4 py-3 text-center"
          >
            {language === "en" ? "Go to sign in" : "Ir a iniciar sesión"}
          </Link>

          <Link
            href="/signup"
            className="block w-full rounded-xl border border-zinc-300 px-4 py-3 text-center"
          >
            {language === "en"
              ? "Create another account"
              : "Crear otra cuenta"}
          </Link>
        </div>
      </div>
    </main>
  );
}