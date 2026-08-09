export const NATIVE_AUTH_SCHEME = "wiwi";

export type NativeAuthPath = "/auth/confirmed" | "/reset-password";

export type NativeAuthCallback = {
  path: NativeAuthPath;
  code: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
};

export function getNativeAuthRedirectUrl(path: NativeAuthPath) {
  return `${NATIVE_AUTH_SCHEME}://${path.replace(/^\//, "")}`;
}

export function parseNativeAuthUrl(rawUrl: string): NativeAuthCallback | null {
  let url: URL;

  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  let path = url.pathname.replace(/\/$/, "");
  if (url.protocol === `${NATIVE_AUTH_SCHEME}:`) {
    path = `/${url.hostname}${path}`;
  } else if (
    url.protocol !== "https:" ||
    !["getwiwi.com", "www.getwiwi.com"].includes(url.hostname)
  ) {
    return null;
  }

  if (path !== "/auth/confirmed" && path !== "/reset-password") {
    return null;
  }

  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
  const error =
    url.searchParams.get("error_description") ||
    url.searchParams.get("error") ||
    hashParams.get("error_description") ||
    hashParams.get("error");

  return {
    path,
    code: url.searchParams.get("code"),
    accessToken: hashParams.get("access_token"),
    refreshToken: hashParams.get("refresh_token"),
    error,
  };
}
