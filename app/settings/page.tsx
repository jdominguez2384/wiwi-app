"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "../../components/LanguageProvider";
import { useSettings } from "../../components/SettingsProvider";
import { AuthGuard } from "../../components/AuthGuard";
import { getCurrentUser } from "../../lib/auth";
import { updateUserSettings } from "../../lib/data/settings";

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const { settings, updateSettings } = useSettings();

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

    loadUser();
  }, []);

  useEffect(() => {
    setTaxRatePercent(String(settings.taxRate * 100));
    setMpg(String(settings.mpg));
    setGasPrice(String(settings.gasPrice));
    setWeeklyGoal(String(settings.weeklyGoal));
  }, [settings]);

  async function handleSave() {
    setMessage("");

    if (!userId) {
      setMessage(
        language === "en" ? "You must be signed in." : "Debes iniciar sesión."
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
        language === "en"
          ? "Please enter valid numbers."
          : "Por favor ingresa números válidos."
      );
      return;
    }

    if (taxPercentNumber < 0 || taxPercentNumber > 100) {
      setMessage(
        language === "en"
          ? "Tax set-aside must be between 0 and 100%."
          : "El porcentaje para impuestos debe estar entre 0 y 100%."
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

      setMessage(language === "en" ? "Settings saved." : "Ajustes guardados.");
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
                {language === "en" ? "Settings" : "Ajustes"}
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
                ? "Adjust the numbers RealRate uses to estimate your results."
                : "Ajusta los números que RealRate usa para estimar tus resultados."}
            </p>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">
                  {language === "en"
                    ? "How much do you want to set aside for taxes?"
                    : "¿Cuánto quieres apartar para impuestos?"}
                </label>

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
                    className="block w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3 pr-12 disabled:opacity-60"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-zinc-500">
                    %
                  </span>
                </div>

                <p className="text-xs text-zinc-500">
                  {language === "en"
                    ? "Enter a percentage, like 20 or 25. Start with 20% if you’re unsure."
                    : "Ingresa un porcentaje, como 20 o 25. Empieza con 20% si no estás seguro."}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">
                  {language === "en" ? "Vehicle MPG" : "Millas por galón"}
                </label>
                <input
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  value={mpg}
                  onChange={(e) => setMpg(e.target.value)}
                  disabled={isSaving}
                  className="block w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3 disabled:opacity-60"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">
                  {language === "en" ? "Gas price" : "Precio de gasolina"}
                </label>
                <input
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  value={gasPrice}
                  onChange={(e) => setGasPrice(e.target.value)}
                  disabled={isSaving}
                  className="block w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3 disabled:opacity-60"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">
                  {language === "en" ? "Weekly goal" : "Meta semanal"}
                </label>
                <input
                  type="number"
                  step="1"
                  inputMode="decimal"
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(e.target.value)}
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
                  ? "Save settings"
                  : "Guardar ajustes"}
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