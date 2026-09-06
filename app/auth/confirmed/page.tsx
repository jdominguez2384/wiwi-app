"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { AuthShell } from "../../../components/AuthShell";
import { useLanguage } from "../../../components/LanguageProvider";
import { ResendConfirmationForm } from "../../../components/ResendConfirmationForm";
import { checkEmailConfirmation, type EmailConfirmationResult } from "../../../lib/emailConfirmation";
import { getFriendlyAuthError } from "../../../lib/auth-messages";
import { supabase } from "../../../lib/supabase/client";

export default function ConfirmedPage() {
  const { language, setLanguage } = useLanguage();
  const isSpanish = language === "es";
  const [result, setResult] = useState<EmailConfirmationResult | null>(null);
  const verification = useRef<Promise<EmailConfirmationResult> | null>(null);

  useEffect(() => {
    let active = true;
    verification.current ??= checkEmailConfirmation(supabase.auth, window.location.href);
    void verification.current.then((nextResult) => {
      if (!active) return;
      window.history.replaceState(window.history.state, "", window.location.pathname);
      setResult(nextResult);
    });
    return () => { active = false; };
  }, []);

  const confirmed = result?.status === "confirmed";
  const title = !result
    ? isSpanish ? "Comprobando tu confirmación..." : "Checking your confirmation..."
    : confirmed
      ? isSpanish ? "Tu correo está confirmado" : "Your email is confirmed"
      : isSpanish ? "Confirma tu correo" : "Confirm your email";
  const description = !result
    ? isSpanish ? "Espera mientras verificamos tu cuenta." : "Please wait while we verify your account."
    : confirmed
      ? isSpanish
        ? "Ya puedes usar WIWI. Continúa aquí o vuelve a la app en tu teléfono e inicia sesión con el mismo correo y contraseña."
        : "You can now use WIWI. Continue here, or return to the app on your phone and sign in with the same email and password."
      : result.status === "error"
        ? getFriendlyAuthError(result.error, language)
        : isSpanish
          ? "Abre el enlace del correo de confirmación más reciente. Si ya lo usaste, intenta iniciar sesión. También puedes solicitar otro correo abajo."
          : "Open the link in your newest confirmation email. If you already used it, try signing in. You can also request another email below.";

  return (
    <AuthShell
      language={language}
      setLanguage={setLanguage}
      eyebrow={isSpanish ? "Confirmación de correo" : "Email confirmation"}
      title={title}
      description={description}
      footer={<Link href="/support" className="font-semibold text-sky-300 hover:text-sky-200">{isSpanish ? "Obtener ayuda" : "Get help"}</Link>}
    >
      <div role={result?.status === "error" ? "alert" : "status"} aria-live="polite" className={`flex items-center gap-3 rounded-2xl border p-4 ${confirmed ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200" : "border-sky-500/20 bg-sky-500/10 text-sky-100"}`}>
        {confirmed ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <Mail className="h-5 w-5 shrink-0" />}
        <span className="text-sm font-semibold">{title}</span>
      </div>
      {result && (
        <>
          <Link
            href={confirmed ? "/dashboard" : "/login"}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
          >
            {confirmed ? isSpanish ? "Continuar a WIWI" : "Continue to WIWI" : isSpanish ? "Ir a iniciar sesión" : "Go to sign in"}
            <ArrowRight className="h-4 w-4" />
          </Link>
          {!confirmed && <ResendConfirmationForm />}
        </>
      )}
    </AuthShell>
  );
}
