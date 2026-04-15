"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Database,
  FileText,
  Lock,
  Mail,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useLanguage } from "../../components/LanguageProvider";
import { WiwiShell } from "../../components/WiwiShell";
import { PageHero, Panel } from "../../components/WiwiSurface";

function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Panel>
      <h2 className="text-2xl font-black tracking-tight text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-300">
        {children}
      </div>
    </Panel>
  );
}

export default function PrivacyPage() {
  const { language, setLanguage } = useLanguage();
  const isSpanish = language === "es";

  return (
    <WiwiShell
      language={language}
      setLanguage={setLanguage}
      navActions={
        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href="/login"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 transition hover:border-sky-500/40 hover:text-white"
          >
            {isSpanish ? "Entrar" : "Sign in"}
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-sky-500 px-3 py-2 text-sm font-semibold text-black transition hover:bg-sky-400"
          >
            {isSpanish ? "Crear cuenta" : "Create account"}
          </Link>
        </div>
      }
    >
      <PageHero
        eyebrowContent={
          <>
            <ShieldCheck className="h-4 w-4 text-sky-300" />
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
              {isSpanish ? "Privacidad" : "Privacy"}
            </span>
          </>
        }
        title={
          isSpanish ? (
            <>
              Como WIWI cuida tus{" "}
              <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                datos de turnos
              </span>
              .
            </>
          ) : (
            <>
              How WIWI handles your{" "}
              <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                shift data
              </span>
              .
            </>
          )
        }
        description={
          isSpanish
            ? "Esta politica explica que informacion usa WIWI, por que la usamos y como puedes borrar tu cuenta."
            : "This policy explains what information WIWI uses, why we use it, and how you can delete your account."
        }
        actions={
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{isSpanish ? "Volver al inicio" : "Back home"}</span>
          </Link>
        }
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
            <Database className="h-5 w-5 text-sky-300" />
            <p className="mt-3 text-sm font-semibold text-white">
              {isSpanish ? "Datos que ingresas" : "Data you enter"}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {isSpanish
                ? "Turnos, millas, horas, ingresos y ajustes."
                : "Shifts, miles, hours, earnings, and settings."}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
            <Lock className="h-5 w-5 text-emerald-300" />
            <p className="mt-3 text-sm font-semibold text-white">
              {isSpanish ? "Acceso con cuenta" : "Account access"}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {isSpanish
                ? "Supabase administra inicio de sesion y seguridad."
                : "Supabase handles sign-in and account security."}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
            <Trash2 className="h-5 w-5 text-orange-300" />
            <p className="mt-3 text-sm font-semibold text-white">
              {isSpanish ? "Borrado de cuenta" : "Account deletion"}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {isSpanish
                ? "Puedes borrar tu cuenta desde Ajustes."
                : "You can delete your account from Settings."}
            </p>
          </div>
        </div>
      </PageHero>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <LegalSection title={isSpanish ? "Informacion que recopilamos" : "Information We Collect"}>
          <p>
            WIWI collects the information you provide when you create an account,
            including your email address, display name, preferred language, and
            authentication details handled through Supabase.
          </p>
          <p>
            WIWI also stores the shift information you enter, such as app name,
            shift date, gross earnings, hours worked, miles driven, and your
            calculation settings like tax reserve, MPG, gas price, and weekly
            goal.
          </p>
        </LegalSection>

        <LegalSection title={isSpanish ? "Como usamos la informacion" : "How We Use Information"}>
          <p>
            We use your information to calculate your estimated real earnings,
            show shift history, compare performance over time, save your settings,
            and help you access your account.
          </p>
          <p>
            We may also use your email address to send transactional messages,
            such as account confirmation and password reset emails. WIWI does not
            currently sell your personal information.
          </p>
        </LegalSection>

        <LegalSection title={isSpanish ? "Servicios que usamos" : "Services We Use"}>
          <p>
            WIWI uses Supabase for authentication and database storage, Vercel for
            app hosting, and Resend for transactional email delivery. These
            providers process information only as needed to run WIWI.
          </p>
          <p>
            Your use of WIWI may also be subject to the privacy practices of your
            device, browser, app store, or internet provider.
          </p>
        </LegalSection>

        <LegalSection title={isSpanish ? "Borrar tu cuenta" : "Deleting Your Account"}>
          <p>
            You can request account deletion inside WIWI by going to Settings,
            opening the account deletion area, and confirming the deletion. This
            removes your WIWI account and associated WIWI data, including shifts,
            profile details, and saved calculation settings.
          </p>
          <p>
            If you need help deleting your account, contact us at{" "}
            <a
              href="mailto:support@getwiwi.com"
              className="font-semibold text-sky-300 transition hover:text-sky-200"
            >
              support@getwiwi.com
            </a>
            .
          </p>
        </LegalSection>

        <LegalSection title={isSpanish ? "Seguridad y retencion" : "Security and Retention"}>
          <p>
            We use reputable infrastructure providers and account authentication
            tools to help protect your information. No internet service can
            promise perfect security, but WIWI is designed to limit access to your
            personal data.
          </p>
          <p>
            We keep your information while your account is active or as needed to
            operate WIWI, comply with legal obligations, resolve disputes, or
            enforce our terms.
          </p>
        </LegalSection>

        <LegalSection title={isSpanish ? "Contacto y cambios" : "Contact and Changes"}>
          <p>
            If this policy changes, we will update this page. Continued use of
            WIWI after an update means the new version applies.
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-sky-300" />
            <span>support@getwiwi.com</span>
          </p>
          <p className="flex items-center gap-2 text-slate-500">
            <FileText className="h-4 w-4" />
            <span>Last updated: April 15, 2026</span>
          </p>
        </LegalSection>
      </div>
    </WiwiShell>
  );
}
