"use client";

import Link from "next/link";
import { useMemo, type ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  History,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { AuthGuard } from "../../components/AuthGuard";
import { WiwiAppNav } from "../../components/WiwiAppNav";
import { WiwiShell } from "../../components/WiwiShell";
import { PageHero, Panel } from "../../components/WiwiSurface";
import { useLanguage } from "../../components/LanguageProvider";
import { useSettings } from "../../components/SettingsProvider";
import { useShifts } from "../../components/ShiftProvider";
import {
  computeShiftMetrics,
  formatDateLabel,
  getLatestShift,
  getShiftTotals,
  getWeeklyTotals,
} from "../../lib/shiftMetrics";
import { cx, formatMoney } from "../../lib/ui";

function FocusMetric({
  label,
  value,
  hint,
  icon,
  className,
}: {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
  className?: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            {label}
          </p>
          <p className={cx("mt-3 text-3xl font-black tracking-tight", className)}>
            {value}
          </p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-300">
          {icon}
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-400">{hint}</p>
    </div>
  );
}

function ActionCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-slate-800 bg-slate-950/70 p-5 transition hover:border-sky-500/40 hover:bg-slate-900/80"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-sky-300">
          {icon}
        </div>
        <ArrowRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-1 group-hover:text-sky-300" />
      </div>
      <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </Link>
  );
}

