"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  Crown,
  KeyRound,
  LifeBuoy,
  Mail,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useLanguage } from "../../components/LanguageProvider";
import { WiwiShell } from "../../components/WiwiShell";
import { PageHero, Panel } from "../../components/WiwiSurface";

export default function SupportPage() {
  const { language, setLanguage } = useLanguage();
  const isSpanish = language === "es";

  return (
    <WiwiShell language={language} setLanguage={setLanguage}>
      <PageHero
        eyebrowContent={
          <>
            <LifeBuoy className="h-4 w-4 text-sky-300" />
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
              {isSpanish ? "Ayuda WIWI" : "WIWI Support"}
            </span>
          </>
        }
        title={
          <>
            {isSpanish ? "Te ayudamos a volver a tus" : "Let’s get you back to your"}{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              {isSpanish ? "números" : "numbers"}
            </span>
            .
          </>
        }
        description={
          isSpanish
            ? "Encuentra respuestas rápidas o escríbenos para recibir ayuda con tu cuenta, turnos o cálculos."
            : "Find a quick answer or contact us for help with your account, shifts, or calculations."
        }
        actions={
          <>
            <a
              href="mailto:support@getwiwi.com?subject=WIWI%20Support%20Request"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
            >
              <Mail className="h-4 w-4" />
              <span>{isSpanish ? "Escribir a soporte" : "Email support"}</span>
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{isSpanish ? "Volver al inicio" : "Back home"}</span>
            </Link>
          </>
        }
      />

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Panel>
          <KeyRound className="h-6 w-6 text-sky-300" />
          <h2 className="mt-4 text-xl font-black text-white">
            {isSpanish ? "Acceso a la cuenta" : "Account access"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            {isSpanish
              ? "Revisa spam para correos de confirmación. Si olvidaste tu contraseña, solicita un enlace nuevo."
              : "Check spam for confirmation messages. If you forgot your password, request a fresh recovery link."}
          </p>
          <Link
            href="/forgot-password"
            className="mt-5 inline-flex font-semibold text-sky-300 transition hover:text-sky-200"
          >
            {isSpanish ? "Restablecer contraseña" : "Reset password"}
          </Link>
        </Panel>

        <Panel>
          <Crown className="h-6 w-6 text-amber-300" />
          <h2 className="mt-4 text-xl font-black text-white">
            {isSpanish ? "Compras de WIWI Pro" : "WIWI Pro purchases"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            {isSpanish
              ? "Restaura una compra o administra una suscripcion desde WIWI Pro. Los reembolsos y cancelaciones se procesan con Apple o Google."
              : "Restore a purchase or manage a subscription from WIWI Pro. Refunds and cancellations are handled by Apple or Google."}
          </p>
          <Link
            href="/pro"
            className="mt-5 inline-flex font-semibold text-sky-300 transition hover:text-sky-200"
          >
            {isSpanish ? "Abrir WIWI Pro" : "Open WIWI Pro"}
          </Link>
        </Panel>

        <Panel>
          <Calculator className="h-6 w-6 text-emerald-300" />
          <h2 className="mt-4 text-xl font-black text-white">
            {isSpanish ? "Cálculos de turnos" : "Shift calculations"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            {isSpanish
              ? "WIWI estima gasolina, reserva fiscal y gastos ingresados. Los resultados sirven para planificar y no son asesoramiento fiscal."
              : "WIWI estimates fuel, a tax reserve, and expenses you enter. Results are for planning and are not tax advice."}
          </p>
          <Link
            href="/terms"
            className="mt-5 inline-flex font-semibold text-sky-300 transition hover:text-sky-200"
          >
            {isSpanish ? "Leer los términos" : "Read the terms"}
          </Link>
        </Panel>

        <Panel>
          <Trash2 className="h-6 w-6 text-orange-300" />
          <h2 className="mt-4 text-xl font-black text-white">
            {isSpanish ? "Borrar una cuenta" : "Delete an account"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            {isSpanish
              ? "Puedes borrar tu cuenta dentro de Ajustes o usar la página pública si no puedes iniciar sesión."
              : "Delete your account inside Settings, or use the public request page if you cannot sign in."}
          </p>
          <Link
            href="/delete-account"
            className="mt-5 inline-flex font-semibold text-sky-300 transition hover:text-sky-200"
          >
            {isSpanish ? "Opciones de borrado" : "Deletion options"}
          </Link>
        </Panel>
      </div>

      <Panel className="mt-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-sky-300" />
          <div>
            <h2 className="text-lg font-bold text-white">
              {isSpanish ? "Antes de escribirnos" : "Before contacting us"}
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              {isSpanish
                ? "Incluye el correo de tu cuenta y una descripción del problema. Nunca envíes tu contraseña, código de recuperación ni datos completos de pago."
                : "Include your account email and a description of the issue. Never send your password, recovery code, or complete payment information."}
            </p>
            <p className="mt-3 text-sm font-semibold text-white">support@getwiwi.com</p>
          </div>
        </div>
      </Panel>

      <div className="mt-6 flex flex-wrap justify-center gap-5 text-sm text-slate-500">
        <Link href="/privacy" className="transition hover:text-sky-300">
          {isSpanish ? "Privacidad" : "Privacy"}
        </Link>
        <Link href="/terms" className="transition hover:text-sky-300">
          {isSpanish ? "Términos" : "Terms"}
        </Link>
      </div>
    </WiwiShell>
  );
}
