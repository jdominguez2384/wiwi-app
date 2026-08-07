import test from "node:test";
import assert from "node:assert/strict";
import { getFriendlyAuthError } from "../lib/auth-messages.ts";

test("explains network failures without exposing the raw fetch error", () => {
  const message = getFriendlyAuthError(new TypeError("Failed to fetch"), "en");

  assert.match(message, /^Connection error:/);
  assert.match(message, /account service/);
  assert.doesNotMatch(message, /Failed to fetch/);
});

test("localizes network failures", () => {
  const message = getFriendlyAuthError("Network request failed", "es");

  assert.match(message, /^Error de conexión:/);
  assert.match(message, /servicio seguro de cuentas/);
});

test("uses auth codes when the message is not descriptive", () => {
  assert.match(
    getFriendlyAuthError({ code: "invalid_credentials" }, "en"),
    /email or password is incorrect/i
  );
  assert.match(
    getFriendlyAuthError({ code: "weak_password" }, "en"),
    /security requirements/i
  );
});

test("turns rate limits into an actionable wait message", () => {
  const message = getFriendlyAuthError({ status: 429 }, "en");

  assert.match(message, /Wait a few minutes/);
});
