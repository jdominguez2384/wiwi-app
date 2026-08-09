import { Capacitor } from "@capacitor/core";

const nativeApiOrigin = (
  process.env.NEXT_PUBLIC_NATIVE_API_ORIGIN || "https://getwiwi.com"
).replace(/\/$/, "");

export function getApiUrl(
  path: string,
  isNative = Capacitor.isNativePlatform()
) {
  if (!path.startsWith("/api/")) {
    throw new Error("WIWI API paths must start with /api/.");
  }

  return isNative ? `${nativeApiOrigin}${path}` : path;
}
