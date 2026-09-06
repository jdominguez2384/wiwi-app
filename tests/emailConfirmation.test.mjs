import test from "node:test";
import assert from "node:assert/strict";
import { AuthSessionMissingError } from "@supabase/supabase-js";
import { checkEmailConfirmation, getEmailConfirmationRedirectUrl } from "../lib/emailConfirmation.ts";

const callbackUrl = "https://getwiwi.com/auth/confirmed";
const confirmedUser = { email_confirmed_at: "2026-09-05T00:00:00Z" };
function authStub(user = confirmedUser) {
  return {
    initialize: async () => ({ error: null }),
    getUser: async () => ({ data: { user }, error: null }),
  };
}

test("confirmation redirects stay on the website for cross-device signup", () => {
  assert.equal(getEmailConfirmationRedirectUrl("https://getwiwi.com/"), callbackUrl);
  assert.equal(getEmailConfirmationRedirectUrl("http://localhost:3000"), "http://localhost:3000/auth/confirmed");
});

test("confirmation waits for the URL exchange and verifies the current user", async () => {
  let initialized = false;
  const auth = authStub();
  auth.initialize = async () => { initialized = true; return { error: null }; };
  auth.getUser = async () => {
    assert.equal(initialized, true);
    return { data: { user: confirmedUser }, error: null };
  };
  assert.deepEqual(await checkEmailConfirmation(auth, callbackUrl), { status: "confirmed" });
});

test("expired or reused links cannot report success from an old session", async () => {
  for (const suffix of ["#error=access_denied&error_code=otp_expired", "?error_description=expired"]) {
    const result = await checkEmailConfirmation(authStub(), callbackUrl + suffix);
    assert.equal(result.status, "error");
    assert.equal(result.error.code, "otp_expired");
  }
});

test("missing or unconfirmed accounts never show confirmation success", async () => {
  for (const user of [null, { email_confirmed_at: null }]) {
    assert.deepEqual(await checkEmailConfirmation(authStub(user), callbackUrl), { status: "unverified" });
  }
  const auth = authStub();
  auth.getUser = async () => ({ data: { user: null }, error: new AuthSessionMissingError() });
  assert.deepEqual(await checkEmailConfirmation(auth, callbackUrl), { status: "unverified" });
});

test("failed exchanges and deleted-user/network errors remain errors", async () => {
  const error = new Error("Account no longer exists");
  const auth = authStub();
  auth.initialize = async () => ({ error });
  assert.deepEqual(await checkEmailConfirmation(auth, callbackUrl), { status: "error", error });
  auth.initialize = async () => ({ error: null });
  auth.getUser = async () => ({ data: { user: null }, error });
  assert.deepEqual(await checkEmailConfirmation(auth, callbackUrl), { status: "error", error });
  auth.getUser = async () => { throw new TypeError("Failed to fetch"); };
  assert.equal((await checkEmailConfirmation(auth, callbackUrl)).status, "error");
});