export default function DashboardPage() {
  const { language, setLanguage } = useLanguage();
  const { shifts } = useShifts();
  const { settings } = useSettings();
  const isSpanish = language === "es";
  const locale = isSpanish ? "es-US" : "en-US";

  const computedShifts = useMemo(
    () => computeShiftMetrics(shifts, settings),
    [settings, shifts]
  );
  const weeklyTotals = useMemo(
    () => getWeeklyTotals(computedShifts, settings.weeklyGoal),
    [computedShifts, settings.weeklyGoal]
  );
  const lifetimeTotals = useMemo(
    () => getShiftTotals(computedShifts),
    [computedShifts]
  );
  const latestShift = useMemo(
    () => getLatestShift(computedShifts),
    [computedShifts]
  );

  const weeklyHourly =
    weeklyTotals.totalHours > 0 ? weeklyTotals.net / weeklyTotals.totalHours : 0;
  const hasShifts = computedShifts.length > 0;
  const isGoalReached =
    settings.weeklyGoal > 0 && weeklyTotals.net >= settings.weeklyGoal;

  return (
    <AuthGuard>
      <WiwiShell
        language={language}
        setLanguage={setLanguage}
        showLanguageControls={false}
        navActions={<WiwiAppNav language={language} />}
      >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.85fr)]">
          <PageHero
            className="min-h-full"
            decoration={
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.08),transparent_55%)]" />
            }
            eyebrowContent={
              <>
                <Sparkles className="h-4 w-4 text-sky-300" />
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
                  {isSpanish ? "Inicio WIWI" : "WIWI Home"}
                </span>
              </>
            }
            title={
              isSpanish ? (
                <>
                  Tu respuesta rapida:{" "}
                  <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                    valio la pena?
                  </span>
                </>
              ) : (
                <>
                  Your quick answer:{" "}
                  <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                    was it worth it?
                  </span>
                </>
              )
            }
            description={
              hasShifts
                ? isSpanish
                  ? "Mantuvimos esta pantalla enfocada en lo que importa ahora: tu semana, tu pago real por hora y tu siguiente accion."
                  : "This screen now stays focused on what matters right now: your week, your real hourly pay, and your next move."
                : isSpanish
                  ? "Registra tu primer turno y WIWI te dira lo que realmente ganaste despues de gasolina, impuestos y tiempo."
                  : "Log your first shift and WIWI will show what you really earned after gas, taxes, and time."
            }
            actions={
              <>
                <Link
                  href="/add-shift"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isSpanish ? "Agregar turno" : "Add shift"}</span>
                </Link>
                <Link
                  href="/history"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/80 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-white"
                >
                  <History className="h-4 w-4" />
                  <span>{isSpanish ? "Ver historial" : "View history"}</span>
                </Link>
              </>
            }
          >
            <div className="grid gap-3 md:grid-cols-3">
              <FocusMetric
                label={isSpanish ? "Neto semanal" : "Weekly net"}
                value={formatMoney(weeklyTotals.net)}
                hint={
                  isSpanish
                    ? `${weeklyTotals.shiftCount} turnos esta semana`
                    : `${weeklyTotals.shiftCount} shifts this week`
                }
                icon={<Calendar className="h-5 w-5" />}
                className="text-white"
              />
              <FocusMetric
                label={isSpanish ? "Pago real" : "Real hourly"}
                value={formatMoney(weeklyHourly)}
                hint={
                  isSpanish
                    ? `${weeklyTotals.totalHours.toFixed(1)} horas registradas`
                    : `${weeklyTotals.totalHours.toFixed(1)} hours logged`
                }
                icon={<TrendingUp className="h-5 w-5" />}
                className="text-sky-300"
              />
              <FocusMetric
                label={isSpanish ? "Meta" : "Goal"}
                value={`${weeklyTotals.progress.toFixed(0)}%`}
                hint={
                  isGoalReached
                    ? isSpanish
                      ? "Meta semanal completada"
                      : "Weekly goal reached"
                    : isSpanish
                      ? `${formatMoney(weeklyTotals.remaining)} faltante`
                      : `${formatMoney(weeklyTotals.remaining)} remaining`
                }
                icon={<Target className="h-5 w-5" />}
                className={isGoalReached ? "text-emerald-300" : "text-white"}
              />
            </div>
          </PageHero>

          <Panel>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Target className="h-4 w-4 text-sky-400" />
              <span>{isSpanish ? "Enfoque de hoy" : "Today focus"}</span>
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-white">
              {hasShifts
                ? isGoalReached
                  ? isSpanish
                    ? "La semana va fuerte."
                    : "The week is looking strong."
                  : isSpanish
                    ? "Todavia hay espacio."
                    : "There is still room."
                : isSpanish
                  ? "Empieza con un turno."
                  : "Start with one shift."}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {hasShifts
                ? isGoalReached
                  ? isSpanish
                    ? "Ya alcanzaste tu meta neta. Si trabajas mas, que sea porque vale tu tiempo."
                    : "You have hit your net goal. If you work more, make sure it is worth your time."
                  : isSpanish
                    ? "Usa esta vista para decidir si necesitas otro turno o si conviene cerrar el dia."
                    : "Use this view to decide whether another shift makes sense or whether you can call it."
                : isSpanish
                  ? "Cuando agregues un turno, esta tarjeta se convierte en tu decision rapida."
                  : "Once you add a shift, this card becomes your quick decision center."}
            </p>

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
            <div className="mt-3 flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-300">
                {formatMoney(weeklyTotals.net)}
              </span>
              <span className="text-slate-500">
                {formatMoney(settings.weeklyGoal)}
              </span>
            </div>
          </Panel>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <Panel>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Calendar className="h-4 w-4 text-sky-400" />
              <span>{isSpanish ? "Ultimo turno" : "Latest shift"}</span>
            </div>
            {latestShift ? (
              <div className="mt-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="truncate text-2xl font-black tracking-tight text-white" title={latestShift.appName}>
                      {latestShift.appName}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      {formatDateLabel(latestShift.date, locale)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {isSpanish ? "Real/hora" : "Real/hour"}
                    </p>
                    <p className="mt-2 text-xl font-bold text-sky-300">
                      {formatMoney(latestShift.hourly)}
                    </p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {isSpanish ? "Neto" : "Net"}
                    </p>
                    <p className="mt-2 font-semibold text-emerald-300">
                      {formatMoney(latestShift.net)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {isSpanish ? "Millas" : "Miles"}
                    </p>
                    <p className="mt-2 font-semibold text-white">
                      {latestShift.milesDriven.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 p-6 text-sm leading-6 text-slate-400">
                {isSpanish
                  ? "No hay turnos todavia. Agrega uno para llenar esta vista con tus resultados reales."
                  : "No shifts yet. Add one to fill this view with your real results."}
              </div>
            )}
          </Panel>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3">
            <ActionCard
              href="/add-shift"
              icon={<Plus className="h-5 w-5" />}
              title={isSpanish ? "Registrar" : "Log"}
              description={
                isSpanish
                  ? "Agrega el turno que acabas de terminar."
                  : "Add the shift you just finished."
              }
            />
            <ActionCard
              href="/history"
              icon={<History className="h-5 w-5" />}
              title={isSpanish ? "Buscar" : "Find"}
              description={
                isSpanish
                  ? "Filtra por mes o app sin llenar el inicio."
                  : "Filter by month or app away from the home screen."
              }
            />
            <ActionCard
              href="/insights"
              icon={<BarChart3 className="h-5 w-5" />}
              title={isSpanish ? "Analizar" : "Analyze"}
              description={
                isSpanish
                  ? "Ve estadisticas, patrones y mejores turnos."
                  : "See deeper stats, patterns, and best shifts."
              }
            />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          {isSpanish
            ? `${computedShifts.length} turnos totales guardados. Ganancia neta de vida: ${formatMoney(lifetimeTotals.net)}.`
            : `${computedShifts.length} total shifts saved. Lifetime net: ${formatMoney(lifetimeTotals.net)}.`}
        </p>
      </WiwiShell>
    </AuthGuard>
  );
}
