import test from "node:test";
import assert from "node:assert/strict";
import {
  getLocalDateInputValue,
  getNonNegativeNumber,
  getPositiveNumber,
  isNonNegativeDecimalInput,
} from "../lib/shiftForm.ts";

test("formats a date using local calendar fields", () => {
  const localLateNight = new Date(2026, 7, 6, 23, 45);

  assert.equal(getLocalDateInputValue(localLateNight), "2026-08-06");
});

test("accepts ordinary non-negative decimal input", () => {
  assert.equal(isNonNegativeDecimalInput(""), true);
  assert.equal(isNonNegativeDecimalInput("0.5"), true);
  assert.equal(isNonNegativeDecimalInput("125.50"), true);
});

test("rejects negative, exponent, and malformed input", () => {
  assert.equal(isNonNegativeDecimalInput("-1"), false);
  assert.equal(isNonNegativeDecimalInput("1e3"), false);
  assert.equal(isNonNegativeDecimalInput("1.2.3"), false);
});

test("parses non-negative and positive values with the correct boundaries", () => {
  assert.equal(getNonNegativeNumber("0"), 0);
  assert.equal(getNonNegativeNumber("42.5"), 42.5);
  assert.equal(getNonNegativeNumber("-0.1"), null);
  assert.equal(getNonNegativeNumber(""), null);
  assert.equal(getPositiveNumber("0.25"), 0.25);
  assert.equal(getPositiveNumber("0"), null);
});
