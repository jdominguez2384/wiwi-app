"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeDollarSign,
  FileText,
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

export default function TermsPage() {
  const { language, setLanguage } = useLanguage();
  const isSpanish = language === "es";

  return (
    <WiwiShell
      language={language}
      setLanguage={setLanguage}
      navActions={
        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href="/privacy"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 transition hover:border-sky-500/40 hover:text-white"
          >
            {isSpanish ? "Privacidad" : "Privacy"}
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
            <FileText className="h-4 w-4 text-sky-300" />
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
              {isSpanish ? "Terminos" : "Terms"}
            </span>
          </>
        }
        title={
          isSpanish ? (
            <>
              Las reglas simples para usar{" "}
              <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                WIWI
              </span>
              .
            </>
          ) : (
            <>
              The simple rules for using{" "}
              <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                WIWI
              </span>
              .
            </>
          )
        }
        description={
          isSpanish
            ? "Estos terminos explican que hace WIWI, que no hace, y como debes usarlo."
            : "These terms explain what WIWI does, what it does not do, and how you should use it."
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
            <BadgeDollarSign className="h-5 w-5 text-emerald-300" />
            <p className="mt-3 text-sm font-semibold text-white">
              {isSpanish ? "Estimaciones" : "Estimates"}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {isSpanish
                ? "WIWI ayuda a estimar, no reemplaza consejo profesional."
                : "WIWI helps estimate, but does not replace professional advice."}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
            <ShieldCheck className="h-5 w-5 text-sky-300" />
            <p className="mt-3 text-sm font-semibold text-white">
              {isSpanish ? "Tu responsabilidad" : "Your responsibility"}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {isSpanish
                ? "Verifica tus datos, impuestos y decisiones."
                : "Verify your data, taxes, and decisions."}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
            <Trash2 className="h-5 w-5 text-orange-300" />
            <p className="mt-3 text-sm font-semibold text-white">
              {isSpanish ? "Control de cuenta" : "Account control"}
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
        <LegalSection title={isSpanish ? "Aceptacion" : "Acceptance"}>
          <p>
            By creating an account or using WIWI, you agree to these terms. If
            you do not agree, do not use WIWI.
          </p>
        </LegalSection>

        <LegalSection title={isSpanish ? "Que hace WIWI" : "What WIWI Does"}>
          <p>
            WIWI helps gig workers estimate real shift income after user-entered
            earnings, hours, miles, fuel assumptions, tax reserve assumptions, and
            other settings.
          </p>
          <p>
            WIWI is a planning and tracking tool. It does not guarantee earnings,
            employment outcomes, tax results, platform availability, or financial
            outcomes.
          </p>
        </LegalSection>

        <LegalSection title={isSpanish ? "No es consejo profesional" : "No Professional Advice"}>
          <p>
            WIWI does not provide tax, legal, financial, accounting, or employment
            advice. Calculations are estimates based on the information and
            settings you provide.
          </p>
          <p>
            You are responsible for reviewing your own records, choosing accurate
            settings, and talking with a qualified professional when you need tax,
            legal, accounting, or financial advice.
          </p>
        </LegalSection>

        <LegalSection title={isSpanish ? "Uso aceptable" : "Acceptable Use"}>
          <p>
            You agree not to misuse WIWI, attempt to break or bypass security,
            interfere with the app, upload harmful content, or use WIWI for
            unlawful purposes.
          </p>
          <p>
            You are responsible for keeping your login credentials safe and for
            the information entered into your account.
          </p>
        </LegalSection>

        <LegalSection title={isSpanish ? "Cuentas y borrado" : "Accounts and Deletion"}>
          <p>
            WIWI may require an account to save shift history, settings, and
            insights. You can delete your account from Settings. Deleting your
            account removes your WIWI account and associated WIWI data.
          </p>
          <p>
            We may suspend or restrict access if an account is used in a way that
            harms WIWI, other users, or the security of the service.
          </p>
        </LegalSection>

        <LegalSection title={isSpanish ? "Pagos futuros" : "Future Paid Features"}>
          <p>
            WIWI is currently preparing for future monetization. If paid features,
            subscriptions, or app-store purchases are added later, the app will
            show the price, billing terms, renewal details, and cancellation path
            before purchase.
          </p>
        </LegalSection>

        <LegalSection title={isSpanish ? "Limitaciones" : "Limitations"}>
          <p>
            WIWI is provided as-is and as available. We work to make the app
            useful and reliable, but we do not promise uninterrupted service,
            perfect accuracy, or that every estimate will match your real-world
            outcome.
          </p>
          <p className="flex items-start gap-2 text-orange-200">
            <AlertTriangle className="mt-1 h-4 w-4 shrink-0" />
            <span>
              Always verify important earnings, mileage, tax, and business
              decisions outside the app.
            </span>
          </p>
        </LegalSection>

        <LegalSection title={isSpanish ? "Contacto y cambios" : "Contact and Changes"}>
          <p>
            We may update these terms as WIWI grows. Continued use of WIWI after
            an update means the new version applies.
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
