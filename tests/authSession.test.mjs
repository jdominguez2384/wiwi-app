import test from "node:test";
import assert from "node:assert/strict";
import {
  AuthError,
  AuthSessionMissingError,
} from "@supabase/supabase-js";
import {
  AUTH_VERIFICATION_ERROR,
  getAuthVerificationError,
} from "../lib/auth-session.ts";

test("a missing session is treated as a normal signed-out state", () => {
  assert.equal(getAuthVerificationError(null), null);
  assert.equal(getAuthVerificationError(new AuthSessionMissingError()), null);
});

test("real authentication failures keep the retry state", () => {
  const error = new AuthError("Unable to reach authentication service");

  assert.equal(getAuthVerificationError(error), AUTH_VERIFICATION_ERROR);
});
