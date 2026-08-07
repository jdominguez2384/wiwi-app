import test from "node:test";
import assert from "node:assert/strict";
import {
  getGoalForecast,
  getMonthlyTrend,
  getPeriodComparison,
  getWeekdayPerformance,
} from "../lib/proAnalytics.ts";
import { buildShiftCsv } from "../lib/proReports.ts";

function shift(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    date: "2026-08-06",
    appName: "DoorDash",
    grossEarnings: 100,
    hoursWorked: 4,
    milesDriven: 20,
    otherExpenses: 0,
    taxRateSnapshot: 0.2,
    mpgSnapshot: 25,
    gasPriceSnapshot: 3,
    fuelCost: 2.4,
    taxAmount: 20,
    net: 77.6,
    hourly: 19.4,
    ...overrides,
  };
}

test("period comparisons separate current and previous windows", () => {
  const comparison = getPeriodComparison(
    [
      shift({ date: "2026-08-06", net: 120, hourly: 30 }),
      shift({ date: "2026-07-01", net: 80, hourly: 20 }),
    ],
    "30d",
    new Date("2026-08-07T12:00:00")
  );

  assert.equal(comparison.current.net, 120);
  assert.equal(comparison.previous?.net, 80);
  assert.equal(comparison.netChangePercent, 50);
});

test("monthly and weekday trends preserve empty periods", () => {
  const shifts = [
    shift({ date: "2026-08-03", net: 70 }),
    shift({ date: "2026-08-04", net: 90 }),
  ];
  const trend = getMonthlyTrend(
    shifts,
    3,
    new Date("2026-08-07T12:00:00")
  );
  const weekdays = getWeekdayPerformance(shifts);

  assert.deepEqual(
    trend.map((point) => point.shiftCount),
    [0, 0, 2]
  );
  assert.equal(weekdays[1].net, 70);
  assert.equal(weekdays[2].net, 90);
});

test("goal forecasts use completed history and expose confidence", () => {
  const shifts = Array.from({ length: 6 }, (_, index) =>
    shift({
      id: String(index),
      date: `2026-07-${String(20 + index).padStart(2, "0")}`,
      net: 100,
      hoursWorked: 5,
      hourly: 20,
    })
  );
  const forecast = getGoalForecast(
    shifts,
    500,
    new Date("2026-08-05T12:00:00")
  );

  assert.equal(forecast.estimatedShiftsRemaining, 5);
  assert.equal(forecast.estimatedHoursRemaining, 25);
  assert.equal(forecast.confidence, "medium");
});

test("CSV reports include bilingual headers and protect spreadsheet formulas", () => {
  const csv = buildShiftCsv(
    [shift({ appName: "=HYPERLINK(\"bad\")" })],
    "es",
    new Date("2026-08-07T12:00:00")
  );

  assert.match(csv, /Reserva de impuestos/);
  assert.match(csv, /'=HYPERLINK/);
  assert.ok(csv.startsWith("\uFEFF"));
});
