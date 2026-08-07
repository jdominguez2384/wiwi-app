"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BarChart3,
  Calendar,
  Filter,
  History,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { AuthGuard } from "../../components/AuthGuard";
import { useAuth } from "../../components/AuthProvider";
import { WiwiAppNav, WiwiMobileTabs } from "../../components/WiwiAppNav";
import { WiwiShell } from "../../components/WiwiShell";
import { MessageBanner, PageHero, Panel } from "../../components/WiwiSurface";
import { useLanguage } from "../../components/LanguageProvider";
import { useSettings } from "../../components/SettingsProvider";
import { useShifts } from "../../components/ShiftProvider";
import { deleteUserShift } from "../../lib/data/shifts";
import {
  computeShiftMetrics,
  formatDateLabel,
  formatMonthLabel,
  getMonthKey,
} from "../../lib/shiftMetrics";
import { formatMoney } from "../../lib/ui";

export default function HistoryPage() {
  const { language, setLanguage } = useLanguage();
  const { shifts, removeShift, isLoadingShifts } = useShifts();
  const { settings, isLoadingSettings } = useSettings();
  const { user } = useAuth();
  const isSpanish = language === "es";
  const locale = isSpanish ? "es-US" : "en-US";

  const [message, setMessage] = useState("");
  const [selectedApp, setSelectedApp] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [shiftToDelete, setShiftToDelete] = useState<{
    id: string;
    appName: string;
    date: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const computedShifts = useMemo(
    () => computeShiftMetrics(shifts, settings),
    [settings, shifts]
  );

  const appOptions = useMemo(() => {
    const uniqueApps = Array.from(
      new Set(computedShifts.map((shift) => shift.appName))
    );
    return uniqueApps.sort((a, b) => a.localeCompare(b));
  }, [computedShifts]);

  const monthOptions = useMemo(() => {
    const monthCounts = new Map<string, number>();

    computedShifts.forEach((shift) => {
      const monthKey = getMonthKey(shift.date);
      monthCounts.set(monthKey, (monthCounts.get(monthKey) ?? 0) + 1);
    });

    return Array.from(monthCounts.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, count]) => ({
        key,
        label: formatMonthLabel(key, locale),
        count,
      }));
  }, [computedShifts, locale]);

  const filteredShifts = useMemo(() => {
    return computedShifts.filter((shift) => {
      const matchesApp =
        selectedApp === "all" || shift.appName === selectedApp;
      const matchesMonth =
        selectedMonth === "all" || getMonthKey(shift.date) === selectedMonth;
      return matchesApp && matchesMonth;
    });
  }, [computedShifts, selectedApp, selectedMonth]);

  const hasActiveFilters = selectedApp !== "all" || selectedMonth !== "all";

  async function confirmDeleteShift() {
    if (!shiftToDelete || !user) return;

    setIsDeleting(true);
    setMessage("");

    try {
      const { error } = await deleteUserShift(shiftToDelete.id, user.id);

      if (error) {
        setMessage(error.message);
        return;
      }

      removeShift(shiftToDelete.id);
      setShiftToDelete(null);
      setMessage(
        isSpanish ? "Turno eliminado con exito." : "Shift deleted successfully."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoadingShifts || isLoadingSettings) {
    return (
      <AuthGuard>
        <WiwiShell
          language={language}
          setLanguage={setLanguage}
          showLanguageControls={false}
          navActions={<WiwiAppNav language={language} />}
          mobileNavigation={<WiwiMobileTabs language={language} />}
        >
          <Panel>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 animate-pulse rounded-full bg-sky-400" />
              <p className="text-sm text-slate-300">
                {isSpanish ? "Cargando tus turnos..." : "Loading your shifts..."}
              </p>
            </div>
          </Panel>
        </WiwiShell>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <WiwiShell
        language={language}
        setLanguage={setLanguage}
        showLanguageControls={false}
        navActions={<WiwiAppNav language={language} disabled={isDeleting} />}
        mobileNavigation={<WiwiMobileTabs language={language} />}
      >
        <PageHero
          eyebrowContent={
            <>
              <History className="h-4 w-4 text-sky-300" />
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
                {isSpanish ? "Historial" : "History"}
              </span>
            </>
          }
          title={
            isSpanish ? (
              <>
                Encuentra cualquier turno{" "}
                <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                  sin ruido
                </span>
                .
              </>
            ) : (
              <>
                Find any shift{" "}
                <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                  without the noise
                </span>
                .
              </>
            )
          }
          description={
            isSpanish
              ? "Este espacio guarda la lista completa para que el inicio se mantenga limpio. Filtra por mes o app cuando necesites volver a un turno viejo."
              : "This screen holds the full list so Home can stay clean. Filter by month or app when you need to find an older shift."
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
                href="/insights"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/80 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-white"
              >
                <BarChart3 className="h-4 w-4" />
                <span>{isSpanish ? "Ver analisis" : "View insights"}</span>
              </Link>
            </>
          }
        />

        {message ? <MessageBanner className="mt-6">{message}</MessageBanner> : null}

        <Panel className="mt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Calendar className="h-4 w-4 text-sky-400" />
                <span>{isSpanish ? "Turnos guardados" : "Saved shifts"}</span>
              </div>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
                {isSpanish ? "Historial de turnos" : "Shift history"}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {computedShifts.length === 0
                  ? isSpanish
                    ? "Agrega turnos para empezar a crear tu historial."
                    : "Add shifts to start building your history."
                  : isSpanish
                    ? `Mostrando ${filteredShifts.length} de ${computedShifts.length} turnos.`
                    : `Showing ${filteredShifts.length} of ${computedShifts.length} shifts.`}
              </p>
            </div>

            <div className="w-full lg:w-[34rem]">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    {isSpanish ? "Filtrar por mes" : "Filter by month"}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedMonth}
                      onChange={(event) => setSelectedMonth(event.target.value)}
                      className="block w-full appearance-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-sky-500"
                    >
                      <option value="all">
                        {isSpanish ? "Todos los meses" : "All months"}
                      </option>
                      {monthOptions.map((month) => (
                        <option key={month.key} value={month.key}>
                          {month.label} ({month.count})
                        </option>
                      ))}
                    </select>
                    <Calendar className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    {isSpanish ? "Filtrar por app" : "Filter by app"}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedApp}
                      onChange={(event) => setSelectedApp(event.target.value)}
                      className="block w-full appearance-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-sky-500"
                    >
                      <option value="all">
                        {isSpanish ? "Todas las apps" : "All apps"}
                      </option>
                      {appOptions.map((app) => (
                        <option key={app} value={app}>
                          {app}
                        </option>
                      ))}
                    </select>
                    <Filter className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>
              </div>

              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMonth("all");
                    setSelectedApp("all");
                  }}
                  className="mt-3 text-sm font-medium text-sky-300 transition hover:text-sky-200"
                >
                  {isSpanish ? "Limpiar filtros" : "Clear filters"}
                </button>
              ) : null}
            </div>
          </div>

          {filteredShifts.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 p-8 text-center">
              <p className="text-base text-slate-300">
                {hasActiveFilters
                  ? isSpanish
                    ? "No encontramos turnos para esos filtros."
                    : "No shifts match those filters."
                  : isSpanish
                    ? "Todavia no hay turnos. Agrega el primero para medir si valio la pena."
                    : "No shifts yet. Add your first one to measure whether it was worth it."}
              </p>
              <Link
                href="/add-shift"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-sky-400"
              >
                <Plus className="h-4 w-4" />
                <span>{isSpanish ? "Agregar turno" : "Add shift"}</span>
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {filteredShifts.map((shift) => (
                <div
                  key={shift.id}
                  className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 transition hover:border-sky-500/30"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="min-w-0 xl:w-56">
                      <p className="truncate text-xl font-semibold text-white" title={shift.appName}>
                        {shift.appName}
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
                        {formatDateLabel(shift.date, locale)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4 xl:flex-1">
                      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          {isSpanish ? "Bruto" : "Gross"}
                        </p>
                        <p className="mt-2 font-semibold text-white">
                          {formatMoney(shift.grossEarnings)}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          {isSpanish ? "Neto" : "Net"}
                        </p>
                        <p className="mt-2 font-semibold text-emerald-300">
                          {formatMoney(shift.net)}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          {isSpanish ? "Por hora" : "Hourly"}
                        </p>
                        <p className="mt-2 font-semibold text-sky-300">
                          {formatMoney(shift.hourly)}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          {isSpanish ? "Millas" : "Miles"}
                        </p>
                        <p className="mt-2 font-semibold text-white">
                          {shift.milesDriven.toFixed(1)}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <Link
                        href={`/edit-shift/${shift.id}`}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-sky-500/40 hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                        <span>{isSpanish ? "Editar" : "Edit"}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setMessage("");
                          setShiftToDelete({
                            id: shift.id,
                            appName: shift.appName,
                            date: shift.date,
                          });
                        }}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-rose-500/40 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>{isSpanish ? "Eliminar" : "Delete"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        {shiftToDelete ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-slate-950 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.65)]">
              <p className="text-sm uppercase tracking-[0.24em] text-rose-300">
                {isSpanish ? "Eliminar turno?" : "Delete shift?"}
              </p>
              <h3 className="mt-3 text-2xl font-black tracking-tight text-white">
                {isSpanish ? "Seguro?" : "Are you sure?"}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {isSpanish
                  ? "Esta accion no se puede deshacer."
                  : "This action cannot be undone."}
              </p>
              <div className="mt-5 rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="truncate text-lg font-semibold text-white" title={shiftToDelete.appName}>
                  {shiftToDelete.appName}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {formatDateLabel(shiftToDelete.date, locale)}
                </p>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => !isDeleting && setShiftToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-white disabled:opacity-60"
                >
                  {isSpanish ? "Cancelar" : "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteShift}
                  disabled={isDeleting}
                  className="flex-1 rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:opacity-60"
                >
                  {isDeleting
                    ? isSpanish
                      ? "Eliminando..."
                      : "Deleting..."
                    : isSpanish
                      ? "Eliminar"
                      : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </WiwiShell>
    </AuthGuard>
  );
}
