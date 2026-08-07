"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  CircleHelp,
  Crown,
  FileText,
  Fuel,
  Globe,
  LifeBuoy,
  LogOut,
  Percent,
  PlayCircle,
  Settings as SettingsIcon,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { WiwiShell } from "../../components/WiwiShell";
import {
  InputLabel,
  MessageBanner,
  PageHero,
  Panel,
} from "../../components/WiwiSurface";
import { WiwiAppNav, WiwiMobileTabs } from "../../components/WiwiAppNav";
import { useLanguage } from "../../components/LanguageProvider";
import { usePlan } from "../../components/PlanProvider";
import { useSettings } from "../../components/SettingsProvider";
import { AuthGuard } from "../../components/AuthGuard";
import { useAuth } from "../../components/AuthProvider";
import { useTutorial } from "../../components/TutorialProvider";
import { signOut } from "../../lib/auth";
import { updateUserSettings } from "../../lib/data/settings";
import {
  getNonNegativeNumber,
  getPositiveNumber,
  isNonNegativeDecimalInput,
} from "../../lib/shiftForm";
import {
  getPlanName,
  getPlanSummary,
  getProPreviewFeatures,
} from "../../lib/plans";
import { supabase } from "../../lib/supabase/client";
import { tutorialFaqs } from "../../lib/tutorial";
import { cx, formatMoney } from "../../lib/ui";

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const { plan, isLoadingPlan } = usePlan();
  const { settings, updateSettings } = useSettings();
  const { user } = useAuth();
  const { openTutorial } = useTutorial();
  const router = useRouter();
  const isSpanish = language === "es";
  const showProPreview =
    process.env.NEXT_PUBLIC_PRO_PREVIEW_ENABLED === "true";

  const [taxRatePercent, setTaxRatePercent] = useState("");
  const [mpg, setMpg] = useState("");
  const [gasPrice, setGasPrice] = useState("");
  const [weeklyGoal, setWeeklyGoal] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    setTaxRatePercent(String(settings.taxRate * 100));
    setMpg(String(settings.mpg));
    setGasPrice(String(settings.gasPrice));
    setWeeklyGoal(String(settings.weeklyGoal));
  }, [settings]);

  const previewTaxRate = Math.max(0, Number(taxRatePercent) || 0) / 100;
  const previewMpg = Math.max(0, Number(mpg) || 0);
  const previewGasPrice = Math.max(0, Number(gasPrice) || 0);
  const previewWeeklyGoal = Math.max(0, Number(weeklyGoal) || 0);
  const proPreviewFeatures = useMemo(
    () => getProPreviewFeatures(language).slice(0, 3),
    [language]
  );
  const faqItems = tutorialFaqs[language];

  const exampleShift = useMemo(() => {
    const gross = 100;
    const milesDriven = 20;
    const hoursWorked = 4;
    const fuelCost =
      previewMpg > 0 ? (milesDriven / previewMpg) * previewGasPrice : 0;
    const taxSetAside = gross * previewTaxRate;
    const net = gross - fuelCost - taxSetAside;
    const hourly = hoursWorked > 0 ? net / hoursWorked : 0;
    const shiftsToGoal =
      previewWeeklyGoal > 0 && net > 0 ? previewWeeklyGoal / net : 0;

    return {
      gross,
      milesDriven,
      hoursWorked,
      fuelCost,
      taxSetAside,
      net,
      hourly,
      shiftsToGoal,
    };
  }, [previewGasPrice, previewMpg, previewTaxRate, previewWeeklyGoal]);

  function updateDecimalValue(
    value: string,
    setter: (nextValue: string) => void
  ) {
    if (isNonNegativeDecimalInput(value)) {
      setter(value);
    }
  }

  async function handleSave() {
    setMessage("");

    if (!user) {
      setMessage(
        isSpanish ? "Debes iniciar sesión." : "You must be signed in."
      );
      return;
    }

    const taxPercentNumber = getNonNegativeNumber(taxRatePercent);
    const mpgNumber = getPositiveNumber(mpg);
    const gasPriceNumber = getNonNegativeNumber(gasPrice);
    const weeklyGoalNumber = getNonNegativeNumber(weeklyGoal);

    if (
      taxPercentNumber === null ||
      mpgNumber === null ||
      gasPriceNumber === null ||
      weeklyGoalNumber === null
    ) {
      setMessage(
        isSpanish
          ? "Por favor ingresa números válidos."
          : "Please enter valid numbers."
      );
      return;
    }

    if (taxPercentNumber > 100) {
      setMessage(
        isSpanish
          ? "El porcentaje para impuestos debe estar entre 0 y 100%."
          : "Tax set-aside must be between 0 and 100%."
      );
      return;
    }

    setIsSaving(true);

    try {
      const nextValues = {
        taxRate: taxPercentNumber / 100,
        mpg: mpgNumber,
        gasPrice: gasPriceNumber,
        weeklyGoal: weeklyGoalNumber,
      };

      const { error } = await updateUserSettings(user.id, {
        tax_rate: nextValues.taxRate,
        mpg: nextValues.mpg,
        gas_price: nextValues.gasPrice,
        weekly_goal: nextValues.weeklyGoal,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      updateSettings(nextValues);
      setMessage(isSpanish ? "Ajustes guardados." : "Settings saved.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut();
    router.push("/login");
  }

  async function handleDeleteAccount() {
    setMessage("");

    if (deleteConfirmation.trim().toUpperCase() !== "DELETE") {
      setMessage(
        isSpanish
          ? "Escribe DELETE para confirmar que quieres borrar tu cuenta."
          : "Type DELETE to confirm you want to delete your account."
      );
      return;
    }

    setIsDeletingAccount(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        setMessage(
          isSpanish
            ? "Tu sesion expiro. Inicia sesion otra vez e intentalo de nuevo."
            : "Your session expired. Sign in again and try once more."
        );
        return;
      }

      const response = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      const payload = (await response
        .json()
        .catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setMessage(
          payload?.error ||
            (isSpanish
              ? "No pudimos borrar tu cuenta. Intentalo de nuevo."
              : "We could not delete your account. Please try again.")
        );
        return;
      }

      await signOut();
      router.replace("/login");
    } catch {
      setMessage(
        isSpanish
          ? "Algo fallo al borrar tu cuenta. Intentalo de nuevo."
          : "Something went wrong while deleting your account. Please try again."
      );
    } finally {
      setIsDeletingAccount(false);
    }
  }

  return (
    <AuthGuard>
      <WiwiShell
        language={language}
        setLanguage={setLanguage}
        languageDisabled={isSaving || isDeletingAccount}
        showLanguageControls={false}
        navActions={
          <WiwiAppNav language={language} disabled={isSaving || isDeletingAccount} />
        }
        mobileNavigation={<WiwiMobileTabs language={language} />}
      >
        <PageHero
          eyebrowContent={
            <>
              <Sparkles className="h-4 w-4 text-sky-300" />
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
                {isSpanish ? "Ajustes" : "Settings"}
              </span>
            </>
          }
          title={
            isSpanish ? (
              <>
                Ajusta cómo WIWI calcula si{" "}
                <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                  valió la pena
                </span>
                .
              </>
            ) : (
              <>
                Tune how WIWI decides if it{" "}
                <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                  was worth it
                </span>
                .
              </>
            )
          }
          description={
            isSpanish
              ? "Configura tus impuestos, MPG, gasolina y meta semanal para que cada turno refleje tu realidad."
              : "Set your tax reserve, MPG, gas price, and weekly goal so every shift reflects your real-world numbers."
          }
          actions={
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{isSpanish ? "Volver al panel" : "Back to dashboard"}</span>
            </Link>
          }
        />

        {message ? <MessageBanner className="mt-6">{message}</MessageBanner> : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Panel>
            <p className="text-sm text-slate-400">
              {isSpanish ? "Impuestos apartados" : "Tax set-aside"}
            </p>
            <p className="mt-3 text-3xl font-black tracking-tight text-white">
              {previewTaxRate > 0 ? `${(previewTaxRate * 100).toFixed(0)}%` : "0%"}
            </p>
          </Panel>

          <Panel>
            <p className="text-sm text-slate-400">MPG</p>
            <p className="mt-3 text-3xl font-black tracking-tight text-white">
              {previewMpg.toFixed(1)}
            </p>
          </Panel>

          <Panel>
            <p className="text-sm text-slate-400">
              {isSpanish ? "Gasolina" : "Gas price"}
            </p>
            <p className="mt-3 text-3xl font-black tracking-tight text-white">
              {formatMoney(previewGasPrice)}
            </p>
          </Panel>

          <Panel>
            <p className="text-sm text-slate-400">
              {isSpanish ? "Meta semanal" : "Weekly goal"}
            </p>
            <p className="mt-3 text-3xl font-black tracking-tight text-white">
              {formatMoney(previewWeeklyGoal)}
            </p>
          </Panel>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
          <Panel>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <SettingsIcon className="h-4 w-4 text-sky-400" />
              <span>{isSpanish ? "Tus cálculos" : "Your calculations"}</span>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <InputLabel
                  htmlFor="settings-tax-rate"
                  icon={<Percent className="h-4 w-4 text-orange-300" />}
                >
                  {isSpanish
                    ? "¿Cuánto quieres apartar para impuestos?"
                    : "How much do you want to set aside for taxes?"}
                </InputLabel>

                <div className="relative">
                  <input
                    id="settings-tax-rate"
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    inputMode="numeric"
                    value={taxRatePercent}
                    onChange={(e) =>
                      updateDecimalValue(e.target.value, setTaxRatePercent)
                    }
                    disabled={isSaving}
                    className="block w-full min-w-0 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-white outline-none transition focus:border-sky-500 disabled:opacity-60"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
                    %
                  </span>
                </div>

                <p className="text-xs leading-5 text-slate-500">
                  {isSpanish
                    ? "Empieza con 20% si no estás seguro. Muchos trabajadores gig usan entre 20% y 30%."
                    : "Start with 20% if you are unsure. Many gig workers use somewhere between 20% and 30%."}
                </p>
              </div>

              <div className="space-y-2">
                <InputLabel
                  htmlFor="settings-mpg"
                  icon={<Fuel className="h-4 w-4 text-sky-300" />}
                >
                  {isSpanish ? "Millas por galón" : "Vehicle MPG"}
                </InputLabel>
                <input
                  id="settings-mpg"
                  type="number"
                  step="0.1"
                  min="0.1"
                  inputMode="decimal"
                  value={mpg}
                  onChange={(e) => updateDecimalValue(e.target.value, setMpg)}
                  disabled={isSaving}
                  className="block w-full min-w-0 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-500 disabled:opacity-60"
                />
                <p className="text-xs leading-5 text-slate-500">
                  {isSpanish
                    ? "WIWI usa este número para estimar cuánto te costó la gasolina en cada turno."
                    : "WIWI uses this number to estimate how much fuel each shift really cost you."}
                </p>
              </div>

              <div className="space-y-2">
                <InputLabel
                  htmlFor="settings-gas-price"
                  icon={<Fuel className="h-4 w-4 text-orange-300" />}
                >
                  {isSpanish ? "Precio de gasolina" : "Gas price"}
                </InputLabel>
                <input
                  id="settings-gas-price"
                  type="number"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  value={gasPrice}
                  onChange={(e) =>
                    updateDecimalValue(e.target.value, setGasPrice)
                  }
                  disabled={isSaving}
                  className="block w-full min-w-0 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-500 disabled:opacity-60"
                />
                <p className="text-xs leading-5 text-slate-500">
                  {isSpanish
                    ? "Actualízalo cuando cambie el precio local para que tus resultados se mantengan honestos."
                    : "Update this when local gas prices change so your results stay honest."}
                </p>
              </div>

              <div className="space-y-2">
                <InputLabel
                  htmlFor="settings-weekly-goal"
                  icon={<Target className="h-4 w-4 text-emerald-300" />}
                >
                  {isSpanish ? "Meta semanal" : "Weekly goal"}
                </InputLabel>
                <input
                  id="settings-weekly-goal"
                  type="number"
                  step="1"
                  min="0"
                  inputMode="decimal"
                  value={weeklyGoal}
                  onChange={(e) =>
                    updateDecimalValue(e.target.value, setWeeklyGoal)
                  }
                  disabled={isSaving}
                  className="block w-full min-w-0 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-500 disabled:opacity-60"
                />
                <p className="text-xs leading-5 text-slate-500">
                  {isSpanish
                    ? "Tu panel usará esta meta para mostrar cuánto te falta para cerrar la semana."
                    : "Your dashboard uses this to show how far you are from closing out the week."}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 disabled:opacity-60"
              >
                <Sparkles className="h-4 w-4" />
                <span>
                  {isSaving
                    ? isSpanish
                      ? "Guardando..."
                      : "Saving..."
                    : isSpanish
                      ? "Guardar ajustes"
                      : "Save settings"}
                </span>
              </button>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-white"
              >
                {isSpanish ? "Cancelar" : "Cancel"}
              </Link>
            </div>
          </Panel>

          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Panel>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Globe className="h-4 w-4 text-sky-400" />
                <span>{isSpanish ? "Idioma" : "Language"}</span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                {isSpanish
                  ? "Cambia el idioma de WIWI. Se guarda automaticamente en tu perfil."
                  : "Change WIWI's language. This saves automatically to your profile."}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  disabled={isSaving}
                  className={cx(
                    "rounded-2xl border px-4 py-3 text-sm font-semibold transition disabled:opacity-60",
                    language === "en"
                      ? "border-sky-400 bg-sky-500 text-black"
                      : "border-slate-700 bg-slate-950 text-white hover:border-sky-500/40"
                  )}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("es")}
                  disabled={isSaving}
                  className={cx(
                    "rounded-2xl border px-4 py-3 text-sm font-semibold transition disabled:opacity-60",
                    language === "es"
                      ? "border-sky-400 bg-sky-500 text-black"
                      : "border-slate-700 bg-slate-950 text-white hover:border-sky-500/40"
                  )}
                >
                  Espanol
                </button>
              </div>
            </Panel>

            {showProPreview ? (
            <Panel className="relative overflow-hidden border-sky-500/20">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_45%)]" />
              <div className="relative">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Crown className="h-4 w-4 text-sky-400" />
                  <span>{isSpanish ? "Plan" : "Plan"}</span>
                </div>

                <p className="mt-4 text-xs uppercase tracking-[0.24em] text-sky-300">
                  {isSpanish ? "Estado actual" : "Current status"}
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
                  {isLoadingPlan ? "..." : getPlanName(plan)}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {getPlanSummary(plan, language)}
                </p>

                <div className="mt-5 space-y-3">
                  {proPreviewFeatures.map((feature) => (
                    <div
                      key={feature.label}
                      className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3"
                    >
                      <p className="text-sm font-semibold text-white">
                        {feature.label}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/pro"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
                >
                  <span>{isSpanish ? "Ver WIWI Pro" : "View WIWI Pro"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Panel>
            ) : null}

            <Panel className="relative overflow-hidden border-sky-500/20">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_48%)]" />
              <div className="relative">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <BookOpen className="h-4 w-4 text-sky-400" />
                  <span>{isSpanish ? "Ayuda y tutorial" : "Help and tutorial"}</span>
                </div>

                <h2 className="mt-4 text-xl font-black tracking-tight text-white">
                  {isSpanish ? "¿Necesitas una guía rápida?" : "Need a quick refresher?"}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {isSpanish
                    ? "Repite el recorrido completo de WIWI en cualquier momento. Tu información y tus turnos no cambiarán."
                    : "Replay the complete WIWI walkthrough anytime. Your settings and saved shifts will not change."}
                </p>

                <button
                  type="button"
                  onClick={openTutorial}
                  disabled={isSaving || isSigningOut || isDeletingAccount}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 disabled:opacity-60"
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>
                    {isSpanish ? "Repetir tutorial de WIWI" : "Replay WIWI tutorial"}
                  </span>
                </button>

                <div className="mt-7 border-t border-slate-800 pt-6">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    <CircleHelp className="h-4 w-4 text-sky-400" />
                    <span>{isSpanish ? "Respuestas rápidas" : "Quick answers"}</span>
                  </div>

                  <div className="mt-4 space-y-2">
                    {faqItems.map((item) => (
                      <details
                        key={item.question}
                        className="group rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 open:border-sky-500/25"
                      >
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-sm font-semibold leading-6 text-slate-200 marker:hidden">
                          <span>{item.question}</span>
                          <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-slate-500 transition group-open:rotate-180 group-open:text-sky-300" />
                        </summary>
                        <p className="mt-3 border-t border-slate-800 pt-3 text-sm leading-6 text-slate-400">
                          {item.answer}
                        </p>
                      </details>
                    ))}
                  </div>

                  <Link
                    href="/support"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
                  >
                    <LifeBuoy className="h-4 w-4" />
                    <span>{isSpanish ? "Más ayuda y soporte" : "More help and support"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Panel>

            <Panel>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <LogOut className="h-4 w-4 text-sky-400" />
                <span>{isSpanish ? "Cuenta" : "Account"}</span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                {isSpanish
                  ? "Cierra sesion desde aqui cuando uses WIWI en un telefono compartido."
                  : "Sign out here when you are using WIWI on a shared phone."}
              </p>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSaving || isSigningOut || isDeletingAccount}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-white disabled:opacity-60"
              >
                <LogOut className="h-4 w-4" />
                <span>
                  {isSigningOut
                    ? isSpanish
                      ? "Saliendo..."
                      : "Signing out..."
                    : isSpanish
                      ? "Cerrar sesion"
                      : "Sign out"}
                </span>
              </button>
            </Panel>

            <Panel>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <ShieldCheck className="h-4 w-4 text-sky-400" />
                <span>{isSpanish ? "Legal y privacidad" : "Legal and privacy"}</span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                {isSpanish
                  ? "Revisa como WIWI maneja tus datos y los terminos basicos del servicio."
                  : "Review how WIWI handles your data and the basic terms for using the service."}
              </p>

              <div className="mt-5 grid gap-3">
                <Link
                  href="/support"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-white"
                >
                  <LifeBuoy className="h-4 w-4" />
                  <span>{isSpanish ? "Ayuda y soporte" : "Help and support"}</span>
                </Link>
                <Link
                  href="/privacy"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-white"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{isSpanish ? "Politica de privacidad" : "Privacy Policy"}</span>
                </Link>
                <Link
                  href="/terms"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-white"
                >
                  <FileText className="h-4 w-4" />
                  <span>{isSpanish ? "Terminos" : "Terms"}</span>
                </Link>
              </div>
            </Panel>

            <Panel className="border-orange-500/25 bg-orange-950/10">
              <div className="flex items-center gap-2 text-sm text-orange-200">
                <AlertTriangle className="h-4 w-4" />
                <span>{isSpanish ? "Zona de riesgo" : "Danger zone"}</span>
              </div>

              <h2 className="mt-4 text-xl font-black tracking-tight text-white">
                {isSpanish ? "Borrar cuenta" : "Delete account"}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {isSpanish
                  ? "Esto borra tu cuenta WIWI, turnos guardados, perfil y ajustes. No se puede deshacer."
                  : "This deletes your WIWI account, saved shifts, profile, and settings. This cannot be undone."}
              </p>

              <label className="mt-5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {isSpanish ? "Escribe DELETE" : "Type DELETE"}
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                disabled={isSaving || isSigningOut || isDeletingAccount}
                className="mt-2 block w-full min-w-0 rounded-2xl border border-orange-500/30 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-orange-300 disabled:opacity-60"
                placeholder="DELETE"
              />

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={
                  isSaving ||
                  isSigningOut ||
                  isDeletingAccount ||
                  deleteConfirmation.trim().toUpperCase() !== "DELETE"
                }
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-orange-500/40 bg-orange-500/10 px-5 py-3 text-sm font-semibold text-orange-100 transition hover:border-orange-300/70 hover:bg-orange-500/20 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>
                  {isDeletingAccount
                    ? isSpanish
                      ? "Borrando..."
                      : "Deleting..."
                    : isSpanish
                      ? "Borrar mi cuenta"
                      : "Delete my account"}
                </span>
              </button>
            </Panel>

            <Panel>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <TrendingUp className="h-4 w-4 text-sky-400" />
                <span>{isSpanish ? "Ejemplo rápido" : "Quick example"}</span>
              </div>

              <div className="mt-5 rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                <p className="text-sm text-slate-400">
                  {isSpanish ? "Turno de ejemplo" : "Example shift"}
                </p>
                <p className="mt-2 text-4xl font-black tracking-tight text-white">
                  {formatMoney(exampleShift.net)}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {isSpanish
                    ? `${formatMoney(exampleShift.hourly)} por hora después de ${formatMoney(exampleShift.fuelCost)} en gasolina y ${formatMoney(exampleShift.taxSetAside)} apartados.`
                    : `${formatMoney(exampleShift.hourly)} per hour after ${formatMoney(exampleShift.fuelCost)} in fuel and ${formatMoney(exampleShift.taxSetAside)} set aside.`}
                </p>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
                  <span className="text-slate-400">
                    {isSpanish ? "Bruto del ejemplo" : "Example gross"}
                  </span>
                  <span className="font-semibold text-white">
                    {formatMoney(exampleShift.gross)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
                  <span className="text-slate-400">
                    {isSpanish ? "Neto del ejemplo" : "Example net"}
                  </span>
                  <span className="font-semibold text-emerald-300">
                    {formatMoney(exampleShift.net)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
                  <span className="text-slate-400">
                    {isSpanish ? "Turnos para la meta" : "Shifts to goal"}
                  </span>
                  <span className="font-semibold text-sky-300">
                    {Number.isFinite(exampleShift.shiftsToGoal) && exampleShift.shiftsToGoal > 0
                      ? exampleShift.shiftsToGoal.toFixed(1)
                      : "0.0"}
                  </span>
                </div>
              </div>
            </Panel>

            <Panel>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Target className="h-4 w-4 text-sky-400" />
                <span>{isSpanish ? "Qué cambia cada ajuste" : "What each setting changes"}</span>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <p className="text-sm font-medium text-white">
                    {isSpanish ? "Impuestos" : "Tax reserve"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {isSpanish
                      ? "Subir este porcentaje reduce la ganancia neta estimada para que tu pago real sea más conservador."
                      : "Raising this percentage lowers estimated net earnings so your real-pay view stays more conservative."}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <p className="text-sm font-medium text-white">
                    {isSpanish ? "MPG y gasolina" : "MPG and gas"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {isSpanish
                      ? "Estos valores controlan cuánto descuenta WIWI por manejo en cada turno."
                      : "These values control how much WIWI subtracts for driving on every shift."}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <p className="text-sm font-medium text-white">
                    {isSpanish ? "Meta semanal" : "Weekly goal"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {isSpanish
                      ? "Tu panel la usa para mostrar progreso, restante y ritmo semanal."
                      : "Your dashboard uses it to show progress, remaining target, and weekly pace."}
                  </p>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </WiwiShell>
    </AuthGuard>
  );
}
