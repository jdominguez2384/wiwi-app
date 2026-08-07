import type { AppSettings, Shift } from "./domain";

export type ComputedShift = Shift & {
  fuelCost: number;
  taxAmount: number;
  otherExpenses: number;
  net: number;
  hourly: number;
};

export type ShiftTotals = {
  gross: number;
  fuel: number;
  taxes: number;
  otherExpenses: number;
  net: number;
  totalHours: number;
  totalMiles: number;
  hourly: number;
};

export type WeeklyShiftTotals = ShiftTotals & {
  shiftCount: number;
  progress: number;
  remaining: number;
};

export type AppBreakdown = ShiftTotals & {
  appName: string;
  shiftCount: number;
};

export function computeShiftMetrics(
  shifts: Shift[],
  settings: AppSettings
): ComputedShift[] {
  return shifts.map((shift) => {
    const mpg = shift.mpgSnapshot ?? settings.mpg;
    const gasPrice = shift.gasPriceSnapshot ?? settings.gasPrice;
    const taxRate = shift.taxRateSnapshot ?? settings.taxRate;
    const fuelCost =
      mpg > 0 ? (shift.milesDriven / mpg) * gasPrice : 0;
    const taxAmount = shift.grossEarnings * taxRate;
    const otherExpenses = Math.max(shift.otherExpenses, 0);
    const net = shift.grossEarnings - fuelCost - taxAmount - otherExpenses;
    const hourly = shift.hoursWorked > 0 ? net / shift.hoursWorked : 0;

    return { ...shift, fuelCost, taxAmount, otherExpenses, net, hourly };
  });
}

export function formatDateLabel(date: string, locale: string) {
  const parsedDate = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getMonthKey(date: string) {
  const [year, month] = date.split("-");
  if (!year || !month) return date;
  return `${year}-${month}`;
}

export function formatMonthLabel(monthKey: string, locale: string) {
  const [year, month] = monthKey.split("-");
  const parsedDate = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(parsedDate.getTime())) return monthKey;

  return parsedDate.toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });
}

export function getStartOfWeek(date: Date) {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function getEndOfWeek(date: Date) {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function getShiftTotals(shifts: ComputedShift[]): ShiftTotals {
  const gross = shifts.reduce((sum, shift) => sum + shift.grossEarnings, 0);
  const fuel = shifts.reduce((sum, shift) => sum + shift.fuelCost, 0);
  const taxes = shifts.reduce((sum, shift) => sum + shift.taxAmount, 0);
  const otherExpenses = shifts.reduce(
    (sum, shift) => sum + shift.otherExpenses,
    0
  );
  const net = shifts.reduce((sum, shift) => sum + shift.net, 0);
  const totalHours = shifts.reduce((sum, shift) => sum + shift.hoursWorked, 0);
  const totalMiles = shifts.reduce((sum, shift) => sum + shift.milesDriven, 0);
  const hourly = totalHours > 0 ? net / totalHours : 0;

  return {
    gross,
    fuel,
    taxes,
    otherExpenses,
    net,
    totalHours,
    totalMiles,
    hourly,
  };
}

export function getWeeklyTotals(
  shifts: ComputedShift[],
  weeklyGoal: number,
  now = new Date()
): WeeklyShiftTotals {
  const startOfWeek = getStartOfWeek(now);
  const endOfWeek = getEndOfWeek(now);
  const thisWeekShifts = shifts.filter((shift) => {
    const shiftDate = new Date(`${shift.date}T12:00:00`);
    return shiftDate >= startOfWeek && shiftDate <= endOfWeek;
  });
  const totals = getShiftTotals(thisWeekShifts);
  const progress =
    weeklyGoal > 0 ? Math.min((totals.net / weeklyGoal) * 100, 100) : 0;
  const remaining = Math.max(weeklyGoal - totals.net, 0);

  return {
    ...totals,
    shiftCount: thisWeekShifts.length,
    progress,
    remaining,
  };
}

export function getBestShift(shifts: ComputedShift[]) {
  if (shifts.length === 0) return null;
  return [...shifts].sort((a, b) => b.hourly - a.hourly)[0];
}

export function getLatestShift(shifts: ComputedShift[]) {
  if (shifts.length === 0) return null;
  return [...shifts].sort((a, b) => b.date.localeCompare(a.date))[0];
}

export function getAppBreakdown(shifts: ComputedShift[]): AppBreakdown[] {
  const grouped = new Map<string, ComputedShift[]>();

  shifts.forEach((shift) => {
    grouped.set(shift.appName, [...(grouped.get(shift.appName) ?? []), shift]);
  });

  return Array.from(grouped.entries())
    .map(([appName, appShifts]) => ({
      appName,
      shiftCount: appShifts.length,
      ...getShiftTotals(appShifts),
    }))
    .sort((a, b) => b.net - a.net);
}
