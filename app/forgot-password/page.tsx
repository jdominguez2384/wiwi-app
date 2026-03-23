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
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => setLanguage("en")}
            disabled={isSending}
            className={`rounded-xl border px-4 py-2 ${
              language === "en" ? "bg-black text-white" : "bg-white"
            } disabled:opacity-60`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("es")}
            disabled={isSending}
            className={`rounded-xl border px-4 py-2 ${
              language === "es" ? "bg-black text-white" : "bg-white"
            } disabled:opacity-60`}
          >
            ES
          </button>
        </div>

        <p className="text-sm text-zinc-500">RealRate</p>
        <h1 className="text-3xl font-semibold mt-2">
          {language === "en" ? "Forgot password" : "Olvidé mi contraseña"}
        </h1>
        <p className="text-zinc-600 mt-3">
          {language === "en"
            ? "Enter the email you signed up with and we’ll send you a reset link."
            : "Ingresa el correo con el que te registraste y te enviaremos un enlace para restablecerla."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSending}
              className="block w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3 disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="w-full rounded-xl bg-black text-white px-4 py-3 disabled:opacity-60"
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
          <p className="text-sm text-zinc-600 mt-4">{message}</p>
        ) : null}

        <p className="text-sm text-zinc-600 mt-6">
          <Link href="/login" className="underline">
            {language === "en" ? "Back to sign in" : "Volver a iniciar sesión"}
          </Link>
        </p>
      </div>
    </main>
  );
}