"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarRange,
  Download,
  FileSpreadsheet,
  Gauge,
  Route,
  Target,
  Trophy,
} from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { useSettings } from "./SettingsProvider";
import { useShifts } from "./ShiftProvider";
import { MessageBanner, Panel } from "./WiwiSurface";
import {
  filterShiftsByPeriod,
  getGoalForecast,
  getMonthlyTrend,
  getMostProfitableApp,
  getPeriodComparison,
  getWeekdayPerformance,
  type ProPeriod,
} from "../lib/proAnalytics";
import {
  canShareNativeFile,
  shareNativeBase64File,
  shareNativeTextFile,
} from "../lib/nativeFiles";
import { createShiftPdfBase64, downloadShiftPdf } from "../lib/proPdf";
import { buildShiftCsv } from "../lib/proReports";
import { computeShiftMetrics } from "../lib/shiftMetrics";
import { cx, formatMoney } from "../lib/ui";

const PERIOD_OPTIONS: Array<{
  value: ProPeriod;
  en: string;
  es: string;
}> = [
  { value: "30d", en: "Last 30 days", es: "Ultimos 30 dias" },
  { value: "90d", en: "Last 90 days", es: "Ultimos 90 dias" },
  { value: "365d", en: "Last 12 months", es: "Ultimos 12 meses" },
  { value: "all", en: "All time", es: "Todo el tiempo" },
];

function ChangeBadge({
  value,
  language,
}: {
  value: number | null;
  language: "en" | "es";
}) {
  if (value === null) {
    return (
      <span className="text-xs text-slate-500">
        {language === "es" ? "Sin comparacion" : "No comparison yet"}
      </span>
    );
  }

  const isPositive = value >= 0;
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        isPositive
          ? "bg-emerald-500/10 text-emerald-300"
          : "bg-orange-500/10 text-orange-300"
      )}
    >
      {isPositive ? (
        <ArrowUpRight className="h-3.5 w-3.5" />
      ) : (
        <ArrowDownRight className="h-3.5 w-3.5" />
      )}
      {Math.abs(value).toFixed(0)}%
    </span>
  );
}

