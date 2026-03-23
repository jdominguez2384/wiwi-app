import type { Language } from "./translations";

export function getFriendlyAuthError(message: string, language: Language) {
  const normalized = message.toLowerCase();

  if (normalized.includes("email rate limit exceeded")) {
    return language === "en"
      ? "Too many email requests were sent recently. Please wait a bit and try again."
      : "Se enviaron demasiadas solicitudes de correo recientemente. Espera un poco e inténtalo de nuevo.";
  }

  return message;
}