import type { Language } from "./translations";

type AuthErrorLike = {
  code?: unknown;
  message?: unknown;
  name?: unknown;
  status?: unknown;
};

function getErrorParts(error: unknown) {
  if (typeof error === "string") {
    return { message: error, normalized: error.toLowerCase(), status: null };
  }

  if (!error || typeof error !== "object") {
    return { message: "", normalized: "", status: null };
  }

  const candidate = error as AuthErrorLike;
  const message =
    typeof candidate.message === "string" ? candidate.message.trim() : "";
  const code = typeof candidate.code === "string" ? candidate.code : "";
  const name = typeof candidate.name === "string" ? candidate.name : "";
  const status =
    typeof candidate.status === "number" ? candidate.status : null;

  return {
    message,
    normalized: `${name} ${code} ${message}`.toLowerCase(),
    status,
  };
}

function includesAny(value: string, matches: string[]) {
  return matches.some((match) => value.includes(match));
}

export function getFriendlyAuthError(error: unknown, language: Language) {
  const { message, normalized, status } = getErrorParts(error);

  if (
    includesAny(normalized, [
      "failed to fetch",
      "fetch failed",
      "network request failed",
      "networkerror",
      "load failed",
      "authretryablefetcherror",
      "request timeout",
      "timed out",
    ])
  ) {
    return language === "en"
      ? "Connection error: WIWI could not reach the secure account service, so your request was not completed. Check your internet connection and try again. If you are online, the service may be temporarily unavailable."
      : "Error de conexión: WIWI no pudo comunicarse con el servicio seguro de cuentas, por lo que la solicitud no se completó. Revisa tu conexión a internet e inténtalo de nuevo. Si tienes conexión, el servicio podría no estar disponible temporalmente.";
  }

  if (
    status === 429 ||
    includesAny(normalized, [
      "email rate limit exceeded",
      "over_email_send_rate_limit",
      "over_request_rate_limit",
      "too many requests",
    ])
  ) {
    return language === "en"
      ? "Too many attempts were made recently. Wait a few minutes before trying again."
      : "Se hicieron demasiados intentos recientemente. Espera unos minutos antes de intentarlo de nuevo.";
  }

  if (
    includesAny(normalized, [
      "invalid login credentials",
      "invalid_credentials",
    ])
  ) {
    return language === "en"
      ? "The email or password is incorrect. Check both fields or reset your password."
      : "El correo o la contraseña son incorrectos. Revisa ambos campos o restablece tu contraseña.";
  }

  if (includesAny(normalized, ["email not confirmed", "email_not_confirmed"])) {
    return language === "en"
      ? "Your email has not been confirmed yet. Open the confirmation message we sent before signing in, and check your spam folder if needed."
      : "Tu correo todavía no ha sido confirmado. Abre el mensaje de confirmación que enviamos antes de iniciar sesión y revisa la carpeta de spam si es necesario.";
  }

  if (
    includesAny(normalized, [
      "user already registered",
      "user_already_exists",
      "email already registered",
      "email_exists",
    ])
  ) {
    return language === "en"
      ? "An account already exists for this email. Sign in or reset the password instead."
      : "Ya existe una cuenta con este correo. Inicia sesión o restablece la contraseña.";
  }

  if (
    includesAny(normalized, [
      "weak_password",
      "password should be",
      "password must be",
      "password is too short",
      "password_too_short",
    ])
  ) {
    return language === "en"
      ? "That password does not meet the security requirements. Try a longer password with a mix of letters, numbers, and symbols."
      : "Esa contraseña no cumple los requisitos de seguridad. Prueba una contraseña más larga que combine letras, números y símbolos.";
  }

  if (
    includesAny(normalized, [
      "invalid email",
      "email address is invalid",
      "email_address_invalid",
      "unable to validate email",
    ])
  ) {
    return language === "en"
      ? "Enter a valid email address and try again."
      : "Ingresa un correo electrónico válido e inténtalo de nuevo.";
  }

  if (
    includesAny(normalized, [
      "signup is disabled",
      "signups not allowed",
      "email_provider_disabled",
    ])
  ) {
    return language === "en"
      ? "New account creation is temporarily unavailable. Please try again later or contact WIWI support."
      : "La creación de cuentas nuevas no está disponible temporalmente. Inténtalo más tarde o contacta al soporte de WIWI.";
  }

  if (includesAny(normalized, ["captcha", "captcha_failed"])) {
    return language === "en"
      ? "The security check could not be completed. Refresh the page and try again."
      : "No se pudo completar la verificación de seguridad. Actualiza la página e inténtalo de nuevo.";
  }

  if (
    status !== null &&
    status >= 500
  ) {
    return language === "en"
      ? "WIWI's account service is temporarily unavailable. Your request was not completed. Please try again shortly."
      : "El servicio de cuentas de WIWI no está disponible temporalmente. La solicitud no se completó. Inténtalo de nuevo en unos minutos.";
  }

  return message ||
    (language === "en"
      ? "WIWI could not complete this account request. Please try again or contact support if the problem continues."
      : "WIWI no pudo completar esta solicitud de cuenta. Inténtalo de nuevo o contacta al soporte si el problema continúa.");
}
