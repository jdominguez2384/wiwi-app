"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import {
  Calendar,
  DollarSign,
  Filter,
  Fuel,
  LogOut,
  Pencil,
  Plus,
  Receipt,
  Settings as SettingsIcon,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { WiwiShell } from "../../components/WiwiShell";
import {
  MessageBanner,
  PageHero,
  Panel,
} from "../../components/WiwiSurface";
import { useLanguage } from "../../components/LanguageProvider";
import { useShifts } from "../../components/ShiftProvider";
import { useSettings } from "../../components/SettingsProvider";
import { AuthGuard } from "../../components/AuthGuard";
import { signOut } from "../../lib/auth";
import { deleteUserShift } from "../../lib/data/shifts";
import { cx, formatMoney } from "../../lib/ui";

function formatDateLabel(date: string, locale: string) {
  const parsedDate = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return date;
  return parsedDate.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getMonthKey(date: string) {
  const [year, month] = date.split("-");
  if (!year || !month) return date;
  return `${year}-${month}`;
}

function formatMonthLabel(monthKey: string, locale: string) {
  const [year, month] = monthKey.split("-");
  const parsedDate = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(parsedDate.getTime())) return monthKey;
  return parsedDate.toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });
}

function getStartOfWeek(date: Date) {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

function getEndOfWeek(date: Date) {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

function StatCard({
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
      <p className="mt-6 text-sm text-slate-500">{hint}</p>
    </Panel>
  );
}

export default function DashboardPage() {
  const { language, setLanguage } = useLanguage();
  const { shifts, removeShift } = useShifts();
  const { settings } = useSettings();
  const router = useRouter();
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
    () =>
      shifts.map((shift) => {
        const fuelCost = (shift.milesDriven / settings.mpg) * settings.gasPrice;
        const taxAmount = shift.grossEarnings * settings.taxRate;
        const net = shift.grossEarnings - fuelCost - taxAmount;
        const hourly = shift.hoursWorked > 0 ? net / shift.hoursWorked : 0;
        return { ...shift, fuelCost, taxAmount, net, hourly };
      }),
    [settings, shifts]
  );

  const appOptions = useMemo(() => {
    const uniqueApps = Array.from(new Set(computedShifts.map((shift) => shift.appName)));
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
      const matchesApp = selectedApp === "all" || shift.appName === selectedApp;
      const matchesMonth = selectedMonth === "all" || getMonthKey(shift.date) === selectedMonth;
      return matchesApp && matchesMonth;
    });
  }, [computedShifts, selectedApp, selectedMonth]);

  const hasActiveFilters = selectedApp !== "all" || selectedMonth !== "all";

  const totals = useMemo(() => {
    const gross = computedShifts.reduce((sum, shift) => sum + shift.grossEarnings, 0);
    const fuel = computedShifts.reduce((sum, shift) => sum + shift.fuelCost, 0);
    const taxes = computedShifts.reduce((sum, shift) => sum + shift.taxAmount, 0);
    const net = computedShifts.reduce((sum, shift) => sum + shift.net, 0);
    const totalHours = computedShifts.reduce((sum, shift) => sum + shift.hoursWorked, 0);
    const totalMiles = computedShifts.reduce((sum, shift) => sum + shift.milesDriven, 0);
    const hourly = totalHours > 0 ? net / totalHours : 0;
    return { gross, fuel, taxes, net, totalHours, totalMiles, hourly };
  }, [computedShifts]);

  const weeklyTotals = useMemo(() => {
    const now = new Date();
    const startOfWeek = getStartOfWeek(now);
    const endOfWeek = getEndOfWeek(now);
    const thisWeekShifts = computedShifts.filter((shift) => {
      const shiftDate = new Date(`${shift.date}T12:00:00`);
      return shiftDate >= startOfWeek && shiftDate <= endOfWeek;
    });

    const gross = thisWeekShifts.reduce((sum, shift) => sum + shift.grossEarnings, 0);
    const net = thisWeekShifts.reduce((sum, shift) => sum + shift.net, 0);
    const miles = thisWeekShifts.reduce((sum, shift) => sum + shift.milesDriven, 0);
    const hours = thisWeekShifts.reduce((sum, shift) => sum + shift.hoursWorked, 0);
    const fuel = thisWeekShifts.reduce((sum, shift) => sum + shift.fuelCost, 0);
    const progress =
      settings.weeklyGoal > 0 ? Math.min((net / settings.weeklyGoal) * 100, 100) : 0;
    const remaining = Math.max(settings.weeklyGoal - net, 0);

    return { shiftCount: thisWeekShifts.length, gross, net, miles, hours, fuel, progress, remaining };
  }, [computedShifts, settings.weeklyGoal]);

  const bestShift = useMemo(() => {
    if (computedShifts.length === 0) return null;
    return [...computedShifts].sort((a, b) => b.hourly - a.hourly)[0];
  }, [computedShifts]);

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  async function confirmDeleteShift() {
    if (!shiftToDelete) return;
    setIsDeleting(true);
    setMessage("");
    try {
      const { error } = await deleteUserShift(shiftToDelete.id);
      if (error) {
        setMessage(error.message);
        return;
      }
      removeShift(shiftToDelete.id);
      setShiftToDelete(null);
      setMessage(isSpanish ? "Turno eliminado con exito." : "Shift deleted successfully.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AuthGuard>
      <WiwiShell
        language={language}
        setLanguage={setLanguage}
        navActions={
          <>
            <Link href="/settings" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-500/40 hover:text-white">
              <SettingsIcon className="h-4 w-4" />
              <span>{isSpanish ? "Ajustes" : "Settings"}</span>
            </Link>
            <button onClick={handleSignOut} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-500/40 hover:text-white">
              <LogOut className="h-4 w-4" />
              <span>{isSpanish ? "Cerrar sesion" : "Sign out"}</span>
            </button>
          </>
        }
      >
        {message ? <MessageBanner className="mb-6">{message}</MessageBanner> : null}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
          <PageHero
            className="min-h-full"
            decoration={<div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.08),transparent_55%)]" />}
            eyebrowContent={
              <>
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">WIWI</span>
                <span className="text-xs text-slate-300">{isSpanish ? "Tu tablero de ganancias reales" : "Your real-income dashboard"}</span>
              </>
            }
            title={isSpanish ? <>Descubre si <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">valio la pena</span> esta semana.</> : <>See if it <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">was worth it</span> this week.</>}
            description={computedShifts.length === 0 ? (isSpanish ? "Todavia no tienes turnos registrados. Agrega el primero para ver tus ganancias reales despues de gasolina, impuestos y tiempo trabajado." : "You have not logged any shifts yet. Add your first one to see your real earnings after gas, taxes, and time worked.") : (isSpanish ? "Mira tu pago real por hora, el progreso de tu meta semanal y que tan rentables fueron tus turnos mas recientes." : "Track your real hourly pay, weekly goal progress, and how profitable your most recent shifts actually were.")}
            actions={
              <>
                <Link href="/add-shift" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-sky-500/20 transition hover:bg-sky-400">
                  <Plus className="h-4 w-4" />
                  <span>{isSpanish ? "Agregar turno" : "Add shift"}</span>
                </Link>
                <Link href="/settings" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/80 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-white">
                  <SettingsIcon className="h-4 w-4" />
                  <span>{isSpanish ? "Ajustar calculos" : "Tune calculations"}</span>
                </Link>
              </>
            }
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">{isSpanish ? "Meta semanal" : "Weekly goal"}</p><p className="mt-3 text-2xl font-bold text-white">{weeklyTotals.progress.toFixed(0)}%</p><p className="mt-1 text-sm text-slate-400">{isSpanish ? `${formatMoney(weeklyTotals.net)} de ${formatMoney(settings.weeklyGoal)}` : `${formatMoney(weeklyTotals.net)} of ${formatMoney(settings.weeklyGoal)}`}</p></div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">{isSpanish ? "Promedio semanal" : "Weekly hourly"}</p><p className="mt-3 text-2xl font-bold text-sky-300">{formatMoney(weeklyTotals.hours > 0 ? weeklyTotals.net / weeklyTotals.hours : 0)}</p><p className="mt-1 text-sm text-slate-400">{isSpanish ? `${weeklyTotals.hours.toFixed(1)} horas trabajadas` : `${weeklyTotals.hours.toFixed(1)} hours worked`}</p></div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">{isSpanish ? "Apps activas" : "Apps tracked"}</p><p className="mt-3 text-2xl font-bold text-emerald-300">{appOptions.length}</p><p className="mt-1 text-sm text-slate-400">{isSpanish ? `${computedShifts.length} turnos registrados` : `${computedShifts.length} shifts logged`}</p></div>
            </div>
          </PageHero>

          <Panel>
            <div className="flex items-center gap-2 text-sm text-slate-400"><Calendar className="h-4 w-4 text-sky-400" /><span>{isSpanish ? "Resumen semanal" : "Weekly snapshot"}</span></div>
            <p className="mt-5 text-sm text-slate-400">{isSpanish ? "Ganancia neta actual" : "Current net earnings"}</p>
            <p className="mt-2 text-4xl font-black tracking-tight text-white">{formatMoney(weeklyTotals.net)}</p>
            <p className="mt-3 text-sm text-slate-300">{settings.weeklyGoal > 0 && weeklyTotals.net >= settings.weeklyGoal ? (isSpanish ? "Ya alcanzaste tu meta semanal neta." : "You have already hit your weekly net goal.") : (isSpanish ? `Te faltan ${formatMoney(weeklyTotals.remaining)} para llegar a tu meta.` : `${formatMoney(weeklyTotals.remaining)} left to hit your goal.`)}</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">{isSpanish ? "Turnos" : "Shifts"}</p><p className="mt-2 text-xl font-bold text-white">{weeklyTotals.shiftCount}</p></div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">{isSpanish ? "Millas" : "Miles"}</p><p className="mt-2 text-xl font-bold text-white">{weeklyTotals.miles.toFixed(1)}</p></div>
            </div>
          </Panel>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={<DollarSign className="h-5 w-5 text-emerald-300" />} label={isSpanish ? "Ganancias brutas" : "Gross earnings"} value={formatMoney(totals.gross)} hint={isSpanish ? "Total antes de gasolina, impuestos y gastos." : "Total before gas, taxes, and other costs."} accentClasses="border-emerald-500/20 bg-emerald-500/10" />
          <StatCard icon={<Receipt className="h-5 w-5 text-sky-300" />} label={isSpanish ? "Ganancia neta" : "Estimated net"} value={formatMoney(totals.net)} hint={isSpanish ? "Lo que realmente te queda despues de los costos." : "What you actually keep after your costs."} accentClasses="border-sky-500/20 bg-sky-500/10" />
          <StatCard icon={<TrendingUp className="h-5 w-5 text-purple-300" />} label={isSpanish ? "Pago real por hora" : "Real hourly pay"} value={formatMoney(totals.hourly)} hint={isSpanish ? "Promedio de por vida en todos tus turnos." : "Your lifetime average across all recorded shifts."} accentClasses="border-purple-500/20 bg-purple-500/10" />
          <StatCard icon={<Target className="h-5 w-5 text-orange-300" />} label={isSpanish ? "Impuestos apartados" : "Tax set-aside"} value={formatMoney(totals.taxes)} hint={isSpanish ? "Calculado con tu porcentaje actual de impuestos." : "Calculated using your current tax percentage."} accentClasses="border-orange-500/20 bg-orange-500/10" />
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.95fr)]">
          <Panel>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{isSpanish ? "Meta semanal" : "Weekly goal"}</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-white">{settings.weeklyGoal > 0 && weeklyTotals.net >= settings.weeklyGoal ? (isSpanish ? "Meta completada" : "Goal reached") : (isSpanish ? "Sigue empujando" : "Keep pushing")}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{settings.weeklyGoal > 0 && weeklyTotals.net >= settings.weeklyGoal ? (isSpanish ? "Tus turnos de esta semana ya superaron la meta neta que configuraste." : "Your shifts this week have already pushed you past the net goal you set.") : (isSpanish ? "Usa esta vista para decidir si necesitas otro turno o si ya te conviene cerrar la semana." : "Use this view to decide whether you need another shift or whether this week is already worth closing out.")}</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 px-5 py-4"><p className="text-sm text-slate-400">{isSpanish ? "Falta" : "Remaining"}</p><p className="mt-2 text-3xl font-black text-white">{formatMoney(weeklyTotals.remaining)}</p></div>
            </div>
            <div className="mt-6 overflow-hidden rounded-full bg-slate-800"><div className={cx("h-4 rounded-full bg-gradient-to-r", settings.weeklyGoal > 0 && weeklyTotals.net >= settings.weeklyGoal ? "from-emerald-400 via-sky-400 to-blue-500" : "from-sky-400 to-blue-500")} style={{ width: `${weeklyTotals.progress}%` }} /></div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm"><p className="text-slate-300">{isSpanish ? `${weeklyTotals.progress.toFixed(0)}% de tu meta semanal completada.` : `${weeklyTotals.progress.toFixed(0)}% of your weekly goal completed.`}</p><p className="text-slate-500">{formatMoney(weeklyTotals.net)} / {formatMoney(settings.weeklyGoal)}</p></div>
          </Panel>

          <Panel>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{isSpanish ? "Resumen rapido" : "Quick stats"}</p>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4"><span className="text-slate-400">{isSpanish ? "Millas recorridas" : "Miles driven"}</span><span className="font-medium text-white">{totals.totalMiles.toFixed(1)}</span></div>
              <div className="flex items-center justify-between gap-4"><span className="text-slate-400">{isSpanish ? "Gasolina estimada" : "Fuel estimate"}</span><span className="font-medium text-white">{formatMoney(totals.fuel)}</span></div>
              <div className="flex items-center justify-between gap-4"><span className="text-slate-400">{isSpanish ? "Horas trabajadas" : "Hours worked"}</span><span className="font-medium text-white">{totals.totalHours.toFixed(1)}</span></div>
              <div className="border-t border-slate-800 pt-3"><span className="text-sm text-slate-300">{isSpanish ? "Tus calculos actuales" : "Current assumptions"}</span></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">{isSpanish ? "Impuestos" : "Tax rate"}</p><p className="mt-2 text-lg font-bold text-white">{(settings.taxRate * 100).toFixed(0)}%</p></div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">MPG</p><p className="mt-2 text-lg font-bold text-white">{settings.mpg.toFixed(1)}</p></div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">{isSpanish ? "Gasolina" : "Gas price"}</p><p className="mt-2 text-lg font-bold text-white">{formatMoney(settings.gasPrice)}</p></div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">{isSpanish ? "Meta" : "Goal"}</p><p className="mt-2 text-lg font-bold text-white">{formatMoney(settings.weeklyGoal)}</p></div>
              </div>
            </div>
          </Panel>
        </div>

        <Panel className="mt-8">
          <div className="flex items-center gap-2 text-sm text-slate-400"><TrendingUp className="h-4 w-4 text-emerald-300" /><span>{isSpanish ? "Mejor turno" : "Best shift"}</span></div>
          {bestShift ? (
            <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div>
                <p className="truncate text-3xl font-black tracking-tight text-white" title={bestShift.appName}>{bestShift.appName}</p>
                <p className="mt-2 text-sm text-slate-400">{formatDateLabel(bestShift.date, locale)}</p>
                <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300">{isSpanish ? "Este fue tu turno con mejor pago real por hora despues de gasolina e impuestos." : "This was your best real hourly-paying shift after fuel and tax set-asides."}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">{isSpanish ? "Pago real" : "Real hourly"}</p><p className="mt-2 text-2xl font-bold text-sky-300">{formatMoney(bestShift.hourly)}</p></div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">{isSpanish ? "Neto" : "Net"}</p><p className="mt-2 text-2xl font-bold text-emerald-300">{formatMoney(bestShift.net)}</p></div>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 p-6 text-sm text-slate-400">{isSpanish ? "Cuando agregues turnos, aqui veras cual te dio el mejor pago real por hora." : "Once you log shifts, this area will highlight the one that paid you best in real hourly terms."}</div>
          )}
        </Panel>

        <Panel className="mt-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-400"><Calendar className="h-4 w-4 text-sky-400" /><span>{isSpanish ? "Turnos recientes" : "Recent shifts"}</span></div>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-white">{isSpanish ? "Tu historial mas reciente" : "Your most recent shift history"}</h2>
              <p className="mt-2 text-sm text-slate-400">
                {computedShifts.length === 0
                  ? isSpanish ? "Agrega turnos para empezar a crear tu historial." : "Add shifts to start building your history."
                  : isSpanish ? `Mostrando ${filteredShifts.length} de ${computedShifts.length} turnos.` : `Showing ${filteredShifts.length} of ${computedShifts.length} shifts.`}
              </p>
            </div>
            <div className="w-full md:w-[34rem]">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">{isSpanish ? "Filtrar por mes" : "Filter by month"}</label>
                  <div className="relative">
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="block w-full appearance-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-sky-500">
                      <option value="all">{isSpanish ? "Todos los meses" : "All months"}</option>
                      {monthOptions.map((month) => <option key={month.key} value={month.key}>{month.label} ({month.count})</option>)}
                    </select>
                    <Calendar className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">{isSpanish ? "Filtrar por app" : "Filter by app"}</label>
                  <div className="relative">
                    <select value={selectedApp} onChange={(e) => setSelectedApp(e.target.value)} className="block w-full appearance-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-sky-500">
                      <option value="all">{isSpanish ? "Todas las apps" : "All apps"}</option>
                      {appOptions.map((app) => <option key={app} value={app}>{app}</option>)}
                    </select>
                    <Filter className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>
              </div>
              {hasActiveFilters ? (
                <button onClick={() => { setSelectedMonth("all"); setSelectedApp("all"); }} className="mt-3 text-sm font-medium text-sky-300 transition hover:text-sky-200">
                  {isSpanish ? "Limpiar filtros" : "Clear filters"}
                </button>
              ) : null}
            </div>
          </div>
          {filteredShifts.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 p-8 text-center">
              <p className="text-base text-slate-300">{hasActiveFilters ? (isSpanish ? "No encontramos turnos para esos filtros." : "No shifts match those filters.") : (isSpanish ? "Todavia no hay turnos. Agrega el primero para empezar a medir si realmente valieron la pena." : "No shifts yet. Add your first one to start measuring whether your work was actually worth it.")}</p>
              <Link href="/add-shift" className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-sky-400"><Plus className="h-4 w-4" /><span>{isSpanish ? "Agregar turno" : "Add shift"}</span></Link>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {filteredShifts.map((shift) => (
                <div key={shift.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 transition hover:border-sky-500/30">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="min-w-0 xl:w-56">
                      <p className="truncate text-xl font-semibold text-white" title={shift.appName}>{shift.appName}</p>
                      <p className="mt-2 text-sm text-slate-400">{formatDateLabel(shift.date, locale)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4 xl:flex-1">
                      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">{isSpanish ? "Bruto" : "Gross"}</p><p className="mt-2 font-semibold text-white">{formatMoney(shift.grossEarnings)}</p></div>
                      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">{isSpanish ? "Neto" : "Net"}</p><p className="mt-2 font-semibold text-emerald-300">{formatMoney(shift.net)}</p></div>
                      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">{isSpanish ? "Por hora" : "Hourly"}</p><p className="mt-2 font-semibold text-sky-300">{formatMoney(shift.hourly)}</p></div>
                      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">{isSpanish ? "Millas" : "Miles"}</p><p className="mt-2 font-semibold text-white">{shift.milesDriven.toFixed(1)}</p></div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Link href={`/edit-shift/${shift.id}`} className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-sky-500/40 hover:text-white"><Pencil className="h-4 w-4" /><span>{isSpanish ? "Editar" : "Edit"}</span></Link>
                      <button onClick={() => { setMessage(""); setShiftToDelete({ id: shift.id, appName: shift.appName, date: shift.date }); }} className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-rose-500/40 hover:text-white"><Trash2 className="h-4 w-4" /><span>{isSpanish ? "Eliminar" : "Delete"}</span></button>
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
              <p className="text-sm uppercase tracking-[0.24em] text-rose-300">{language === "en" ? "Delete shift?" : "Eliminar turno?"}</p>
              <h3 className="mt-3 text-2xl font-black tracking-tight text-white">{isSpanish ? "Seguro?" : "Are you sure?"}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{language === "en" ? "This action cannot be undone." : "Esta accion no se puede deshacer."}</p>
              <div className="mt-5 rounded-3xl border border-slate-800 bg-slate-900/70 p-4"><p className="truncate text-lg font-semibold text-white" title={shiftToDelete.appName}>{shiftToDelete.appName}</p><p className="mt-2 text-sm text-slate-400">{formatDateLabel(shiftToDelete.date, locale)}</p></div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => !isDeleting && setShiftToDelete(null)} disabled={isDeleting} className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-white disabled:opacity-60">{isSpanish ? "Cancelar" : "Cancel"}</button>
                <button onClick={confirmDeleteShift} disabled={isDeleting} className="flex-1 rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:opacity-60">{isDeleting ? (isSpanish ? "Eliminando..." : "Deleting...") : (isSpanish ? "Eliminar" : "Delete")}</button>
              </div>
            </div>
          </div>
        ) : null}
      </WiwiShell>
    </AuthGuard>
  );
}
