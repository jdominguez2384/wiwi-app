"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, RotateCcw } from "lucide-react";
import { AuthShell } from "../../components/AuthShell";
import { useLanguage } from "../../components/LanguageProvider";
import { sendPasswordResetEmail } from "../../lib/auth";
import { getFriendlyAuthError } from "../../lib/auth-messages";

export default function ForgotPasswordPage() {
  const { language, setLanguage } = useLanguage();
  const isSpanish = language === "es";
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!email) {
      setMessage(
        isSpanish
          ? "Por favor ingresa tu correo."
          : "Please enter your email."
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
        isSpanish
          ? "Correo de restablecimiento enviado. Revisa tu bandeja de entrada."
          : "Password reset email sent. Check your inbox."
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <AuthShell
      language={language}
      setLanguage={setLanguage}
      disabled={isSending}
      eyebrow={isSpanish ? "Restablecer acceso" : "Reset access"}
      title={
        isSpanish ? (
          <>
            Recupera tu cuenta y vuelve a ver si{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              valió la pena
            </span>
            .
          </>
        ) : (
          <>
            Recover your account and get back to seeing if it{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              was worth it
            </span>
            .
          </>
        )
      }
      description={
        isSpanish
          ? "Ingresa el correo con el que te registraste y te enviaremos un enlace para restablecer tu contraseña."
          : "Enter the email you signed up with and we will send a link to reset your password."
      }
      sideEyebrow={isSpanish ? "Recupera el ritmo" : "Get back in rhythm"}
      sideTitle={
        isSpanish ? (
          <>
            Tu historial de turnos sigue{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              listo para ti
            </span>
            .
          </>
        ) : (
          <>
            Your shift history is still{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              waiting for you
            </span>
            .
          </>
        )
      }
      sideDescription={
        isSpanish
          ? "En unos minutos podrás volver a tu panel para revisar tus mejores turnos, tu meta semanal y tus cálculos reales."
          : "In a few minutes you can be back in your dashboard reviewing your best shifts, weekly goal, and real earnings."
      }
      sideActionHref="/login"
      sideActionLabel={isSpanish ? "Volver a iniciar sesión" : "Back to sign in"}
      footer={
        <div className="space-y-3">
          <p>
            <Link
              href="/login"
              className="font-semibold text-sky-300 transition hover:text-sky-200"
            >
              {isSpanish ? "Volver a iniciar sesión" : "Back to sign in"}
            </Link>
          </p>
          <p>
            <Link
              href="/"
              className="text-slate-500 transition hover:text-sky-300"
            >
              {isSpanish ? "Volver al inicio" : "Back to home"}
            </Link>
          </p>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">Email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSending}
              className="block w-full rounded-2xl border border-slate-700 bg-slate-950 px-12 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500 disabled:opacity-60"
              placeholder={isSpanish ? "tu@correo.com" : "you@example.com"}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 disabled:opacity-60"
        >
          <span>
            {isSending
              ? isSpanish
                ? "Enviando..."
                : "Sending..."
              : isSpanish
                ? "Enviar enlace de restablecimiento"
                : "Send reset link"}
          </span>
          <RotateCcw className="h-4 w-4" />
        </button>
      </form>

      {message ? (
        <div className="mt-4 rounded-2xl border border-sky-500/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
          {message}
        </div>
      ) : null}
    </AuthShell>
  );
}
