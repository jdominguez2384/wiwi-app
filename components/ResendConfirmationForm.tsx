"use client";

import { useEffect, useState } from "react";
import { resendConfirmationEmail } from "../lib/auth";
import { getFriendlyAuthError } from "../lib/auth-messages";
import { useLanguage } from "./LanguageProvider";

export function ResendConfirmationForm({ initialEmail = "" }: { initialEmail?: string }) {
  const { language } = useLanguage();
  const isSpanish = language === "es";
  const [email, setEmail] = useState(initialEmail);
  const [isSending, setIsSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!cooldown) return;
    const timer = window.setTimeout(() => setCooldown((remaining) => remaining - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  async function handleResend(event: React.FormEvent) {
    event.preventDefault();
    if (isSending || cooldown) return;
    setIsSending(true);
    setSent(false);
    setError(null);
    try {
      const { error: resendError } = await resendConfirmationEmail(email);
      if (resendError) {
        setError(resendError);
      } else {
        setSent(true);
        setCooldown(60);
      }
    } catch (resendError) {
      setError(resendError);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form onSubmit={handleResend} className="mt-5 space-y-3 rounded-2xl border border-slate-700 p-4">
      <label className="block text-sm font-medium text-slate-200">
        {isSpanish ? "Correo de tu cuenta" : "Your account email"}
        <input
          type="email"
          name="confirmation-email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isSending}
          className="mt-2 block w-full min-w-0 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500"
        />
      </label>
      <button
        type="submit"
        disabled={isSending || cooldown > 0}
        className="w-full rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/20 disabled:opacity-60"
      >
        {isSending
          ? isSpanish ? "Enviando..." : "Sending..."
          : cooldown
            ? isSpanish ? `Reenviar en ${cooldown} s` : `Resend in ${cooldown}s`
            : isSpanish ? "Reenviar correo de confirmación" : "Resend confirmation email"}
      </button>
      {sent && (
        <p role="status" className="text-sm leading-6 text-sky-100">
          {isSpanish
            ? "Si esta cuenta está pendiente de confirmación, enviaremos otro correo. Revisa tu bandeja de entrada y spam, y abre solo el mensaje más reciente. Si ya confirmaste tu correo, inicia sesión."
            : "If this account is awaiting confirmation, we will send another email. Check your inbox and spam, and open only the newest message. If you already confirmed your email, sign in."}
        </p>
      )}
      {error !== null && <p role="alert" className="text-sm leading-6 text-rose-200">{getFriendlyAuthError(error, language)}</p>}
    </form>
  );
}
