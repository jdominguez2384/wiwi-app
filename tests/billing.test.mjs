import test from "node:test";
import assert from "node:assert/strict";
import {
  findSupabaseUserId,
  getBillingErrorMessage,
  isEntitlementActive,
} from "../lib/billing.ts";

test("lifetime and unexpired RevenueCat entitlements are active", () => {
  const now = new Date("2026-08-07T12:00:00Z");

  assert.equal(isEntitlementActive({ expires_date: null }, now), true);
  assert.equal(
    isEntitlementActive({ expires_date: "2026-08-08T12:00:00Z" }, now),
    true
  );
  assert.equal(
    isEntitlementActive({ expires_date: "2026-08-06T12:00:00Z" }, now),
    false
  );
  assert.equal(isEntitlementActive(undefined, now), false);
});

test("webhook aliases accept only valid Supabase UUIDs", () => {
  const userId = "d9428888-122b-4f2d-8ad8-d3893d798771";

  assert.equal(findSupabaseUserId(["$RCAnonymousID:123", userId]), userId);
  assert.equal(findSupabaseUserId(["not-a-user", 123]), undefined);
});

test("store errors are bilingual and canceled checkout stays quiet", () => {
  assert.equal(getBillingErrorMessage({ userCancelled: true }, "en"), null);
  assert.match(
    getBillingErrorMessage({ message: "Network unavailable" }, "en"),
    /connect/i
  );
  assert.match(
    getBillingErrorMessage({ message: "Network unavailable" }, "es"),
    /conectar/i
  );
});
