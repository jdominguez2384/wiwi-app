"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useLanguage } from "../../components/LanguageProvider";
import { useShifts } from "../../components/ShiftProvider";
import { useSettings } from "../../components/SettingsProvider";
import { AuthGuard } from "../../components/AuthGuard";
import { signOut } from "../../lib/auth";
import { deleteUserShift } from "../../lib/data/shifts";

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
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

export default function DashboardPage() {
  const { language, setLanguage } = useLanguage();
  const { shifts, removeShift } = useShifts();
  const { settings } = useSettings();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [selectedApp, setSelectedApp] = useState("all");
  const [shiftToDelete, setShiftToDelete] = useState<{
    id: string;
    appName: string;
    date: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const computedShifts = useMemo(() => {
    return shifts.map((shift) => {
      const fuelCost = (shift.milesDriven / settings.mpg) * settings.gasPrice;
      const taxAmount = shift.grossEarnings * settings.taxRate;
      const net = shift.grossEarnings - fuelCost - taxAmount;
      const hourly = shift.hoursWorked > 0 ? net / shift.hoursWorked : 0;

      return {
        ...shift,
        fuelCost,
        taxAmount,
        net,
        hourly,
      };
    });
  }, [shifts, settings]);

  const appOptions = useMemo(() => {
    const uniqueApps = Array.from(new Set(computedShifts.map((shift) => shift.appName)));
    return uniqueApps.sort((a, b) => a.localeCompare(b));
  }, [computedShifts]);

  const filteredShifts = useMemo(() => {
    if (selectedApp === "all") return computedShifts;
    return computedShifts.filter((shift) => shift.appName === selectedApp);
  }, [computedShifts, selectedApp]);

  const totals = useMemo(() => {
    const gross = computedShifts.reduce((sum, shift) => sum + shift.grossEarnings, 0);
    const fuel = computedShifts.reduce((sum, shift) => sum + shift.fuelCost, 0);
    const taxes = computedShifts.reduce((sum, shift) => sum + shift.taxAmount, 0);
    const net = computedShifts.reduce((sum, shift) => sum + shift.net, 0);
    const totalHours = computedShifts.reduce((sum, shift) => sum + shift.hoursWorked, 0);
    const totalMiles = computedShifts.reduce((sum, shift) => sum + shift.milesDriven, 0);
    const hourly = totalHours > 0 ? net / totalHours : 0;

    return {
      gross,
      fuel,
      taxes,
      net,
      totalHours,
      totalMiles,
      hourly,
    };
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

    return {
      shiftCount: thisWeekShifts.length,
      gross,
      net,
      miles,
      hours,
      fuel,
      progress,
      remaining,
    };
  }, [computedShifts, settings.weeklyGoal]);

  const bestShift = useMemo(() => {
    if (computedShifts.length === 0) return null;
    return [...computedShifts].sort((a, b) => b.hourly - a.hourly)[0];
  }, [computedShifts]);

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  function openDeleteModal(shift: { id: string; appName: string; date: string }) {
    setMessage("");
    setShiftToDelete(shift);
  }

  function closeDeleteModal() {
    if (isDeleting) return;
    setShiftToDelete(null);
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
      setMessage(
        language === "en" ? "Shift deleted successfully." : "Turno eliminado con éxito."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-zinc-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
            <div>
              <p className="text-sm text-zinc-500">RealRate</p>
              <h1 className="text-3xl font-semibold mt-1">
                {language === "en" ? "Dashboard" : "Panel"}
              </h1>
              <p className="text-zinc-600 mt-2">
                {language === "en"
                  ? "Your real numbers after miles, fuel, and taxes."
                  : "Tus números reales después de millas, gasolina e impuestos."}
              </p>
            </div>

            <div className="flex gap-2 flex-wrap justify-end">
              <button
                onClick={() => setLanguage("en")}
                className={`rounded-xl border px-4 py-2 ${
                  language === "en" ? "bg-black text-white" : "bg-white"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("es")}
                className={`rounded-xl border px-4 py-2 ${
                  language === "es" ? "bg-black text-white" : "bg-white"
                }`}
              >
                ES
              </button>
              <button
                onClick={handleSignOut}
                className="rounded-xl border border-zinc-300 px-4 py-2"
              >
                {language === "en" ? "Sign out" : "Cerrar sesión"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="/add-shift" className="rounded-xl bg-black text-white px-4 py-2">
              {language === "en" ? "Add Shift" : "Agregar turno"}
            </Link>
            <Link href="/settings" className="rounded-xl border border-zinc-300 px-4 py-2">
              {language === "en" ? "Settings" : "Ajustes"}
            </Link>
          </div>

          {message ? <p className="text-sm text-zinc-600 mb-4">{message}</p> : null}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-zinc-500">
                {language === "en" ? "Gross earnings" : "Ganancias brutas"}
              </p>
              <p className="text-2xl font-semibold mt-2">{formatMoney(totals.gross)}</p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-zinc-500">
                {language === "en" ? "Estimated net" : "Ganancia neta estimada"}
              </p>
              <p className="text-2xl font-semibold mt-2">{formatMoney(totals.net)}</p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-zinc-500">
                {language === "en"
                  ? "Lifetime Average Hourly Pay"
                  : "Pago promedio por hora de por vida"}
              </p>
              <p className="text-2xl font-semibold mt-2">{formatMoney(totals.hourly)}</p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-zinc-500">
                {language === "en" ? "Tax set-aside" : "Dinero apartado para impuestos"}
              </p>
              <p className="text-2xl font-semibold mt-2">{formatMoney(totals.taxes)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div>
                  <p className="text-sm text-zinc-500">
                    {language === "en" ? "Weekly goal" : "Meta semanal"}
                  </p>
                  <p className="text-2xl font-semibold mt-1">
                    {formatMoney(weeklyTotals.net)} / {formatMoney(settings.weeklyGoal)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-zinc-500">
                    {language === "en" ? "Remaining" : "Falta"}
                  </p>
                  <p className="text-xl font-semibold mt-1">
                    {formatMoney(weeklyTotals.remaining)}
                  </p>
                </div>
              </div>

              <div className="w-full h-3 bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black rounded-full"
                  style={{ width: `${weeklyTotals.progress}%` }}
                />
              </div>

              <p className="text-sm text-zinc-600 mt-3">
                {language === "en"
                  ? `${weeklyTotals.progress.toFixed(0)}% of your weekly net goal reached this week.`
                  : `${weeklyTotals.progress.toFixed(0)}% de tu meta semanal neta completada esta semana.`}
              </p>

              <p className="text-xs text-zinc-500 mt-2">
                {language === "en"
                  ? `This week's shifts: ${weeklyTotals.shiftCount}`
                  : `Turnos de esta semana: ${weeklyTotals.shiftCount}`}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-zinc-500">
                {language === "en" ? "Quick stats" : "Resumen rápido"}
              </p>

              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    {language === "en" ? "Lifetime" : "Total"}
                  </p>
                  <div className="mt-2 space-y-2 text-zinc-700">
                    <p>
                      {language === "en" ? "Miles driven" : "Millas recorridas"}:{" "}
                      <span className="font-medium">{totals.totalMiles.toFixed(1)}</span>
                    </p>
                    <p>
                      {language === "en" ? "Fuel estimate" : "Estimado de gasolina"}:{" "}
                      <span className="font-medium">{formatMoney(totals.fuel)}</span>
                    </p>
                    <p>
                      {language === "en" ? "Hours worked" : "Horas trabajadas"}:{" "}
                      <span className="font-medium">{totals.totalHours.toFixed(1)}</span>
                    </p>
                  </div>
                </div>

                <div className="border-t border-zinc-200 pt-4">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    {language === "en" ? "This week" : "Esta semana"}
                  </p>
                  <div className="mt-2 space-y-2 text-zinc-700">
                    <p>
                      {language === "en" ? "Miles driven" : "Millas recorridas"}:{" "}
                      <span className="font-medium">{weeklyTotals.miles.toFixed(1)}</span>
                    </p>
                    <p>
                      {language === "en" ? "Fuel estimate" : "Estimado de gasolina"}:{" "}
                      <span className="font-medium">{formatMoney(weeklyTotals.fuel)}</span>
                    </p>
                    <p>
                      {language === "en" ? "Hours worked" : "Horas trabajadas"}:{" "}
                      <span className="font-medium">{weeklyTotals.hours.toFixed(1)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {bestShift ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm mb-8">
              <p className="text-sm text-zinc-500">
                {language === "en" ? "Best shift" : "Mejor turno"}
              </p>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-3">
                <div>
                  <p
                    className="text-xl font-semibold truncate max-w-full md:max-w-[300px]"
                    title={bestShift.appName}
                  >
                    {bestShift.appName}
                  </p>
                  <p className="text-zinc-600 mt-1">{bestShift.date}</p>
                </div>
                <div className="text-sm text-zinc-700">
                  <p>
                    {language === "en" ? "Net" : "Neto"}:{" "}
                    <span className="font-medium">{formatMoney(bestShift.net)}</span>
                  </p>
                  <p>
                    {language === "en" ? "Hourly" : "Por hora"}:{" "}
                    <span className="font-medium">{formatMoney(bestShift.hourly)}</span>
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {language === "en" ? "Recent shifts" : "Turnos recientes"}
                </h2>
                <p className="text-sm text-zinc-500 mt-1">
                  {language === "en"
                    ? "Filter your shift history by app."
                    : "Filtra tu historial de turnos por app."}
                </p>
              </div>

              <div className="w-full md:w-72 space-y-2">
                <label className="block text-sm font-medium text-zinc-700">
                  {language === "en" ? "Filter by app" : "Filtrar por app"}
                </label>
                <select
                  value={selectedApp}
                  onChange={(e) => setSelectedApp(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-300 px-4 py-3 bg-white"
                >
                  <option value="all">
                    {language === "en" ? "All apps" : "Todas las apps"}
                  </option>
                  {appOptions.map((app) => (
                    <option key={app} value={app}>
                      {app}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredShifts.length === 0 ? (
              <p className="text-zinc-600 mt-6">
                {selectedApp === "all"
                  ? language === "en"
                    ? "No shifts yet. Add your first shift to start tracking."
                    : "Todavía no hay turnos. Agrega tu primer turno para empezar a registrar."
                  : language === "en"
                  ? "No shifts found for this app."
                  : "No se encontraron turnos para esta app."}
              </p>
            ) : (
              <div className="mt-6 space-y-3">
                {filteredShifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="rounded-xl border border-zinc-200 p-4 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4"
                  >
                    <div className="min-w-0 xl:w-56">
                      <p className="font-medium text-lg truncate" title={shift.appName}>
                        {shift.appName}
                      </p>
                      <p className="text-sm text-zinc-500 mt-1">{shift.date}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-zinc-700 xl:flex-1">
                      <div>
                        <p className="text-zinc-500">
                          {language === "en" ? "Gross" : "Bruto"}
                        </p>
                        <p className="font-medium">{formatMoney(shift.grossEarnings)}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500">
                          {language === "en" ? "Net" : "Neto"}
                        </p>
                        <p className="font-medium">{formatMoney(shift.net)}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500">
                          {language === "en" ? "Hourly" : "Por hora"}
                        </p>
                        <p className="font-medium">{formatMoney(shift.hourly)}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500">
                          {language === "en" ? "Miles" : "Millas"}
                        </p>
                        <p className="font-medium">{shift.milesDriven.toFixed(1)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <Link
                        href={`/edit-shift/${shift.id}`}
                        className="rounded-xl border border-zinc-300 px-4 py-2"
                      >
                        {language === "en" ? "Edit" : "Editar"}
                      </Link>

                      <button
                        onClick={() =>
                          openDeleteModal({
                            id: shift.id,
                            appName: shift.appName,
                            date: shift.date,
                          })
                        }
                        className="rounded-xl border border-zinc-300 px-4 py-2"
                      >
                        {language === "en" ? "Delete" : "Eliminar"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {shiftToDelete ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="text-xl font-semibold">
                {language === "en" ? "Delete shift?" : "¿Eliminar turno?"}
              </h3>

              <p className="text-zinc-600 mt-3">
                {language === "en"
                  ? "This action cannot be undone."
                  : "Esta acción no se puede deshacer."}
              </p>

              <div className="mt-4 rounded-xl border border-zinc-200 p-4">
                <p className="font-medium truncate" title={shiftToDelete.appName}>
                  {shiftToDelete.appName}
                </p>
                <p className="text-sm text-zinc-500 mt-1">{shiftToDelete.date}</p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="flex-1 rounded-xl border border-zinc-300 px-4 py-3 disabled:opacity-60"
                >
                  {language === "en" ? "Cancel" : "Cancelar"}
                </button>

                <button
                  onClick={confirmDeleteShift}
                  disabled={isDeleting}
                  className="flex-1 rounded-xl bg-black text-white px-4 py-3 disabled:opacity-60"
                >
                  {isDeleting
                    ? language === "en"
                      ? "Deleting..."
                      : "Eliminando..."
                    : language === "en"
                    ? "Delete"
                    : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </AuthGuard>
  );
}