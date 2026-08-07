import test from "node:test";
import assert from "node:assert/strict";
import {
  computeShiftMetrics,
  getShiftTotals,
  getWeeklyTotals,
} from "../lib/shiftMetrics.ts";

const currentSettings = {
  taxRate: 0.3,
  mpg: 20,
  gasPrice: 5,
  weeklyGoal: 500,
};

function makeShift(overrides = {}) {
  return {
    id: "shift-1",
    date: "2026-08-03",
    appName: "DoorDash",
    grossEarnings: 100,
    hoursWorked: 4,
    milesDriven: 30,
    otherExpenses: 5,
    taxRateSnapshot: 0.2,
    mpgSnapshot: 30,
    gasPriceSnapshot: 3,
    ...overrides,
  };
}

test("saved assumptions keep historical results stable", () => {
  const [computed] = computeShiftMetrics([makeShift()], currentSettings);

  assert.equal(computed.fuelCost, 3);
  assert.equal(computed.taxAmount, 20);
  assert.equal(computed.otherExpenses, 5);
  assert.equal(computed.net, 72);
  assert.equal(computed.hourly, 18);
});

test("legacy shifts fall back to current settings", () => {
  const [computed] = computeShiftMetrics(
    [
      makeShift({
        otherExpenses: 0,
        taxRateSnapshot: null,
        mpgSnapshot: null,
        gasPriceSnapshot: null,
      }),
    ],
    currentSettings
  );

  assert.equal(computed.fuelCost, 7.5);
  assert.equal(computed.taxAmount, 30);
  assert.equal(computed.net, 62.5);
});

test("totals include user-entered expenses", () => {
  const computed = computeShiftMetrics(
    [makeShift(), makeShift({ id: "shift-2", grossEarnings: 50, otherExpenses: 10 })],
    currentSettings
  );
  const totals = getShiftTotals(computed);

  assert.equal(totals.gross, 150);
  assert.equal(totals.otherExpenses, 15);
  assert.equal(totals.net, 99);
  assert.equal(totals.totalHours, 8);
  assert.equal(totals.hourly, 12.375);
});

test("weekly totals include only Monday through Sunday", () => {
  const shifts = computeShiftMetrics(
    [
      makeShift({ id: "inside", date: "2026-08-03" }),
      makeShift({ id: "outside", date: "2026-08-02" }),
    ],
    currentSettings
  );
  const totals = getWeeklyTotals(shifts, 500, new Date("2026-08-06T12:00:00"));

  assert.equal(totals.shiftCount, 1);
  assert.equal(totals.net, 72);
  assert.equal(totals.remaining, 428);
});
