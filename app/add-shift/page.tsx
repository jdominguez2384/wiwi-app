"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "../../components/LanguageProvider";
import { useShifts } from "../../components/ShiftProvider";
import { AuthGuard } from "../../components/AuthGuard";
import { getCurrentUser } from "../../lib/auth";
import { createUserShift } from "../../lib/data/shifts";

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
  const router = useRouter();

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [appName, setAppName] = useState("");
  const [grossEarnings, setGrossEarnings] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [milesDriven, setMilesDriven] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setMessage("");

    if (!appName || !grossEarnings || !hoursWorked || !milesDriven) {
      setMessage(
        language === "en"
          ? "Please fill out all fields."
          : "Por favor completa todos los campos."
      );
      return;
    }

    setIsSaving(true);

    try {
      const user = await getCurrentUser();

      if (!user) {
        setMessage(
          language === "en"
            ? "You must be signed in."
            : "Debes iniciar sesión."
        );
        return;
      }

      const { data, error } = await createUserShift({
        user_id: user.id,
        shift_date: date,
        app_name: appName,
        gross_earnings: Number(grossEarnings),
        hours_worked: Number(hoursWorked),
        miles_driven: Number(milesDriven),
      });

      if (error || !data) {
        setMessage(error?.message || "Could not save shift.");
        return;
      }

      addShift({
        id: data.id,
        date: data.shift_date,
        appName: data.app_name,
        grossEarnings: Number(data.gross_earnings),
        hoursWorked: Number(data.hours_worked),
        milesDriven: Number(data.miles_driven),
      });

      setMessage(
        language === "en" ? "Shift saved successfully." : "Turno guardado con éxito."
      );

      router.push("/dashboard");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-zinc-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-start mb-6 gap-4 flex-wrap">
            <div>
              <p className="text-sm text-zinc-500">RealRate</p>
              <h1 className="text-3xl font-semibold mt-1">
                {language === "en" ? "Add Shift" : "Agregar turno"}
              </h1>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setLanguage("en")}
                disabled={isSaving}
                className={`rounded-xl border px-4 py-2 ${
                  language === "en" ? "bg-black text-white" : "bg-white"
                } disabled:opacity-60`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("es")}
                disabled={isSaving}
                className={`rounded-xl border px-4 py-2 ${
                  language === "es" ? "bg-black text-white" : "bg-white"
                } disabled:opacity-60`}
              >
                ES
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <Link
              href="/dashboard"
              className="rounded-xl border border-zinc-300 px-4 py-2"
            >
              {language === "en" ? "Back to dashboard" : "Volver al panel"}
            </Link>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-zinc-600 mb-6">
              {language === "en"
                ? "Enter your shift details and see what you really made."
                : "Ingresa los detalles de tu turno y mira lo que realmente ganaste."}
            </p>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">
                  {language === "en" ? "Date" : "Fecha"}
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={isSaving}
                  className="block w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3 disabled:opacity-60"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">
                  {language === "en" ? "App used" : "App usada"}
                </label>
                <select
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  disabled={isSaving}
                  className="block w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3 bg-white disabled:opacity-60"
                >
                  <option value="">
                    {language === "en" ? "Select an app" : "Selecciona una app"}
                  </option>
                  {APP_OPTIONS.map((app) => (
                    <option key={app} value={app}>
                      {app}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">
                  {language === "en" ? "Gross earnings" : "Ganancias brutas"}
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={grossEarnings}
                  onChange={(e) => setGrossEarnings(e.target.value)}
                  disabled={isSaving}
                  className="block w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3 disabled:opacity-60"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">
                  {language === "en" ? "Hours worked" : "Horas trabajadas"}
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={hoursWorked}
                  onChange={(e) => setHoursWorked(e.target.value)}
                  disabled={isSaving}
                  className="block w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3 disabled:opacity-60"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">
                  {language === "en" ? "Miles driven" : "Millas recorridas"}
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={milesDriven}
                  onChange={(e) => setMilesDriven(e.target.value)}
                  disabled={isSaving}
                  className="block w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3 disabled:opacity-60"
                />
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="w-full rounded-xl bg-black text-white px-4 py-3 disabled:opacity-60"
              >
                {isSaving
                  ? language === "en"
                    ? "Saving..."
                    : "Guardando..."
                  : language === "en"
                  ? "Save shift"
                  : "Guardar turno"}
              </button>

              {message ? (
                <p className="text-sm text-zinc-600">{message}</p>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}