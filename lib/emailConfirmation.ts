import { isAuthSessionMissingError, type SupabaseClient } from "@supabase/supabase-js";

export function getEmailConfirmationRedirectUrl(siteOrigin: string) {
  return new URL("/auth/confirmed", siteOrigin).href;
}

export type EmailConfirmationResult =
  | { status: "confirmed" }
  | { status: "unverified" }
  | { status: "error"; error: unknown };

export async function checkEmailConfirmation(
  auth: Pick<SupabaseClient["auth"], "initialize" | "getUser">,
  callbackUrl: string
): Promise<EmailConfirmationResult> {
  try {
    const url = new URL(callbackUrl);
    const hash = new URLSearchParams(url.hash.slice(1));
    const callbackError = [url.searchParams, hash].some((params) =>
      ["error", "error_code", "error_description"].some((key) => params.has(key))
    );

    // The client owns the one-time URL exchange. Wait for it instead of
    // exchanging the same code twice or trusting an older stored session.
    const { error: initializationError } = await auth.initialize();
    if (callbackError) {
      return { status: "error", error: { code: "otp_expired" } };
    }
    if (initializationError) {
      return { status: "error", error: initializationError };
    }

    const { data, error } = await auth.getUser();
    if (isAuthSessionMissingError(error)) return { status: "unverified" };
    if (error) return { status: "error", error };
    return { status: data.user?.email_confirmed_at ? "confirmed" : "unverified" };
  } catch (error) {
    return { status: "error", error };
  }
}
