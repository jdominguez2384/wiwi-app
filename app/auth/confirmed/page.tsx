"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, UserPlus2 } from "lucide-react";
import { AuthShell } from "../../../components/AuthShell";
import { useLanguage } from "../../../components/LanguageProvider";

export default function ConfirmedPage() {
  const { language, setLanguage } = useLanguage();
  const isSpanish = language === "es";

  return (
    <AuthShell
      language={language}
      setLanguage={setLanguage}
      eyebrow={isSpanish ? "Correo confirmado" : "Email confirmed"}
      title={
        isSpanish ? (
          <>
            Tu cuenta está lista para descubrir si{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              valió la pena
            </span>
            .
          </>
        ) : (
          <>
            Your account is ready to see if it{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              was worth it
            </span>
            .
          </>
        )
      }
      description={
        isSpanish
          ? "Tu correo ha sido confirmado. Ya puedes entrar a WIWI y empezar a registrar tus turnos."
          : "Your email has been confirmed. You can sign in to WIWI and start logging shifts now."
      }
      sideEyebrow={isSpanish ? "Todo listo" : "All set"}
      sideTitle={
        isSpanish ? (
          <>
            Empieza con una cuenta{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              lista para crecer
            </span>
            .
          </>
        ) : (
          <>
            Start with an account{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              ready to grow
            </span>
            .
          </>
        )
      }
      sideDescription={
        isSpanish
          ? "Tu siguiente paso es entrar, configurar tus números reales y comenzar a entender mejor cada turno."
          : "Your next step is to sign in, set your real-world assumptions, and start understanding each shift more clearly."
      }
      sideActionHref="/login"
      sideActionLabel={isSpanish ? "Entrar a WIWI" : "Sign in to WIWI"}
      footer={
        <div className="space-y-3">
          <p>
            <Link
              href="/login"
              className="font-semibold text-sky-300 transition hover:text-sky-200"
            >
              {isSpanish ? "Ir a iniciar sesión" : "Go to sign in"}
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
      <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/15 text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-200">
              {isSpanish ? "Correo confirmado con éxito" : "Email confirmed successfully"}
            </p>
            <p className="mt-2 text-sm leading-6 text-emerald-100/90">
              {isSpanish
                ? "Tu cuenta ya está verificada. Inicia sesión para empezar a medir tus ganancias reales con WIWI."
                : "Your account is now verified. Sign in to start measuring your real earnings with WIWI."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
        >
          <span>{isSpanish ? "Ir a iniciar sesión" : "Go to sign in"}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        <Link
          href="/signup"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-white"
        >
          <UserPlus2 className="h-4 w-4" />
          <span>
            {isSpanish ? "Crear otra cuenta" : "Create another account"}
          </span>
        </Link>
      </div>
    </AuthShell>
  );
}
