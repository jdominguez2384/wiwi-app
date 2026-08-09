import test from "node:test";
import assert from "node:assert/strict";
import {
  getNativeAuthRedirectUrl,
  parseNativeAuthUrl,
} from "../lib/nativeLinks.ts";

test("native auth redirects use the registered WIWI scheme", () => {
  assert.equal(
    getNativeAuthRedirectUrl("/auth/confirmed"),
    "wiwi://auth/confirmed"
  );
  assert.equal(
    getNativeAuthRedirectUrl("/reset-password"),
    "wiwi://reset-password"
  );
});

test("native auth links parse PKCE codes and recovery tokens", () => {
  assert.deepEqual(
    parseNativeAuthUrl("wiwi://auth/confirmed?code=pkce-code"),
    {
      path: "/auth/confirmed",
      code: "pkce-code",
      accessToken: null,
      refreshToken: null,
      error: null,
    }
  );

  assert.deepEqual(
    parseNativeAuthUrl(
      "wiwi://reset-password#access_token=access&refresh_token=refresh"
    ),
    {
      path: "/reset-password",
      code: null,
      accessToken: "access",
      refreshToken: "refresh",
      error: null,
    }
  );
});

test("native auth parsing accepts WIWI web fallbacks and rejects foreign URLs", () => {
  assert.equal(
    parseNativeAuthUrl("https://getwiwi.com/reset-password?code=abc")?.path,
    "/reset-password"
  );
  assert.equal(
    parseNativeAuthUrl("https://example.com/reset-password?code=abc"),
    null
  );
  assert.equal(parseNativeAuthUrl("wiwi://settings"), null);
});
