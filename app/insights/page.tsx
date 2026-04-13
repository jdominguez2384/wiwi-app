"use client";

import Link from "next/link";
import { useMemo, type ReactNode } from "react";
import {
  BarChart3,
  Calendar,
  DollarSign,
  Fuel,
  History,
  Plus,
  Receipt,
  Route,
  Target,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { AuthGuard } from "../../components/AuthGuard";
import { WiwiAppNav, WiwiMobileTabs } from "../../components/WiwiAppNav";
import { WiwiShell } from "../../components/WiwiShell";
import { PageHero, Panel } from "../../components/WiwiSurface";
import { useLanguage } from "../../components/LanguageProvider";
import { useSettings } from "../../components/SettingsProvider";
import { useShifts } from "../../components/ShiftProvider";
import {
  computeShiftMetrics,
  formatDateLabel,
  getAppBreakdown,
  getBestShift,
  getShiftTotals,
  getWeeklyTotals,
} from "../../lib/shiftMetrics";
import { cx, formatMoney } from "../../lib/ui";

function InsightCard({
  icon,
  label,
  value,
  hint,
  accentClasses,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
  accentClasses: string;
}) {
  return (
    <Panel className="overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-white">
            {value}
          </p>
        </div>
        <div
          className={cx(
            "flex h-12 w-12 items-center justify-center rounded-2xl border",
            accentClasses
          )}
        >
          {icon}
        </div>
      </div>
      <p className="mt-6 text-sm leading-6 text-slate-500">{hint}</p>
    </Panel>
  );
}

export default function InsightsPage() {
  const { language, setLanguage } = useLanguage();
  const { shifts } = useShifts();
  const { settings } = useSettings();
  const isSpanish = language === "es";
  const locale = isSpanish ? "es-US" : "en-US";

  const computedShifts = useMemo(
    () => computeShiftMetrics(shifts, settings),
    [settings, shifts]
  );
  const totals = useMemo(() => getShiftTotals(computedShifts), [computedShifts]);
  const weeklyTotals = useMemo(
    () => getWeeklyTotals(computedShifts, settings.weeklyGoal),
    [computedShifts, settings.weeklyGoal]
  );
  const bestShift = useMemo(
    () => getBestShift(computedShifts),
    [computedShifts]
  );
  const appBreakdown = useMemo(
    () => getAppBreakdown(computedShifts).slice(0, 5),
    [computedShifts]
  );

  const isGoalReached =
    settings.weeklyGoal > 0 && weeklyTotals.net >= settings.weeklyGoal;

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
              <BarChart3 className="h-4 w-4 text-sky-300" />
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
                {isSpanish ? "Analisis" : "Insights"}
              </span>
            </>
          }
          title={
            isSpanish ? (
              <>
                Los numeros profundos,{" "}
                <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                  fuera del inicio
                </span>
                .
              </>
            ) : (
              <>
                The deeper numbers,{" "}
                <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                  away from Home
                </span>
                .
              </>
            )
          }
          description={
            isSpanish
              ? "Aqui vive el analisis completo: ganancias de vida, costos, mejor turno, progreso semanal y rendimiento por app."
              : "This is where the full analysis lives: lifetime earnings, costs, best shift, weekly progress, and app performance."
          }
          actions={
            <>
              <Link
                href="/history"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/80 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-white"
              >
                <History className="h-4 w-4" />
                <span>{isSpanish ? "Ver historial" : "View history"}</span>
              </Link>
              <Link
                href="/add-shift"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
              >
                <Plus className="h-4 w-4" />
                <span>{isSpanish ? "Agregar turno" : "Add shift"}</span>
              </Link>
            </>
          }
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InsightCard
            icon={<DollarSign className="h-5 w-5 text-emerald-300" />}
            label={isSpanish ? "Ganancias brutas" : "Gross earnings"}
            value={formatMoney(totals.gross)}
            hint={
              isSpanish
                ? "Total antes de gasolina, impuestos y gastos."
                : "Total before gas, taxes, and other costs."
            }
            accentClasses="border-emerald-500/20 bg-emerald-500/10"
          />
          <InsightCard
            icon={<Receipt className="h-5 w-5 text-sky-300" />}
            label={isSpanish ? "Ganancia neta" : "Estimated net"}
            value={formatMoney(totals.net)}
            hint={
              isSpanish
                ? "Lo que realmente te queda despues de costos."
                : "What you actually keep after costs."
            }
            accentClasses="border-sky-500/20 bg-sky-500/10"
          />
          <InsightCard
            icon={<TrendingUp className="h-5 w-5 text-purple-300" />}
            label={isSpanish ? "Pago real por hora" : "Real hourly pay"}
            value={formatMoney(totals.hourly)}
            hint={
              isSpanish
                ? "Promedio de vida en todos tus turnos."
                : "Your lifetime average across all recorded shifts."
            }
            accentClasses="border-purple-500/20 bg-purple-500/10"
          />
          <InsightCard
            icon={<Target className="h-5 w-5 text-orange-300" />}
            label={isSpanish ? "Impuestos apartados" : "Tax set-aside"}
            value={formatMoney(totals.taxes)}
            hint={
              isSpanish
                ? "Calculado con tu porcentaje actual."
                : "Calculated using your current tax percentage."
            }
            accentClasses="border-orange-500/20 bg-orange-500/10"
          />
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.95fr)]">
          <Panel>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                  {isSpanish ? "Meta semanal" : "Weekly goal"}
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
                  {isGoalReached
                    ? isSpanish
                      ? "Meta completada"
                      : "Goal reached"
                    : isSpanish
                      ? "Sigue empujando"
                      : "Keep pushing"}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                  {isGoalReached
                    ? isSpanish
                      ? "Tus turnos de esta semana ya superaron la meta neta que configuraste."
                      : "Your shifts this week have already pushed you past the net goal you set."
                    : isSpanish
                      ? "Usa esta vista para decidir si necesitas otro turno o si ya conviene cerrar la semana."
                      : "Use this view to decide whether you need another shift or whether this week is already worth closing out."}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 px-5 py-4">
                <p className="text-sm text-slate-400">
                  {isSpanish ? "Falta" : "Remaining"}
                </p>
                <p className="mt-2 text-3xl font-black text-white">
                  {formatMoney(weeklyTotals.remaining)}
                </p>
              </div>
            </div>
            <div className="mt-6 overflow-hidden rounded-full bg-slate-800">
              <div
                className={cx(
                  "h-4 rounded-full bg-gradient-to-r",
                  isGoalReached
                    ? "from-emerald-400 via-sky-400 to-blue-500"
                    : "from-sky-400 to-blue-500"
                )}
                style={{ width: `${weeklyTotals.progress}%` }}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
              <p className="text-slate-300">
                {isSpanish
                  ? `${weeklyTotals.progress.toFixed(0)}% de tu meta semanal completada.`
                  : `${weeklyTotals.progress.toFixed(0)}% of your weekly goal completed.`}
              </p>
              <p className="text-slate-500">
                {formatMoney(weeklyTotals.net)} / {formatMoney(settings.weeklyGoal)}
              </p>
            </div>
          </Panel>

          <Panel>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
              {isSpanish ? "Resumen rapido" : "Quick stats"}
            </p>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">
                  {isSpanish ? "Millas recorridas" : "Miles driven"}
                </span>
                <span className="font-medium text-white">
                  {totals.totalMiles.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">
                  {isSpanish ? "Gasolina estimada" : "Fuel estimate"}
                </span>
                <span className="font-medium text-white">
                  {formatMoney(totals.fuel)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">
                  {isSpanish ? "Horas trabajadas" : "Hours worked"}
                </span>
                <span className="font-medium text-white">
                  {totals.totalHours.toFixed(1)}
                </span>
              </div>
              <div className="border-t border-slate-800 pt-3">
                <span className="text-sm text-slate-300">
                  {isSpanish ? "Tus calculos actuales" : "Current assumptions"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {isSpanish ? "Impuestos" : "Tax rate"}
                  </p>
                  <p className="mt-2 text-lg font-bold text-white">
                    {(settings.taxRate * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    MPG
                  </p>
                  <p className="mt-2 text-lg font-bold text-white">
                    {settings.mpg.toFixed(1)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {isSpanish ? "Gasolina" : "Gas price"}
                  </p>
                  <p className="mt-2 text-lg font-bold text-white">
                    {formatMoney(settings.gasPrice)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {isSpanish ? "Meta" : "Goal"}
                  </p>
                  <p className="mt-2 text-lg font-bold text-white">
                    {formatMoney(settings.weeklyGoal)}
                  </p>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <Panel>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Trophy className="h-4 w-4 text-emerald-300" />
              <span>{isSpanish ? "Mejor turno" : "Best shift"}</span>
            </div>
            {bestShift ? (
              <div className="mt-5">
                <p className="truncate text-3xl font-black tracking-tight text-white" title={bestShift.appName}>
                  {bestShift.appName}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {formatDateLabel(bestShift.date, locale)}
                </p>
                <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300">
                  {isSpanish
                    ? "Este fue tu turno con mejor pago real por hora despues de gasolina e impuestos."
                    : "This was your best real hourly-paying shift after fuel and tax set-asides."}
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {isSpanish ? "Pago real" : "Real hourly"}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-sky-300">
                      {formatMoney(bestShift.hourly)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {isSpanish ? "Neto" : "Net"}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-emerald-300">
                      {formatMoney(bestShift.net)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 p-6 text-sm leading-6 text-slate-400">
                {isSpanish
                  ? "Cuando agregues turnos, aqui veras cual tuvo el mejor pago real por hora."
                  : "Once you log shifts, this area will highlight your best real hourly shift."}
              </div>
            )}
          </Panel>

          <Panel>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Route className="h-4 w-4 text-sky-300" />
              <span>{isSpanish ? "Rendimiento por app" : "App performance"}</span>
            </div>
            {appBreakdown.length === 0 ? (
              <div className="mt-5 rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 p-6 text-sm leading-6 text-slate-400">
                {isSpanish
                  ? "Agrega turnos para comparar que apps realmente te pagan mejor."
                  : "Add shifts to compare which apps really pay you best."}
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {appBreakdown.map((app) => (
                  <div
                    key={app.appName}
                    className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white" title={app.appName}>
                          {app.appName}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {isSpanish
                            ? `${app.shiftCount} turnos`
                            : `${app.shiftCount} shifts`}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:w-64">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                            {isSpanish ? "Neto" : "Net"}
                          </p>
                          <p className="mt-1 font-semibold text-emerald-300">
                            {formatMoney(app.net)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                            {isSpanish ? "Hora" : "Hourly"}
                          </p>
                          <p className="mt-1 font-semibold text-sky-300">
                            {formatMoney(app.hourly)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Panel>
            <Fuel className="h-5 w-5 text-orange-300" />
            <p className="mt-4 text-sm uppercase tracking-[0.24em] text-slate-500">
              {isSpanish ? "Costo por milla" : "Fuel per mile"}
            </p>
            <p className="mt-3 text-2xl font-black text-white">
              {formatMoney(settings.mpg > 0 ? settings.gasPrice / settings.mpg : 0)}
            </p>
          </Panel>
          <Panel>
            <Calendar className="h-5 w-5 text-sky-300" />
            <p className="mt-4 text-sm uppercase tracking-[0.24em] text-slate-500">
              {isSpanish ? "Turnos totales" : "Total shifts"}
            </p>
            <p className="mt-3 text-2xl font-black text-white">
              {computedShifts.length}
            </p>
          </Panel>
          <Panel>
            <TrendingUp className="h-5 w-5 text-emerald-300" />
            <p className="mt-4 text-sm uppercase tracking-[0.24em] text-slate-500">
              {isSpanish ? "Promedio neto" : "Average net"}
            </p>
            <p className="mt-3 text-2xl font-black text-white">
              {formatMoney(
                computedShifts.length > 0 ? totals.net / computedShifts.length : 0
              )}
            </p>
          </Panel>
        </div>
      </WiwiShell>
    </AuthGuard>
  );
}
