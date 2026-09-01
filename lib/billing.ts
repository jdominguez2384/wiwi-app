import type { Language } from "./translations";

export const PRO_ENTITLEMENT_ID = "pro";
export const PRO_OFFERING_ID = "default";
export const PRO_BILLING_ENABLED =
  process.env.NEXT_PUBLIC_PRO_BILLING_ENABLED === "true";

export type ProPackageKey = "monthly" | "annual" | "lifetime";

export const fallbackProPrices: Record<ProPackageKey, string> = {
  monthly: "$4.99",
  annual: "$39.99",
  lifetime: "$79.99",
};

export function isEntitlementActive(
  entitlement: { expires_date?: string | null } | null | undefined,
  now = new Date()
) {
  if (!entitlement) return false;
  if (!entitlement.expires_date) return true;

  const expiresAt = new Date(entitlement.expires_date).getTime();
  return Number.isFinite(expiresAt) && expiresAt > now.getTime();
}

export function findSupabaseUserId(values: Array<unknown>) {
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return values.find(
    (value): value is string =>
      typeof value === "string" && uuidPattern.test(value)
  );
}

export function getBillingErrorMessage(error: unknown, language: Language) {
  const isSpanish = language === "es";
  const purchaseError = error as {
    userCancelled?: boolean;
    code?: string | number;
    message?: string;
  };

  if (purchaseError?.userCancelled) return null;

  const message = purchaseError?.message?.toLowerCase() ?? "";
  if (message.includes("network") || message.includes("offline")) {
    return isSpanish
      ? "No pudimos conectar con la tienda. Revisa tu conexion e intentalo de nuevo."
      : "We could not connect to the store. Check your connection and try again.";
  }

  if (message.includes("not available") || message.includes("configuration")) {
    return isSpanish
      ? "WIWI Pro todavia no esta disponible en esta version de la app."
      : "WIWI Pro is not available in this version of the app yet.";
  }

  return isSpanish
    ? "No pudimos completar la compra. No se realizo ningun cobro."
    : "We could not complete the purchase. You were not charged.";
}
