import {
  isAuthSessionMissingError,
  type AuthError,
} from "@supabase/supabase-js";

export const AUTH_VERIFICATION_ERROR = "We could not verify your session.";

export function getAuthVerificationError(error: AuthError | null) {
  if (!error || isAuthSessionMissingError(error)) {
    return null;
  }

  return AUTH_VERIFICATION_ERROR;
}