export function ProWorkspace() {
  const { language } = useLanguage();
  const { settings } = useSettings();
  const { shifts } = useShifts();
  const [period, setPeriod] = useState<ProPeriod>("30d");
  const [exportMessage, setExportMessage] = useState("");
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const isSpanish = language === "es";
  const locale = isSpanish ? "es-US" : "en-US";

  const computedShifts = useMemo(
    () => computeShiftMetrics(shifts, settings),
    [settings, shifts]
  );
  const periodShifts = useMemo(
    () => filterShiftsByPeriod(computedShifts, period),
    [computedShifts, period]
  );
  const comparison = useMemo(
    () => getPeriodComparison(computedShifts, period),
    [computedShifts, period]
  );
  const monthlyTrend = useMemo(
    () => getMonthlyTrend(computedShifts, 6),
    [computedShifts]
  );
  const weekdays = useMemo(
    () => getWeekdayPerformance(periodShifts),
    [periodShifts]
  );
  const forecast = useMemo(
    () => getGoalForecast(computedShifts, settings.weeklyGoal),
    [computedShifts, settings.weeklyGoal]
  );
  const bestApp = useMemo(
    () => getMostProfitableApp(periodShifts),
    [periodShifts]
  );
  const highestMonth = Math.max(...monthlyTrend.map((month) => month.net), 1);
  const highestWeekday = Math.max(...weekdays.map((day) => day.hourly), 1);
  const reportDate = new Date().toISOString().slice(0, 10);
  const periodLabel = PERIOD_OPTIONS.find((option) => option.value === period);

  async function downloadCsv() {
    const csv = buildShiftCsv(periodShifts, language);
    const filename = `wiwi-${period}-${reportDate}.csv`;

    try {
      if (canShareNativeFile()) {
        await shareNativeTextFile(
          csv,
          filename,
          isSpanish ? "Compartir reporte WIWI" : "Share WIWI report"
        );
        setExportMessage(
          isSpanish ? "Reporte CSV listo para compartir." : "CSV report ready to share."
        );
        return;
      }

      const url = URL.createObjectURL(
        new Blob([csv], { type: "text/csv;charset=utf-8" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setExportMessage(
        isSpanish ? "Reporte CSV descargado." : "CSV report downloaded."
      );
    } catch (error) {
      console.error("Failed to create CSV report", error);
      setExportMessage(
        isSpanish
          ? "No pudimos preparar el CSV. Intentalo de nuevo."
          : "We could not prepare the CSV. Please try again."
      );
    }
  }

  async function downloadPdf() {
    setIsExportingPdf(true);
    setExportMessage("");

    try {
      const filename = `wiwi-${period}-${reportDate}.pdf`;
      if (canShareNativeFile()) {
        const base64 = await createShiftPdfBase64(periodShifts, language);
        await shareNativeBase64File(
          base64,
          filename,
          isSpanish ? "Compartir reporte WIWI" : "Share WIWI report"
        );
      } else {
        await downloadShiftPdf(periodShifts, language, filename);
      }
      setExportMessage(
        canShareNativeFile()
          ? isSpanish
            ? "Reporte PDF listo para compartir."
            : "PDF report ready to share."
          : isSpanish
            ? "Reporte PDF descargado."
            : "PDF report downloaded."
      );
    } catch (error) {
      console.error("Failed to create PDF report", error);
      setExportMessage(
        isSpanish
          ? "No pudimos crear el PDF. Intentalo de nuevo."
          : "We could not create the PDF. Please try again."
      );
    } finally {
      setIsExportingPdf(false);
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <Panel className="relative overflow-hidden border-sky-500/20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_42%)]" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-sky-300">
              <BarChart3 className="h-4 w-4" />
              <span>{isSpanish ? "Centro Pro" : "Pro workspace"}</span>
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
              {isSpanish ? "Decisiones, no solo totales." : "Decisions, not just totals."}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              {isSpanish
                ? "Compara periodos, encuentra tus mejores patrones y calcula lo que falta para llegar a tu meta."
                : "Compare periods, find your strongest patterns, and calculate what remains to reach your goal."}
            </p>
          </div>
          <label className="block min-w-56 text-sm text-slate-400">
            <span className="mb-2 block">
              {isSpanish ? "Periodo de analisis" : "Analysis period"}
            </span>
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value as ProPeriod)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-sky-400"
            >
              {PERIOD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option[language]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Panel>
          <CalendarRange className="h-5 w-5 text-sky-300" />
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">
            {isSpanish ? "Neto del periodo" : "Period net"}
          </p>
          <p className="mt-3 text-3xl font-black text-white">
            {formatMoney(comparison.current.net)}
          </p>
          <div className="mt-4">
            <ChangeBadge value={comparison.netChangePercent} language={language} />
          </div>
        </Panel>
        <Panel>
          <Gauge className="h-5 w-5 text-emerald-300" />
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">
            {isSpanish ? "Pago real por hora" : "Real hourly pay"}
          </p>
          <p className="mt-3 text-3xl font-black text-white">
            {formatMoney(comparison.current.hourly)}
          </p>
          <div className="mt-4">
            <ChangeBadge
              value={comparison.hourlyChangePercent}
              language={language}
            />
          </div>
        </Panel>
        <Panel>
          <Route className="h-5 w-5 text-orange-300" />
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">
            {isSpanish ? "Turnos" : "Shifts"}
          </p>
          <p className="mt-3 text-3xl font-black text-white">
            {comparison.currentShiftCount}
          </p>
          <p className="mt-4 text-xs text-slate-500">
            {periodLabel?.[language]}
          </p>
        </Panel>
        <Panel>
          <Trophy className="h-5 w-5 text-amber-300" />
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">
            {isSpanish ? "App mas rentable" : "Most profitable app"}
          </p>
          <p className="mt-3 truncate text-2xl font-black text-white" title={bestApp?.appName}>
            {bestApp?.appName ?? "-"}
          </p>
          <p className="mt-4 text-xs text-slate-500">
            {bestApp ? `${formatMoney(bestApp.hourly)} / hr` : ""}
          </p>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <Panel>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <BarChart3 className="h-4 w-4 text-sky-300" />
            <span>{isSpanish ? "Tendencia de seis meses" : "Six-month trend"}</span>
          </div>
          <div className="mt-6 grid h-64 grid-cols-6 items-end gap-2 sm:gap-4">
            {monthlyTrend.map((month) => {
              const height = Math.max((month.net / highestMonth) * 100, month.net > 0 ? 8 : 2);
              return (
                <div key={month.key} className="flex h-full min-w-0 flex-col justify-end">
                  <p className="mb-2 truncate text-center text-[0.65rem] font-semibold text-slate-400">
                    {month.net > 0 ? formatMoney(month.net) : "-"}
                  </p>
                  <div className="flex h-44 items-end overflow-hidden rounded-t-xl bg-slate-900">
                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-blue-600 to-sky-300"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <p className="mt-2 truncate text-center text-[0.68rem] uppercase text-slate-500">
                    {month.date.toLocaleDateString(locale, { month: "short" })}
                  </p>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel className="border-emerald-500/20 bg-emerald-950/10">
          <div className="flex items-center gap-2 text-sm text-emerald-200">
            <Target className="h-4 w-4" />
            <span>{isSpanish ? "Pronostico de meta" : "Goal forecast"}</span>
          </div>
          <p className="mt-5 text-xs uppercase tracking-[0.2em] text-slate-500">
            {isSpanish ? "Falta esta semana" : "Remaining this week"}
          </p>
          <p className="mt-3 text-4xl font-black text-white">
            {formatMoney(forecast.remaining)}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs text-slate-500">
                {isSpanish ? "Turnos estimados" : "Estimated shifts"}
              </p>
              <p className="mt-2 text-2xl font-bold text-white">
                {forecast.estimatedShiftsRemaining ?? "-"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs text-slate-500">
                {isSpanish ? "Horas estimadas" : "Estimated hours"}
              </p>
              <p className="mt-2 text-2xl font-bold text-white">
                {forecast.estimatedHoursRemaining?.toFixed(1) ?? "-"}
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            {isSpanish
              ? `Ritmo necesario: ${formatMoney(forecast.dailyPaceNeeded)} por dia. Confianza ${forecast.confidence}.`
              : `Needed pace: ${formatMoney(forecast.dailyPaceNeeded)} per day. ${forecast.confidence} confidence.`}
          </p>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
        <Panel>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <CalendarRange className="h-4 w-4 text-sky-300" />
            <span>{isSpanish ? "Mejores dias" : "Best weekdays"}</span>
          </div>
          <div className="mt-6 space-y-3">
            {weekdays.map((day) => {
              const dayDate = new Date(2026, 7, 2 + day.dayIndex);
              const width = Math.max((day.hourly / highestWeekday) * 100, 2);
              return (
                <div key={day.dayIndex} className="grid grid-cols-[5rem_minmax(0,1fr)_4.5rem] items-center gap-3">
                  <span className="text-sm text-slate-400">
                    {dayDate.toLocaleDateString(locale, { weekday: "short" })}
                  </span>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="text-right text-sm font-semibold text-white">
                    {formatMoney(day.hourly)}
                  </span>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel className="border-sky-500/20">
          <div className="flex items-center gap-2 text-sm text-sky-300">
            <FileSpreadsheet className="h-4 w-4" />
            <span>{isSpanish ? "Centro de reportes" : "Report center"}</span>
          </div>
          <h3 className="mt-4 text-2xl font-black text-white">
            {isSpanish ? "Tus numeros, portatiles." : "Your numbers, portable."}
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            {isSpanish
              ? "Descarga los turnos del periodo seleccionado para tus registros y planeacion."
              : "Download the selected period's shifts for your records and planning."}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <button
              type="button"
              onClick={() => void downloadCsv()}
              disabled={periodShifts.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:border-sky-400 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              CSV
            </button>
            <button
              type="button"
              onClick={() => void downloadPdf()}
              disabled={periodShifts.length === 0 || isExportingPdf}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {isExportingPdf ? (isSpanish ? "Creando..." : "Creating...") : "PDF"}
            </button>
          </div>
          {exportMessage ? (
            <MessageBanner className="mt-4">{exportMessage}</MessageBanner>
          ) : null}
          <p className="mt-5 text-xs leading-5 text-slate-600">
            {isSpanish
              ? "Estimaciones para planeacion; no constituyen asesoria fiscal, legal ni financiera."
              : "Planning estimates only; not tax, legal, or financial advice."}
          </p>
        </Panel>
      </div>
    </div>
  );
}
