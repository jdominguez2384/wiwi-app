import type { AppSettings, Shift } from "./domain";

export type ShiftRow = {
  id: string;
  shift_date: string;
  app_name: string;
  gross_earnings: number | string;
  hours_worked: number | string;
  miles_driven: number | string;
  other_expenses?: number | string | null;
  tax_rate_snapshot?: number | string | null;
  mpg_snapshot?: number | string | null;
  gas_price_snapshot?: number | string | null;
  cost_profile_id?: string | null;
  cost_profile_name_snapshot?: string | null;
  notes?: string | null;
  tags?: string[] | null;
};

function optionalNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function mapShiftRow(row: ShiftRow): Shift {
  return {
    id: row.id,
    date: row.shift_date,
    appName: row.app_name,
    grossEarnings: Number(row.gross_earnings),
    hoursWorked: Number(row.hours_worked),
    milesDriven: Number(row.miles_driven),
    otherExpenses: optionalNumber(row.other_expenses) ?? 0,
    taxRateSnapshot: optionalNumber(row.tax_rate_snapshot),
    mpgSnapshot: optionalNumber(row.mpg_snapshot),
    gasPriceSnapshot: optionalNumber(row.gas_price_snapshot),
    costProfileId: row.cost_profile_id ?? null,
    costProfileNameSnapshot: row.cost_profile_name_snapshot ?? null,
    notes: row.notes ?? "",
    tags: Array.isArray(row.tags) ? row.tags : [],
  };
}

export function getCalculationSnapshot(settings: AppSettings) {
  return {
    tax_rate_snapshot: settings.taxRate,
    mpg_snapshot: settings.mpg,
    gas_price_snapshot: settings.gasPrice,
  };
}
