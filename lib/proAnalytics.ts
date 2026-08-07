import type { ComputedShift, ShiftTotals } from "./shiftMetrics.ts";
import {
  getAppBreakdown,
  getShiftTotals,
  getStartOfWeek,
  getWeeklyTotals,
} from "./shiftMetrics.ts";

export type ProPeriod = "30d" | "90d" | "365d" | "all";

export type PeriodComparison = {
  current: ShiftTotals;
  previous: ShiftTotals | null;
  currentShiftCount: number;
  previousShiftCount: number;
  netChangePercent: number | null;
  hourlyChangePercent: number | null;
};

export type TrendPoint = ShiftTotals & {
  key: string;
  date: Date;
  shiftCount: number;
};

export type WeekdayPerformance = ShiftTotals & {
  dayIndex: number;
  shiftCount: number;
};

export type GoalForecast = {
  currentNet: number;
  remaining: number;
  averageNetPerShift: number;
  averageHourly: number;
  estimatedShiftsRemaining: number | null;
  estimatedHoursRemaining: number | null;
  dailyPaceNeeded: number;
  daysRemaining: number;
  confidence: "low" | "medium" | "high";
};

function parseShiftDate(value: string) {
  return new Date(`${value}T12:00:00`);
}

function getStartDate(period: ProPeriod, now: Date) {
  if (period === "all") return null;

  const days = period === "30d" ? 30 : period === "90d" ? 90 : 365;
  const start = new Date(now);
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);
  return start;
}

export function filterShiftsByPeriod(
  shifts: ComputedShift[],
  period: ProPeriod,
  now = new Date()
) {
  const start = getStartDate(period, now);
  if (!start) return shifts;

  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  return shifts.filter((shift) => {
    const date = parseShiftDate(shift.date);
    return date >= start && date <= end;
  });
}

function getPercentChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function getPeriodComparison(
  shifts: ComputedShift[],
  period: ProPeriod,
  now = new Date()
): PeriodComparison {
  const currentShifts = filterShiftsByPeriod(shifts, period, now);
  const current = getShiftTotals(currentShifts);

  if (period === "all") {
    return {
      current,
      previous: null,
      currentShiftCount: currentShifts.length,
      previousShiftCount: 0,
      netChangePercent: null,
      hourlyChangePercent: null,
    };
  }

  const periodDays = period === "30d" ? 30 : period === "90d" ? 90 : 365;
  const previousEnd = new Date(now);
  previousEnd.setDate(previousEnd.getDate() - periodDays);
  previousEnd.setHours(23, 59, 59, 999);
  const previousStart = new Date(previousEnd);
  previousStart.setDate(previousStart.getDate() - (periodDays - 1));
  previousStart.setHours(0, 0, 0, 0);

  const previousShifts = shifts.filter((shift) => {
    const date = parseShiftDate(shift.date);
    return date >= previousStart && date <= previousEnd;
  });
  const previous = getShiftTotals(previousShifts);

  return {
    current,
    previous,
    currentShiftCount: currentShifts.length,
    previousShiftCount: previousShifts.length,
    netChangePercent: getPercentChange(current.net, previous.net),
    hourlyChangePercent: getPercentChange(current.hourly, previous.hourly),
  };
}

export function getMonthlyTrend(
  shifts: ComputedShift[],
  monthCount = 6,
  now = new Date()
): TrendPoint[] {
  return Array.from({ length: monthCount }, (_, index) => {
    const monthDate = new Date(
      now.getFullYear(),
      now.getMonth() - (monthCount - index - 1),
      1
    );
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const monthShifts = shifts.filter((shift) => {
      const date = parseShiftDate(shift.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });

    return {
      key: `${year}-${String(month + 1).padStart(2, "0")}`,
      date: monthDate,
      shiftCount: monthShifts.length,
      ...getShiftTotals(monthShifts),
    };
  });
}

export function getWeekdayPerformance(
  shifts: ComputedShift[]
): WeekdayPerformance[] {
  return Array.from({ length: 7 }, (_, dayIndex) => {
    const dayShifts = shifts.filter(
      (shift) => parseShiftDate(shift.date).getDay() === dayIndex
    );

    return {
      dayIndex,
      shiftCount: dayShifts.length,
      ...getShiftTotals(dayShifts),
    };
  });
}

export function getGoalForecast(
  shifts: ComputedShift[],
  weeklyGoal: number,
  now = new Date()
): GoalForecast {
  const weekly = getWeeklyTotals(shifts, weeklyGoal, now);
  const historyBeforeThisWeek = shifts.filter(
    (shift) => parseShiftDate(shift.date) < getStartOfWeek(now)
  );
  const forecastingShifts =
    historyBeforeThisWeek.length > 0 ? historyBeforeThisWeek : shifts;
  const historyTotals = getShiftTotals(forecastingShifts);
  const averageNetPerShift =
    forecastingShifts.length > 0
      ? historyTotals.net / forecastingShifts.length
      : 0;
  const averageHourly = historyTotals.hourly;
  const remaining = Math.max(weeklyGoal - weekly.net, 0);
  const mondayIndex = (now.getDay() + 6) % 7;
  const daysRemaining = Math.max(7 - mondayIndex, 1);

  return {
    currentNet: weekly.net,
    remaining,
    averageNetPerShift,
    averageHourly,
    estimatedShiftsRemaining:
      remaining === 0
        ? 0
        : averageNetPerShift > 0
          ? Math.ceil(remaining / averageNetPerShift)
          : null,
    estimatedHoursRemaining:
      remaining === 0
        ? 0
        : averageHourly > 0
          ? remaining / averageHourly
          : null,
    dailyPaceNeeded: remaining / daysRemaining,
    daysRemaining,
    confidence:
      forecastingShifts.length >= 20
        ? "high"
        : forecastingShifts.length >= 5
          ? "medium"
          : "low",
  };
}

export function getMostProfitableApp(shifts: ComputedShift[]) {
  return getAppBreakdown(shifts)[0] ?? null;
}
