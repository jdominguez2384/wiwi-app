"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "../../components/LanguageProvider";
import { sendPasswordResetEmail } from "../../lib/auth";
import { getFriendlyAuthError } from "../../lib/auth-messages";

export default function ForgotPasswordPage() {
  const { language, setLanguage } = useLanguage();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!email) {
      setMessage(
        language === "en"
          ? "Please enter your email."
          : "Por favor ingresa tu correo."
      );
      return;
    }

    setIsSending(true);

    try {
      const { error } = await sendPasswordResetEmail(email);

      if (error) {
        setMessage(getFriendlyAuthError(error.message, language));
        return;
      }

      setMessage(
        language === "en"
          ? "Password reset email sent. Check your inbox."
          : "Correo de restablecimiento enviado. Revisa tu bandeja de entrada."
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl shadow-sky-950/20">
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => setLanguage("en")}
            disabled={isSending}
            className={`rounded-xl border px-4 py-2 text-sm transition ${
              language === "en"
                ? "border-sky-400 bg-sky-500 text-black"
                : "border-zinc-700 bg-zinc-900 text-white hover:border-sky-500/40"
            } disabled:opacity-60`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("es")}
            disabled={isSending}
            className={`rounded-xl border px-4 py-2 text-sm transition ${
              language === "es"
                ? "border-sky-400 bg-sky-500 text-black"
                : "border-zinc-700 bg-zinc-900 text-white hover:border-sky-500/40"
            } disabled:opacity-60`}
          >
            ES
          </button>
        </div>

        <p className="text-sm font-medium tracking-[0.2em] text-sky-400">WIWI</p>
        <h1 className="text-3xl font-semibold mt-2">
          {language === "en" ? "Forgot password" : "Olvidé mi contraseña"}
        </h1>
        <p className="text-zinc-400 mt-3">
          {language === "en"
            ? "Enter the email you signed up with and we’ll send you a reset link."
            : "Ingresa el correo con el que te registraste y te enviaremos un enlace para restablecerla."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSending}
              className="block w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="w-full rounded-xl bg-sky-500 text-black px-4 py-3 font-medium transition hover:bg-sky-400 disabled:opacity-60"
          >
            {isSending
              ? language === "en"
                ? "Sending..."
                : "Enviando..."
              : language === "en"
              ? "Send reset email"
              : "Enviar correo de restablecimiento"}
          </button>
        </form>

        {message ? (
          <p className="text-sm text-zinc-300 mt-4">{message}</p>
        ) : null}

        <p className="text-sm text-zinc-400 mt-6">
          <Link
            href="/login"
            className="underline transition hover:text-sky-300"
          >
            {language === "en" ? "Back to sign in" : "Volver a iniciar sesión"}
          </Link>
        </p>
      </div>
    </main>
  );
}