import test from "node:test";
import assert from "node:assert/strict";
import { getApiUrl } from "../lib/api.ts";
import {
  isAllowedNativeOrigin,
  nativePreflight,
} from "../lib/server/native-cors.ts";

test("native API requests use production while web requests stay same-origin", () => {
  assert.equal(getApiUrl("/api/health", false), "/api/health");
  assert.equal(
    getApiUrl("/api/health", true),
    "https://getwiwi.com/api/health"
  );
  assert.throws(() => getApiUrl("/privacy", true), /must start with \/api\//);
});

test("only Capacitor local origins receive API preflight permission", () => {
  assert.equal(isAllowedNativeOrigin("capacitor://localhost"), true);
  assert.equal(isAllowedNativeOrigin("https://localhost"), true);
  assert.equal(isAllowedNativeOrigin("https://example.com"), false);

  const allowed = nativePreflight(
    new Request("https://getwiwi.com/api/account/delete", {
      headers: { Origin: "capacitor://localhost" },
    }),
    ["DELETE"]
  );
  assert.equal(allowed.status, 204);
  assert.equal(
    allowed.headers.get("access-control-allow-origin"),
    "capacitor://localhost"
  );
  assert.match(
    allowed.headers.get("access-control-allow-methods") || "",
    /DELETE/
  );

  const rejected = nativePreflight(
    new Request("https://getwiwi.com/api/account/delete", {
      headers: { Origin: "https://example.com" },
    }),
    ["DELETE"]
  );
  assert.equal(rejected.status, 403);
});
