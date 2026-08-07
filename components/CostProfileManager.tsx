"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Car,
  Crown,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useCostProfiles } from "./CostProfileProvider";
import { useLanguage } from "./LanguageProvider";
import { usePlan } from "./PlanProvider";
import { InputLabel, MessageBanner, Panel } from "./WiwiSurface";
import {
  createCostProfile,
  deleteCostProfile,
  updateCostProfile as saveCostProfile,
} from "../lib/data/costProfiles";
import {
  mapCostProfileRow,
  type CostProfileRow,
} from "../lib/costProfiles";
import type { CostProfile } from "../lib/domain";
import {
  getNonNegativeNumber,
  getPositiveNumber,
  isNonNegativeDecimalInput,
} from "../lib/shiftForm";
import { formatMoney } from "../lib/ui";

const EMPTY_FORM = {
  name: "",
  taxPercent: "20",
  mpg: "27",
  gasPrice: "3.45",
};

export function CostProfileManager() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { isPro } = usePlan();
  const {
    costProfiles,
    isLoadingCostProfiles,
    costProfilesError,
    addCostProfile,
    updateCostProfile,
    removeCostProfile,
  } = useCostProfiles();
  const isSpanish = language === "es";
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function setDecimalField(
    field: "taxPercent" | "mpg" | "gasPrice",
    value: string
  ) {
    if (isNonNegativeDecimalInput(value)) {
      setForm((current) => ({ ...current, [field]: value }));
    }
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function beginEdit(profile: CostProfile) {
    setEditingId(profile.id);
    setForm({
      name: profile.name,
      taxPercent: String(profile.taxRate * 100),
      mpg: String(profile.mpg),
      gasPrice: String(profile.gasPrice),
    });
    setMessage("");
  }

  async function handleSave() {
    setMessage("");
    const name = form.name.trim();
    const taxPercent = getNonNegativeNumber(form.taxPercent);
    const mpg = getPositiveNumber(form.mpg);
    const gasPrice = getNonNegativeNumber(form.gasPrice);

    if (
      !user ||
      !name ||
      name.length > 60 ||
      taxPercent === null ||
      taxPercent > 100 ||
      mpg === null ||
      gasPrice === null
    ) {
      setMessage(
        isSpanish
          ? "Revisa el nombre, impuestos, MPG y precio de gasolina."
          : "Check the name, tax reserve, MPG, and gas price."
      );
      return;
    }

    if (!editingId && costProfiles.length >= 8) {
      setMessage(
        isSpanish
          ? "Puedes guardar hasta ocho perfiles de costos."
          : "You can save up to eight cost profiles."
      );
      return;
    }

    setIsSaving(true);
    const values = {
      name,
      tax_rate: taxPercent / 100,
      mpg,
      gas_price: gasPrice,
    };

    try {
      const result = editingId
        ? await saveCostProfile(editingId, user.id, values)
        : await createCostProfile({ user_id: user.id, ...values });

      if (result.error || !result.data) {
        setMessage(
          result.error?.message ||
            (isSpanish
              ? "No pudimos guardar el perfil."
              : "We could not save the profile.")
        );
        return;
      }

      const profile = mapCostProfileRow(result.data as CostProfileRow);
      if (editingId) {
        updateCostProfile(profile);
      } else {
        addCostProfile(profile);
      }
      resetForm();
      setMessage(
        isSpanish ? "Perfil de costos guardado." : "Cost profile saved."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(profileId: string) {
    if (!user) return;
    setMessage("");
    setIsSaving(true);

    try {
      const { error } = await deleteCostProfile(profileId, user.id);
      if (error) {
        setMessage(error.message);
        return;
      }

      removeCostProfile(profileId);
      if (editingId === profileId) resetForm();
      setDeleteId(null);
      setMessage(
        isSpanish ? "Perfil de costos eliminado." : "Cost profile deleted."
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!isPro) {
    return (
      <Panel className="relative overflow-hidden border-sky-500/20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_45%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-sky-300">
              <Crown className="h-4 w-4" />
              <span>WIWI Pro</span>
            </div>
            <h2 className="mt-3 text-2xl font-black text-white">
              {isSpanish ? "Perfiles para cada vehiculo." : "A profile for every vehicle."}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              {isSpanish
                ? "Pro guarda combinaciones separadas de MPG, gasolina e impuestos para cambiar de auto sin rehacer tus ajustes."
                : "Pro saves separate MPG, fuel-price, and tax combinations so switching cars never means rebuilding your settings."}
            </p>
          </div>
          <Link
            href="/pro"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            <Crown className="h-4 w-4" />
            {isSpanish ? "Explorar Pro" : "Explore Pro"}
          </Link>
        </div>
      </Panel>
    );
  }

  return (
    <Panel className="border-sky-500/20">
      <div className="flex items-center gap-2 text-sm text-sky-300">
        <Car className="h-4 w-4" />
        <span>{isSpanish ? "Perfiles de costos Pro" : "Pro cost profiles"}</span>
      </div>
      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">
            {isSpanish ? "Cambia de vehiculo sin adivinar." : "Switch vehicles without guessing."}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            {isSpanish
              ? "Guarda hasta ocho perfiles. WIWI conserva los valores usados dentro de cada turno."
              : "Save up to eight profiles. WIWI preserves the values used inside every shift."}
          </p>
        </div>
        <span className="text-sm text-slate-500">{costProfiles.length}/8</span>
      </div>

      {message || costProfilesError ? (
        <MessageBanner className="mt-5">
          {message || costProfilesError}
        </MessageBanner>
      ) : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-white">
              {editingId
                ? isSpanish
                  ? "Editar perfil"
                  : "Edit profile"
                : isSpanish
                  ? "Nuevo perfil"
                  : "New profile"}
            </h3>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-900 hover:text-white"
                aria-label={isSpanish ? "Cancelar edicion" : "Cancel editing"}
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          <div className="mt-5 space-y-4">
            <div>
              <InputLabel htmlFor="profile-name">
                {isSpanish ? "Nombre" : "Name"}
              </InputLabel>
              <input
                id="profile-name"
                value={form.name}
                maxLength={60}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder={isSpanish ? "Ej. Honda Civic" : "Example: Honda Civic"}
                className="block w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <InputLabel htmlFor="profile-tax">
                  {isSpanish ? "Impuesto %" : "Tax %"}
                </InputLabel>
                <input
                  id="profile-tax"
                  type="number"
                  min="0"
                  max="100"
                  inputMode="decimal"
                  value={form.taxPercent}
                  onChange={(event) => setDecimalField("taxPercent", event.target.value)}
                  className="block w-full min-w-0 rounded-2xl border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <InputLabel htmlFor="profile-mpg">MPG</InputLabel>
                <input
                  id="profile-mpg"
                  type="number"
                  min="0.1"
                  inputMode="decimal"
                  value={form.mpg}
                  onChange={(event) => setDecimalField("mpg", event.target.value)}
                  className="block w-full min-w-0 rounded-2xl border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <InputLabel htmlFor="profile-gas">
                  {isSpanish ? "Gas" : "Fuel"}
                </InputLabel>
                <input
                  id="profile-gas"
                  type="number"
                  min="0"
                  inputMode="decimal"
                  value={form.gasPrice}
                  onChange={(event) => setDecimalField("gasPrice", event.target.value)}
                  className="block w-full min-w-0 rounded-2xl border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none focus:border-sky-400"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={isSaving || (!editingId && costProfiles.length >= 8)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
            >
              {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {isSaving
                ? isSpanish
                  ? "Guardando..."
                  : "Saving..."
                : editingId
                  ? isSpanish
                    ? "Guardar cambios"
                    : "Save changes"
                  : isSpanish
                    ? "Agregar perfil"
                    : "Add profile"}
            </button>
          </div>
        </div>

        <div>
          {isLoadingCostProfiles ? (
            <p className="text-sm text-slate-400">
              {isSpanish ? "Cargando perfiles..." : "Loading profiles..."}
            </p>
          ) : costProfiles.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-800 p-6 text-sm leading-6 text-slate-400">
              {isSpanish
                ? "Aun no tienes perfiles adicionales. Tus ajustes principales siguen funcionando como siempre."
                : "You do not have additional profiles yet. Your main settings still work exactly as before."}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {costProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-bold text-white" title={profile.name}>
                        {profile.name}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        {profile.mpg.toFixed(1)} MPG · {formatMoney(profile.gasPrice)} · {(profile.taxRate * 100).toFixed(0)}%
                      </p>
                    </div>
                    <Car className="h-5 w-5 shrink-0 text-sky-300" />
                  </div>
                  {deleteId === profile.id ? (
                    <div className="mt-4 rounded-2xl border border-orange-500/25 bg-orange-500/10 p-3">
                      <p className="text-xs leading-5 text-orange-100">
                        {isSpanish ? "Los turnos guardados conservaran sus calculos." : "Saved shifts will keep their calculations."}
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDeleteId(null)}
                          className="rounded-xl border border-slate-700 px-3 py-2 text-xs text-white"
                        >
                          {isSpanish ? "Cancelar" : "Cancel"}
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(profile.id)}
                          disabled={isSaving}
                          className="rounded-xl bg-orange-500 px-3 py-2 text-xs font-semibold text-slate-950 disabled:opacity-50"
                        >
                          {isSpanish ? "Eliminar" : "Delete"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => beginEdit(profile)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-white transition hover:border-sky-400"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        {isSpanish ? "Editar" : "Edit"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(profile.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-orange-400 hover:text-white"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {isSpanish ? "Eliminar" : "Delete"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
