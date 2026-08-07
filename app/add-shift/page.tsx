"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Car,
  Clock3,
  DollarSign,
  Fuel,
  Receipt,
  Route,
  Settings2,
  Sparkles,
  StickyNote,
  Tags,
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
import { useShifts } from "../../components/ShiftProvider";
import { useSettings } from "../../components/SettingsProvider";
import { AuthGuard } from "../../components/AuthGuard";
import { useAuth } from "../../components/AuthProvider";
import { usePlan } from "../../components/PlanProvider";
import { useCostProfiles } from "../../components/CostProfileProvider";
import { createUserShift } from "../../lib/data/shifts";
import {
  getLocalDateInputValue,
  getNonNegativeNumber,
  getPositiveNumber,
  isNonNegativeDecimalInput,
} from "../../lib/shiftForm";
import { cx, formatMoney } from "../../lib/ui";
import {
  getCalculationSnapshot,
  mapShiftRow,
  type ShiftRow,
} from "../../lib/shiftRecord";

const APP_OPTIONS = [
  "DoorDash",
  "Uber Eats",
  "Uber",
  "Lyft",
  "Instacart",
  "Grubhub",
  "Spark",
  "Amazon Flex",
  "Shipt",
  "Roadie",
  "Other",
];

export default function AddShiftPage() {
  const { language, setLanguage } = useLanguage();
  const { addShift } = useShifts();
  const { settings } = useSettings();
  const { user } = useAuth();
  const { isPro } = usePlan();
  const { costProfiles } = useCostProfiles();
  const router = useRouter();
  const isSpanish = language === "es";

  const [date, setDate] = useState(() => getLocalDateInputValue());
  const [appName, setAppName] = useState("");
  const [grossEarnings, setGrossEarnings] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [milesDriven, setMilesDriven] = useState("");
  const [otherExpenses, setOtherExpenses] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const selectedProfile = isPro
    ? costProfiles.find((profile) => profile.id === selectedProfileId) ?? null
    : null;
  const calculationSettings = selectedProfile
    ? {
        taxRate: selectedProfile.taxRate,
        mpg: selectedProfile.mpg,
        gasPrice: selectedProfile.gasPrice,
        weeklyGoal: settings.weeklyGoal,
      }
    : settings;
  const grossAmount = Number(grossEarnings) || 0;
  const hoursAmount = Number(hoursWorked) || 0;
  const milesAmount = Number(milesDriven) || 0;
  const otherExpensesAmount = Number(otherExpenses) || 0;
  const fuelCost =
    calculationSettings.mpg > 0
      ? (milesAmount / calculationSettings.mpg) * calculationSettings.gasPrice
      : 0;
  const taxSetAside = grossAmount * calculationSettings.taxRate;
  const netEarnings =
    grossAmount - fuelCost - taxSetAside - otherExpensesAmount;
  const realHourlyRate = hoursAmount > 0 ? netEarnings / hoursAmount : 0;

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

    const grossValue = getNonNegativeNumber(grossEarnings);
    const hoursValue = getPositiveNumber(hoursWorked);
    const milesValue = getNonNegativeNumber(milesDriven);
    const otherExpensesValue = getNonNegativeNumber(otherExpenses);

    if (
      !date ||
      !appName ||
      grossValue === null ||
      hoursValue === null ||
      milesValue === null ||
      otherExpensesValue === null
    ) {
      setMessage(
        isSpanish
          ? "Usa valores validos: ganancias, millas y gastos no pueden ser negativos, y las horas deben ser mayores que cero."
          : "Use valid values: earnings, miles, and expenses cannot be negative, and hours must be greater than zero."
      );
      return;
    }

    setIsSaving(true);

    try {
      if (!user) {
        setMessage(
          isSpanish ? "Debes iniciar sesión." : "You must be signed in."
        );
        return;
      }

      const { data, error } = await createUserShift({
        user_id: user.id,
        shift_date: date,
        app_name: appName,
        gross_earnings: grossValue,
        hours_worked: hoursValue,
        miles_driven: milesValue,
        other_expenses: otherExpensesValue,
        ...getCalculationSnapshot(calculationSettings),
        cost_profile_id: selectedProfile?.id ?? null,
        cost_profile_name_snapshot: selectedProfile?.name ?? null,
        notes: isPro ? notes.trim() : "",
        tags: isPro
          ? Array.from(
              new Set(
                tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
              )
            ).slice(0, 10)
          : [],
      });

      if (error || !data) {
        setMessage(error?.message || "Could not save shift.");
        return;
      }

      addShift(mapShiftRow(data as ShiftRow));

      router.push("/dashboard");
    } finally {
      setIsSaving(false);
    }
  }

  const summaryTone =
    realHourlyRate >= 20
      ? "text-emerald-300"
      : realHourlyRate >= 10
        ? "text-sky-300"
        : "text-orange-300";

  return (
    <AuthGuard>
      <WiwiShell
        language={language}
        setLanguage={setLanguage}
        languageDisabled={isSaving}
        showLanguageControls={false}
        navActions={<WiwiAppNav language={language} disabled={isSaving} />}
        mobileNavigation={<WiwiMobileTabs language={language} />}
      >
        <PageHero
          eyebrowContent={
            <>
              <Sparkles className="h-4 w-4 text-sky-300" />
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
                {isSpanish ? "Agregar turno" : "Add shift"}
              </span>
            </>
          }
          title={
            isSpanish ? (
              <>
                Registra tu turno y mira si{" "}
                <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                  valió la pena
                </span>
                .
              </>
            ) : (
              <>
                Log the shift and see if it{" "}
                <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                  was worth it
                </span>
                .
              </>
            )
          }
          description={
            isSpanish
              ? "Ingresa tus números y WIWI calculará tu ganancia neta real usando tu gasolina, MPG e impuestos actuales."
              : "Enter your numbers and WIWI will calculate your real take-home earnings using your current gas price, MPG, and tax settings."
          }
          actions={
            <>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{isSpanish ? "Volver al panel" : "Back to dashboard"}</span>
              </Link>

              <Link
                href="/settings"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-white"
              >
                <Settings2 className="h-4 w-4" />
                <span>{isSpanish ? "Editar ajustes" : "Edit settings"}</span>
              </Link>
            </>
          }
        />

        {message ? <MessageBanner className="mt-6">{message}</MessageBanner> : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.95fr)]">
          <Panel>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Calendar className="h-4 w-4 text-sky-400" />
              <span>{isSpanish ? "Detalles del turno" : "Shift details"}</span>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="min-w-0 space-y-2">
                <InputLabel
                  htmlFor="shift-date"
                  icon={<Calendar className="h-4 w-4 text-sky-300" />}
                >
                  {isSpanish ? "Fecha" : "Date"}
                </InputLabel>
                <input
                  id="shift-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={isSaving}
                  className="block h-[50px] w-full max-w-full min-w-0 appearance-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-left text-white outline-none transition [color-scheme:dark] focus:border-sky-500 disabled:opacity-60 [&::-webkit-date-and-time-value]:m-0 [&::-webkit-date-and-time-value]:min-w-0 [&::-webkit-date-and-time-value]:text-left"
                />
              </div>

              <div className="min-w-0 space-y-2">
                <InputLabel
                  htmlFor="shift-app"
                  icon={<Route className="h-4 w-4 text-emerald-300" />}
                >
                  {isSpanish ? "App usada" : "App used"}
                </InputLabel>
                <select
                  id="shift-app"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  disabled={isSaving}
                  className="block w-full min-w-0 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-500 disabled:opacity-60"
                >
                  <option value="">
                    {isSpanish ? "Selecciona una app" : "Select an app"}
                  </option>
                  {APP_OPTIONS.map((app) => (
                    <option key={app} value={app}>
                      {app}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isPro && costProfiles.length > 0 ? (
              <div className="mt-6 min-w-0 space-y-2">
                <InputLabel
                  htmlFor="shift-cost-profile"
                  icon={<Car className="h-4 w-4 text-sky-300" />}
                >
                  {isSpanish ? "Perfil de costos" : "Cost profile"}
                </InputLabel>
                <select
                  id="shift-cost-profile"
                  value={selectedProfileId}
                  onChange={(event) => setSelectedProfileId(event.target.value)}
                  disabled={isSaving}
                  className="block w-full min-w-0 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-500 disabled:opacity-60"
                >
                  <option value="">
                    {isSpanish ? "Usar ajustes principales" : "Use main settings"}
                  </option>
                  {costProfiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <div className="min-w-0 space-y-2">
                <InputLabel
                  htmlFor="shift-gross-earnings"
                  icon={<DollarSign className="h-4 w-4 text-emerald-300" />}
                >
                  {isSpanish ? "Ganancias brutas" : "Gross earnings"}
                </InputLabel>
                <input
                  id="shift-gross-earnings"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  value={grossEarnings}
                  onChange={(e) => updateDecimalValue(e.target.value, setGrossEarnings)}
                  disabled={isSaving}
                  placeholder="125.50"
                  className="block w-full min-w-0 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500 disabled:opacity-60"
                />
              </div>

              <div className="min-w-0 space-y-2">
                <InputLabel
                  htmlFor="shift-hours-worked"
                  icon={<Clock3 className="h-4 w-4 text-purple-300" />}
                >
                  {isSpanish ? "Horas trabajadas" : "Hours worked"}
                </InputLabel>
                <input
                  id="shift-hours-worked"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  min="0.1"
                  value={hoursWorked}
                  onChange={(e) => updateDecimalValue(e.target.value, setHoursWorked)}
                  disabled={isSaving}
                  placeholder="4.5"
                  className="block w-full min-w-0 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500 disabled:opacity-60"
                />
                <p className="text-xs leading-5 text-slate-500">
                  {isSpanish
                    ? "Usa decimales para minutos, como 0.5 para 30 minutos."
                    : "Use decimals for minutes, like 0.5 for 30 minutes."}
                </p>
              </div>

              <div className="min-w-0 space-y-2">
                <InputLabel
                  htmlFor="shift-miles-driven"
                  icon={<Fuel className="h-4 w-4 text-orange-300" />}
                >
                  {isSpanish ? "Millas recorridas" : "Miles driven"}
                </InputLabel>
                <input
                  id="shift-miles-driven"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  min="0"
                  value={milesDriven}
                  onChange={(e) => updateDecimalValue(e.target.value, setMilesDriven)}
                  disabled={isSaving}
                  placeholder="42"
                  className="block w-full min-w-0 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500 disabled:opacity-60"
                />
              </div>

              <div className="min-w-0 space-y-2">
                <InputLabel
                  htmlFor="shift-other-expenses"
                  icon={<Receipt className="h-4 w-4 text-rose-300" />}
                >
                  {isSpanish ? "Otros gastos" : "Other expenses"}
                </InputLabel>
                <input
                  id="shift-other-expenses"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  value={otherExpenses}
                  onChange={(e) =>
                    updateDecimalValue(e.target.value, setOtherExpenses)
                  }
                  disabled={isSaving}
                  placeholder="0.00"
                  className="block w-full min-w-0 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500 disabled:opacity-60"
                />
                <p className="text-xs leading-5 text-slate-500">
                  {isSpanish
                    ? "Incluye peajes, estacionamiento u otros costos de este turno."
                    : "Include tolls, parking, or other costs from this shift."}
                </p>
              </div>
            </div>

            {isPro ? (
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div className="min-w-0 space-y-2">
                  <InputLabel
                    htmlFor="shift-notes"
                    icon={<StickyNote className="h-4 w-4 text-sky-300" />}
                  >
                    {isSpanish ? "Notas Pro" : "Pro notes"}
                  </InputLabel>
                  <textarea
                    id="shift-notes"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    maxLength={1000}
                    rows={3}
                    disabled={isSaving}
                    placeholder={
                      isSpanish
                        ? "Zona, clima, demanda o algo que quieras recordar."
                        : "Area, weather, demand, or anything worth remembering."
                    }
                    className="block w-full resize-y rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 disabled:opacity-60"
                  />
                </div>
                <div className="min-w-0 space-y-2">
                  <InputLabel
                    htmlFor="shift-tags"
                    icon={<Tags className="h-4 w-4 text-emerald-300" />}
                  >
                    {isSpanish ? "Etiquetas Pro" : "Pro tags"}
                  </InputLabel>
                  <input
                    id="shift-tags"
                    value={tags}
                    onChange={(event) => setTags(event.target.value)}
                    maxLength={500}
                    disabled={isSaving}
                    placeholder={isSpanish ? "lluvia, noche, aeropuerto" : "rain, night, airport"}
                    className="block w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 disabled:opacity-60"
                  />
                  <p className="text-xs leading-5 text-slate-500">
                    {isSpanish
                      ? "Separa hasta diez etiquetas con comas."
                      : "Separate up to ten tags with commas."}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-sm font-medium text-slate-300">
                {isSpanish
                  ? "WIWI usará estos ajustes para calcular el turno"
                  : "WIWI will use these settings to estimate the shift"}
              </p>

              {selectedProfile ? (
                <p className="mt-2 text-sm font-semibold text-sky-300">
                  {selectedProfile.name}
                </p>
              ) : null}

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {isSpanish ? "Impuestos" : "Tax rate"}
                  </p>
                  <p className="mt-2 text-lg font-bold text-white">
                    {(calculationSettings.taxRate * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    MPG
                  </p>
                  <p className="mt-2 text-lg font-bold text-white">
                    {calculationSettings.mpg.toFixed(1)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {isSpanish ? "Gasolina" : "Gas price"}
                  </p>
                  <p className="mt-2 text-lg font-bold text-white">
                    {formatMoney(calculationSettings.gasPrice)}
                  </p>
                </div>
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
                      ? "Guardar turno"
                      : "Save shift"}
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
                <span>{isSpanish ? "Resumen estimado" : "Estimated summary"}</span>
              </div>

              <div className="mt-5 rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                <p className="text-sm text-slate-400">
                  {isSpanish ? "Pago real por hora" : "Real hourly pay"}
                </p>
                <p className={cx("mt-2 text-4xl font-black tracking-tight", summaryTone)}>
                  {formatMoney(realHourlyRate)}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {hoursAmount > 0
                    ? isSpanish
                      ? "Basado en las horas y costos que acabas de ingresar."
                      : "Based on the hours and costs you just entered."
                    : isSpanish
                      ? "Agrega horas trabajadas para ver tu tarifa real."
                      : "Add hours worked to see your real rate."}
                </p>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
                  <span className="text-slate-400">
                    {isSpanish ? "Ganancias brutas" : "Gross earnings"}
                  </span>
                  <span className="font-semibold text-white">
                    {formatMoney(grossAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
                  <span className="text-slate-400">
                    {isSpanish ? "Otros gastos" : "Other expenses"}
                  </span>
                  <span className="font-semibold text-orange-300">
                    -{formatMoney(otherExpensesAmount).replace("-", "")}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
                  <span className="text-slate-400">
                    {isSpanish ? "Gasolina estimada" : "Estimated fuel"}
                  </span>
                  <span className="font-semibold text-orange-300">
                    -{formatMoney(fuelCost).replace("-", "")}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
                  <span className="text-slate-400">
                    {isSpanish ? "Impuestos apartados" : "Tax set-aside"}
                  </span>
                  <span className="font-semibold text-orange-300">
                    -{formatMoney(taxSetAside).replace("-", "")}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
                  <span className="text-slate-400">
                    {isSpanish ? "Ganancia neta" : "Estimated net"}
                  </span>
                  <span className="font-semibold text-emerald-300">
                    {formatMoney(netEarnings)}
                  </span>
                </div>
              </div>
            </Panel>

            <Panel>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Settings2 className="h-4 w-4 text-sky-400" />
                <span>{isSpanish ? "Cómo calcula WIWI" : "How WIWI calculates"}</span>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <p className="text-sm font-medium text-white">
                    {isSpanish ? "Costo de gasolina" : "Fuel cost"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {isSpanish
                      ? "Millas recorridas divididas entre tu MPG, multiplicado por tu precio actual de gasolina."
                      : "Miles driven divided by your MPG, multiplied by your current gas price."}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <p className="text-sm font-medium text-white">
                    {isSpanish ? "Impuestos apartados" : "Tax set-aside"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {isSpanish
                      ? "Un porcentaje de tus ganancias brutas usando la tasa configurada en ajustes."
                      : "A percentage of your gross earnings using the rate you set in settings."}
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
