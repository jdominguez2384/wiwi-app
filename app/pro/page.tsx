"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CarFront,
  Check,
  Crown,
  FileDown,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Tags,
  Target,
  WalletCards,
} from "lucide-react";
import { AuthGuard } from "../../components/AuthGuard";
import { useBilling } from "../../components/BillingProvider";
import { useLanguage } from "../../components/LanguageProvider";
import { usePlan } from "../../components/PlanProvider";
import { ProWorkspace } from "../../components/ProWorkspace";
import { WiwiAppNav, WiwiMobileTabs } from "../../components/WiwiAppNav";
import { WiwiShell } from "../../components/WiwiShell";
import { MessageBanner, PageHero, Panel } from "../../components/WiwiSurface";
import {
  fallbackProPrices,
  type ProPackageKey,
} from "../../lib/billing";
import { getPlanName, getPlanSummary } from "../../lib/plans";

const FEATURE_ICONS = [BarChart3, Target, FileDown, CarFront, Tags];

export default function ProPage() {
  const { language, setLanguage } = useLanguage();
  const { plan, isPro, isLoadingPlan } = usePlan();
  const {
    availability,
    packages,
    customerInfo,
    hasStoreProEntitlement,
    billingError,
    isProcessingPurchase,
    purchase,
    restorePurchases,
    manageSubscription,
    clearBillingError,
  } = useBilling();
  const isSpanish = language === "es";
  const hasProAccess = isPro || hasStoreProEntitlement;
  const billingReady = availability === "ready";

  const features = [
    {
      title: isSpanish ? "Comparaciones avanzadas" : "Advanced comparisons",
      description: isSpanish
        ? "Compara pago neto y pago por hora entre periodos, dias y apps."
        : "Compare net pay and hourly performance across periods, days, and apps.",
    },
    {
      title: isSpanish ? "Pronostico de metas" : "Goal forecasting",
      description: isSpanish
        ? "Calcula cuantos turnos y horas podrian faltar para alcanzar tu meta."
        : "Estimate how many shifts and hours remain before you reach your goal.",
    },
    {
      title: isSpanish ? "Reportes CSV y PDF" : "CSV and PDF reports",
      description: isSpanish
        ? "Lleva tus datos a hojas de calculo, registros y preparacion fiscal."
        : "Take your data into spreadsheets, records, and tax preparation.",
    },
    {
      title: isSpanish ? "Perfiles de costos" : "Cost profiles",
      description: isSpanish
        ? "Guarda diferentes autos, consumo, gasolina y ajustes de impuestos."
        : "Save different vehicles, fuel economy, gas prices, and tax assumptions.",
    },
    {
      title: isSpanish ? "Notas y etiquetas" : "Notes and tags",
      description: isSpanish
        ? "Agrega contexto a cada turno y encuentra detalles importantes despues."
        : "Add context to every shift and find important details later.",
    },
  ];

  const planOptions: Array<{
    key: ProPackageKey;
    name: string;
    cadence: string;
    detail: string;
    badge?: string;
  }> = [
    {
      key: "monthly",
      name: isSpanish ? "Mensual" : "Monthly",
      cadence: isSpanish ? "/ mes" : "/ month",
      detail: isSpanish
        ? "Flexible. Cancela cuando quieras."
        : "Flexible. Cancel anytime.",
    },
    {
      key: "annual",
      name: isSpanish ? "Anual" : "Annual",
      cadence: isSpanish ? "/ ano" : "/ year",
      detail: isSpanish
        ? "Ahorra aproximadamente 33% frente al plan mensual."
        : "Save about 33% compared with monthly.",
      badge: isSpanish ? "Mejor valor" : "Best value",
    },
    {
      key: "lifetime",
      name: isSpanish ? "De por vida" : "Lifetime",
      cadence: isSpanish ? " una vez" : " one time",
      detail: isSpanish
        ? "Oferta limitada para los primeros usuarios."
        : "Limited founding-member offer.",
      badge: isSpanish ? "Fundador" : "Founding",
    },
  ];

  const billingStatus = (() => {
    if (availability === "loading") {
      return isSpanish ? "Conectando con la tienda..." : "Connecting to the store...";
    }
    if (availability === "ready") {
      return isSpanish
        ? "La compra segura se completa con Apple o Google."
        : "Secure checkout is completed by Apple or Google.";
    }
    if (availability === "web") {
      return isSpanish
        ? "Las compras estaran disponibles dentro de la app movil. No se cobrara nada aqui."
        : "Purchases will be available inside the mobile app. Nothing is charged here.";
    }
    return isSpanish
      ? "WIWI Pro esta preparado, pero las compras siguen desactivadas hasta terminar la configuracion de las tiendas."
      : "WIWI Pro is ready, but purchases remain disabled until store setup is complete.";
  })();

  async function handlePurchase(packageKey: ProPackageKey) {
    clearBillingError();
    await purchase(packageKey);
  }

  return (
    <AuthGuard>
      <WiwiShell
        language={language}
        setLanguage={setLanguage}
        showLanguageControls={false}
        navActions={<WiwiAppNav language={language} />}
        mobileNavigation={<WiwiMobileTabs language={language} />}
      >
        <PageHero
          eyebrowContent={
            <>
              <Crown className="h-4 w-4 text-amber-300" />
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
                WIWI Pro
              </span>
            </>
          }
          title={
            hasProAccess
              ? isSpanish
                ? "Convierte tus turnos en mejores decisiones."
                : "Turn your shifts into better decisions."
              : isSpanish
                ? "Ve mas alla del total de tu turno."
                : "Go beyond your shift total."
          }
          description={
            hasProAccess
              ? isSpanish
                ? "Compara tu rendimiento, pronostica tus metas y descarga reportes sin perder el control de tus datos."
                : "Compare performance, forecast goals, and download reports without losing control of your data."
              : isSpanish
                ? "WIWI Free mantiene el registro esencial. Pro agrega las herramientas para entender patrones, planear y exportar."
                : "WIWI Free keeps essential tracking intact. Pro adds the tools to understand patterns, plan ahead, and export."
          }
          actions={
            hasProAccess ? (
              <>
                <Link
                  href="/add-shift"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
                >
                  <Sparkles className="h-4 w-4" />
                  {isSpanish ? "Registrar turno" : "Log a shift"}
                </Link>
                {customerInfo?.managementURL ? (
                  <button
                    type="button"
                    onClick={manageSubscription}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-white"
                  >
                    <WalletCards className="h-4 w-4" />
                    {isSpanish ? "Administrar plan" : "Manage plan"}
                  </button>
                ) : null}
              </>
            ) : (
              <Link
                href="#plans"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
              >
                {isSpanish ? "Ver planes" : "See plans"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )
          }
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-sky-500/20 bg-sky-500/10 p-5 sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.22em] text-sky-300">
                {isSpanish ? "Plan actual" : "Current plan"}
              </p>
              <p className="mt-3 text-3xl font-black tracking-tight text-white">
                {isLoadingPlan ? "..." : hasProAccess ? "WIWI Pro" : getPlanName(plan)}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {hasProAccess
                  ? getPlanSummary("pro", language)
                  : getPlanSummary(plan, language)}
              </p>
            </div>
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
              <ShieldCheck className="h-6 w-6 text-emerald-300" />
              <p className="mt-4 text-sm font-semibold text-white">
                {isSpanish ? "Tus datos siguen siendo tuyos" : "Your data stays yours"}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                {isSpanish
                  ? "Cancelar Pro no elimina tus turnos."
                  : "Canceling Pro never deletes your shifts."}
              </p>
            </div>
          </div>
        </PageHero>

        {hasProAccess ? (
          <ProWorkspace />
        ) : (
          <>
            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {features.map((feature, index) => {
                const Icon = FEATURE_ICONS[index];
                return (
                  <Panel key={feature.title} className="relative overflow-hidden">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-5 font-bold text-white">{feature.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {feature.description}
                    </p>
                  </Panel>
                );
              })}
            </section>

            <section id="plans" className="mt-8 scroll-mt-24">
              <div className="mx-auto max-w-2xl text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-200">
                  <BadgeCheck className="h-4 w-4" />
                  {isSpanish ? "Todos los beneficios Pro" : "Every Pro benefit included"}
                </div>
                <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {isSpanish ? "Elige como pagar." : "Choose how you pay."}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {isSpanish
                    ? "El precio final, cualquier prueba disponible y los terminos aparecen en Apple o Google antes de confirmar."
                    : "Your final price, any available trial, and terms appear in Apple or Google before confirmation."}
                </p>
              </div>

              <div className="mt-7 grid gap-5 lg:grid-cols-3">
                {planOptions.map((option) => {
                  const storePackage = packages[option.key];
                  const price =
                    storePackage?.product.priceString ?? fallbackProPrices[option.key];
                  const canPurchase = billingReady && Boolean(storePackage);
                  return (
                    <div
                      key={option.key}
                      className={`relative rounded-[2rem] border p-6 ${
                        option.key === "annual"
                          ? "border-sky-400/50 bg-gradient-to-b from-sky-500/15 to-slate-950 shadow-2xl shadow-sky-950/40"
                          : "border-slate-800 bg-slate-950/80"
                      }`}
                    >
                      {option.badge ? (
                        <span className="absolute right-5 top-5 rounded-full bg-sky-400 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.15em] text-slate-950">
                          {option.badge}
                        </span>
                      ) : null}
                      <p className="text-sm font-semibold text-slate-300">{option.name}</p>
                      <p className="mt-5 text-4xl font-black tracking-tight text-white">
                        {price}
                        <span className="ml-1 text-sm font-medium text-slate-500">
                          {option.cadence}
                        </span>
                      </p>
                      <p className="mt-4 min-h-12 text-sm leading-6 text-slate-400">
                        {option.detail}
                      </p>
                      <div className="mt-5 space-y-3 border-t border-slate-800 pt-5 text-sm text-slate-300">
                        <p className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-300" />
                          {isSpanish ? "Todas las funciones Pro" : "All Pro features"}
                        </p>
                        <p className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-300" />
                          {option.key === "lifetime"
                            ? isSpanish
                              ? "Sin renovacion automatica"
                              : "No automatic renewal"
                            : isSpanish
                              ? "Cancela cuando quieras"
                              : "Cancel anytime"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handlePurchase(option.key)}
                        disabled={!canPurchase || isProcessingPurchase}
                        className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                          option.key === "annual"
                            ? "bg-sky-400 text-slate-950 hover:bg-sky-300"
                            : "border border-slate-700 bg-slate-900 text-white hover:border-sky-500/50"
                        }`}
                      >
                        {isProcessingPurchase
                          ? isSpanish
                            ? "Procesando..."
                            : "Processing..."
                          : canPurchase
                            ? isSpanish
                              ? `Elegir ${option.name}`
                              : `Choose ${option.name}`
                            : isSpanish
                              ? "Disponible al lanzar"
                              : "Available at launch"}
                      </button>
                    </div>
                  );
                })}
              </div>

              <Panel className="mt-5 border-slate-800 bg-slate-950/60">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-white">
                      <WalletCards className="h-4 w-4 text-sky-300" />
                      {isSpanish ? "Estado de compras" : "Purchase status"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{billingStatus}</p>
                  </div>
                  {billingReady ? (
                    <button
                      type="button"
                      onClick={() => void restorePurchases()}
                      disabled={isProcessingPurchase}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/50 hover:text-white disabled:opacity-60"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      {isSpanish ? "Restaurar compras" : "Restore purchases"}
                    </button>
                  ) : null}
                </div>
                {billingError ? (
                  <MessageBanner className="mt-4">{billingError}</MessageBanner>
                ) : null}
              </Panel>
            </section>
          </>
        )}
      </WiwiShell>
    </AuthGuard>
  );
}
