"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  LogIn,
  Mail,
  Settings,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useLanguage } from "../../components/LanguageProvider";
import { WiwiShell } from "../../components/WiwiShell";
import { PageHero, Panel } from "../../components/WiwiSurface";

export default function DeleteAccountPage() {
  const { language, setLanguage } = useLanguage();
  const isSpanish = language === "es";

  const steps = isSpanish
    ? [
        { icon: LogIn, title: "Inicia sesión", body: "Entra a WIWI con la cuenta que quieres borrar." },
        { icon: Settings, title: "Abre Ajustes", body: "Busca la sección Zona de riesgo y selecciona Borrar mi cuenta." },
        { icon: CheckCircle2, title: "Confirma", body: "Escribe DELETE y confirma. Esta acción no se puede deshacer." },
      ]
    : [
        { icon: LogIn, title: "Sign in", body: "Sign in to WIWI with the account you want to delete." },
        { icon: Settings, title: "Open Settings", body: "Find the Danger zone and select Delete my account." },
        { icon: CheckCircle2, title: "Confirm", body: "Type DELETE and confirm. This action cannot be undone." },
      ];

  return (
    <WiwiShell language={language} setLanguage={setLanguage}>
      <PageHero
        eyebrowContent={
          <>
            <Trash2 className="h-4 w-4 text-orange-300" />
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-200">
              {isSpanish ? "Borrado de cuenta" : "Account deletion"}
            </span>
          </>
        }
        title={
          <>
            {isSpanish ? "Tú controlas tus" : "You control your"}{" "}
            <span className="bg-gradient-to-r from-orange-300 to-rose-400 bg-clip-text text-transparent">
              {isSpanish ? "datos" : "data"}
            </span>
            .
          </>
        }
        description={
          isSpanish
            ? "Borra tu cuenta WIWI y sus turnos, perfiles de costos y ajustes desde la app o solicita ayuda si no puedes entrar."
            : "Delete your WIWI account and its shifts, cost profiles, and settings in the app, or request help if you cannot sign in."
        }
        actions={
          <>
            <Link
              href="/settings"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-orange-300"
            >
              <Settings className="h-4 w-4" />
              <span>{isSpanish ? "Ir a Ajustes" : "Go to Settings"}</span>
            </Link>
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

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {steps.map(({ icon: Icon, title, body }, index) => (
          <Panel key={title}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-400/10 text-orange-200">
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {isSpanish ? `Paso ${index + 1}` : `Step ${index + 1}`}
            </p>
            <h2 className="mt-2 text-xl font-black text-white">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">{body}</p>
          </Panel>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel>
          <ShieldCheck className="h-6 w-6 text-sky-300" />
          <h2 className="mt-4 text-xl font-black text-white">
            {isSpanish ? "Qué se elimina" : "What is deleted"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            {isSpanish
              ? "Tu cuenta de autenticacion, perfil WIWI, ajustes, perfiles de costos, beneficios de WIWI y turnos asociados. Despues del borrado no podras recuperar esos datos."
              : "Your authentication account, WIWI profile, settings, cost profiles, WIWI entitlement record, and associated shifts. After deletion completes, this data cannot be recovered."}
          </p>
          <p className="mt-4 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 text-sm leading-6 text-orange-100">
            {isSpanish
              ? "Borrar tu cuenta no cancela una suscripcion de Apple o Google. Cancela la renovacion en la tienda primero."
              : "Deleting your account does not cancel an Apple or Google subscription. Cancel renewal in the store first."}
          </p>
        </Panel>

        <Panel>
          <Mail className="h-6 w-6 text-emerald-300" />
          <h2 className="mt-4 text-xl font-black text-white">
            {isSpanish ? "¿No puedes iniciar sesión?" : "Can’t sign in?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            {isSpanish
              ? "Envía la solicitud desde el correo registrado. Verificaremos que la cuenta te pertenece antes de borrar datos. Nunca envíes tu contraseña."
              : "Send the request from your registered email. We will verify account ownership before deleting data. Never send your password."}
          </p>
          <a
            href="mailto:support@getwiwi.com?subject=WIWI%20Account%20Deletion%20Request"
            className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-200 transition hover:border-emerald-300"
          >
            <Mail className="h-4 w-4" />
            <span>support@getwiwi.com</span>
          </a>
        </Panel>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/privacy" className="font-semibold text-sky-300 transition hover:text-sky-200">
          {isSpanish ? "Lee nuestra Política de Privacidad" : "Read our Privacy Policy"}
        </Link>
      </p>
    </WiwiShell>
  );
}
