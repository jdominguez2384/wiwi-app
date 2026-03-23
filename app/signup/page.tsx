"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "../../components/LanguageProvider";
import { signUp } from "../../lib/auth";
import { getFriendlyAuthError } from "../../lib/auth-messages";

export default function SignupPage() {
  const { language, setLanguage } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!name || !email || !password) {
      setMessage(
        language === "en"
          ? "Please fill out all fields."
          : "Por favor completa todos los campos."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signUp(email, password, {
        display_name: name,
        preferred_language: language,
      });

      if (error) {
        setMessage(getFriendlyAuthError(error.message, language));
        return;
      }

      setMessage(
        language === "en"
          ? "Account created. Check your email to confirm your account."
          : "Cuenta creada. Revisa tu correo para confirmar tu cuenta."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => setLanguage("en")}
            disabled={isSubmitting}
            className={`rounded-xl border px-4 py-2 ${
              language === "en" ? "bg-black text-white" : "bg-white"
            } disabled:opacity-60`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("es")}
            disabled={isSubmitting}
            className={`rounded-xl border px-4 py-2 ${
              language === "es" ? "bg-black text-white" : "bg-white"
            } disabled:opacity-60`}
          >
            ES
          </button>
        </div>

        <p className="text-sm text-zinc-500">RealRate</p>
        <h1 className="text-3xl font-semibold mt-2">
          {language === "en" ? "Create account" : "Crear cuenta"}
        </h1>
        <p className="text-zinc-600 mt-3">
          {language === "en"
            ? "Start tracking your real pay after miles, fuel, and taxes."
            : "Empieza a registrar tu pago real después de millas, gasolina e impuestos."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              {language === "en" ? "Name" : "Nombre"}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="block w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3 disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="block w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3 disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              {language === "en" ? "Password" : "Contraseña"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              className="block w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3 disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-black text-white px-4 py-3 disabled:opacity-60"
          >
            {isSubmitting
              ? language === "en"
                ? "Creating account..."
                : "Creando cuenta..."
              : language === "en"
              ? "Create account"
              : "Crear cuenta"}
          </button>
        </form>

        {message ? (
          <p className="text-sm text-zinc-600 mt-4">{message}</p>
        ) : null}

        <p className="text-sm text-zinc-600 mt-6">
          {language === "en" ? "Already have an account?" : "¿Ya tienes una cuenta?"}{" "}
          <Link href="/login" className="font-medium underline">
            {language === "en" ? "Sign in" : "Iniciar sesión"}
          </Link>
        </p>

        <p className="text-sm text-zinc-600 mt-2">
          <Link href="/" className="underline">
            {language === "en" ? "Back to home" : "Volver al inicio"}
          </Link>
        </p>
      </div>
    </main>
  );
}