"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Fuel,
  Percent,
  Settings as SettingsIcon,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { WiwiShell } from "../../components/WiwiShell";
import {
  InputLabel,
  MessageBanner,
  PageHero,
  Panel,
} from "../../components/WiwiSurface";
import { useLanguage } from "../../components/LanguageProvider";
import { useSettings } from "../../components/SettingsProvider";
import { AuthGuard } from "../../components/AuthGuard";
import { getCurrentUser } from "../../lib/auth";
import { updateUserSettings } from "../../lib/data/settings";
import { formatMoney } from "../../lib/ui";

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const { settings, updateSettings } = useSettings();
  const isSpanish = language === "es";

  const [userId, setUserId] = useState<string | null>(null);
  const [taxRatePercent, setTaxRatePercent] = useState("");
  const [mpg, setMpg] = useState("");
  const [gasPrice, setGasPrice] = useState("");
  const [weeklyGoal, setWeeklyGoal] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const user = await getCurrentUser();
      if (user) {
        setUserId(user.id);
      }
    }

    void loadUser();
  }, []);

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

  async function handleSave() {
    setMessage("");

    if (!userId) {
      setMessage(
        isSpanish ? "Debes iniciar sesión." : "You must be signed in."
      );
      return;
    }

    const taxPercentNumber = Number(taxRatePercent);

    if (
      Number.isNaN(taxPercentNumber) ||
      Number.isNaN(Number(mpg)) ||
      Number.isNaN(Number(gasPrice)) ||
      Number.isNaN(Number(weeklyGoal))
    ) {
      setMessage(
        isSpanish
          ? "Por favor ingresa números válidos."
          : "Please enter valid numbers."
      );
      return;
    }

    if (taxPercentNumber < 0 || taxPercentNumber > 100) {
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
        mpg: Number(mpg),
        gasPrice: Number(gasPrice),
        weeklyGoal: Number(weeklyGoal),
      };

      updateSettings(nextValues);

      const { error } = await updateUserSettings(userId, {
        tax_rate: nextValues.taxRate,
        mpg: nextValues.mpg,
        gas_price: nextValues.gasPrice,
        weekly_goal: nextValues.weeklyGoal,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage(isSpanish ? "Ajustes guardados." : "Settings saved.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AuthGuard>
      <WiwiShell
        language={language}
        setLanguage={setLanguage}
        languageDisabled={isSaving}
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
                <InputLabel icon={<Percent className="h-4 w-4 text-orange-300" />}>
                  {isSpanish
                    ? "¿Cuánto quieres apartar para impuestos?"
                    : "How much do you want to set aside for taxes?"}
                </InputLabel>

                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    inputMode="numeric"
                    value={taxRatePercent}
                    onChange={(e) => setTaxRatePercent(e.target.value)}
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
                <InputLabel icon={<Fuel className="h-4 w-4 text-sky-300" />}>
                  {isSpanish ? "Millas por galón" : "Vehicle MPG"}
                </InputLabel>
                <input
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  value={mpg}
                  onChange={(e) => setMpg(e.target.value)}
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
                <InputLabel icon={<Fuel className="h-4 w-4 text-orange-300" />}>
                  {isSpanish ? "Precio de gasolina" : "Gas price"}
                </InputLabel>
                <input
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  value={gasPrice}
                  onChange={(e) => setGasPrice(e.target.value)}
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
                <InputLabel icon={<Target className="h-4 w-4 text-emerald-300" />}>
                  {isSpanish ? "Meta semanal" : "Weekly goal"}
                </InputLabel>
                <input
                  type="number"
                  step="1"
                  inputMode="decimal"
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(e.target.value)}
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
