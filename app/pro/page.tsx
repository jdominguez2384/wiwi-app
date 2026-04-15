"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BadgeDollarSign,
  CheckCircle2,
  Crown,
  LockKeyhole,
  Rocket,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "../../components/LanguageProvider";
import { usePlan } from "../../components/PlanProvider";
import { WiwiShell } from "../../components/WiwiShell";
import { PageHero, Panel } from "../../components/WiwiSurface";
import {
  getPlanName,
  getPlanSummary,
  getProPreviewFeatures,
} from "../../lib/plans";

export default function ProPage() {
  const { language, setLanguage } = useLanguage();
  const { plan, isPro, isLoadingPlan } = usePlan();
  const isSpanish = language === "es";
  const proFeatures = getProPreviewFeatures(language);

  return (
    <WiwiShell
      language={language}
      setLanguage={setLanguage}
      navActions={
        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 transition hover:border-sky-500/40 hover:text-white"
          >
            {isSpanish ? "Panel" : "Dashboard"}
          </Link>
          <Link
            href="/settings"
            className="rounded-xl bg-sky-500 px-3 py-2 text-sm font-semibold text-black transition hover:bg-sky-400"
          >
            {isSpanish ? "Ajustes" : "Settings"}
          </Link>
        </div>
      }
    >
      <PageHero
        eyebrowContent={
          <>
            <Crown className="h-4 w-4 text-sky-300" />
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
              {isSpanish ? "WIWI Pro" : "WIWI Pro"}
            </span>
          </>
        }
        title={
          isSpanish ? (
            <>
              La ruta premium para hacer que cada turno{" "}
              <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                trabaje mas fuerte
              </span>
              .
            </>
          ) : (
            <>
              The premium path for making every shift{" "}
              <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                work harder
              </span>
              .
            </>
          )
        }
        description={
          isSpanish
            ? "WIWI Pro todavia no cobra. Esta pantalla prepara el camino para futuras funciones pagadas sin bloquear las herramientas actuales."
            : "WIWI Pro is not charging yet. This screen prepares the path for future paid features without blocking the tools you already use."
        }
        actions={
          <>
            <Link
              href="/settings"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{isSpanish ? "Volver a ajustes" : "Back to settings"}</span>
            </Link>
            <Link
              href="/add-shift"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isSpanish ? "Registrar turno" : "Log a shift"}</span>
            </Link>
          </>
        }
      >
        <div className="grid gap-3 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="rounded-3xl border border-sky-500/20 bg-sky-500/10 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-sky-300">
              {isSpanish ? "Plan actual" : "Current plan"}
            </p>
            <p className="mt-3 text-3xl font-black tracking-tight text-white">
              {isLoadingPlan ? "..." : getPlanName(plan)}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {getPlanSummary(plan, language)}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <BadgeDollarSign className="h-4 w-4 text-emerald-300" />
              <span>{isSpanish ? "Estado de pagos" : "Billing status"}</span>
            </div>
            <p className="mt-4 text-2xl font-black tracking-tight text-white">
              {isSpanish ? "Sin cobros todavia" : "No charges yet"}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {isSpanish
                ? "Cuando agreguemos pagos, WIWI mostrara precio, beneficios y cancelacion antes de cualquier compra."
                : "When payments are added, WIWI will show price, benefits, and cancellation details before any purchase."}
            </p>
          </div>
        </div>
      </PageHero>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
        <Panel>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Rocket className="h-4 w-4 text-sky-300" />
            <span>{isSpanish ? "Pensado para Pro" : "Planned for Pro"}</span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {proFeatures.map((feature) => (
              <div
                key={feature.label}
                className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-300">
                    <LockKeyhole className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{feature.label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="border-emerald-500/20 bg-emerald-950/10">
          <div className="flex items-center gap-2 text-sm text-emerald-200">
            <CheckCircle2 className="h-4 w-4" />
            <span>
              {isPro
                ? isSpanish
                  ? "Pro activo"
                  : "Pro active"
                : isSpanish
                  ? "Gratis por ahora"
                  : "Free for now"}
            </span>
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-white">
            {isSpanish ? "La prioridad sigue siendo confianza." : "The priority is still trust."}
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            {isSpanish
              ? "Antes de cobrar, WIWI necesita demostrar que ayuda a trabajadores gig a tomar mejores decisiones. Por eso Pro esta preparado, pero no activado como paywall."
              : "Before charging, WIWI needs to prove it helps gig workers make better decisions. That is why Pro is prepared, but not turned into a paywall yet."}
          </p>

          <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm font-semibold text-white">
              {isSpanish ? "Primeras funciones pagadas ideales" : "Best first paid features"}
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <p>{isSpanish ? "1. Exportes para impuestos y registros." : "1. Exports for taxes and records."}</p>
              <p>{isSpanish ? "2. Analisis mensual avanzado." : "2. Advanced monthly insights."}</p>
              <p>{isSpanish ? "3. Pronosticos para metas semanales." : "3. Forecasting for weekly goals."}</p>
            </div>
          </div>
        </Panel>
      </div>
    </WiwiShell>
  );
}
