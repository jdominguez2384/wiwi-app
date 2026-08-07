import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  isEntitlementActive,
  PRO_ENTITLEMENT_ID,
} from "../billing";

export { findSupabaseUserId } from "../billing";

type RevenueCatEntitlement = {
  expires_date?: string | null;
  product_identifier?: string | null;
  purchase_date?: string | null;
};

type RevenueCatSubscriber = {
  entitlements?: Record<string, RevenueCatEntitlement>;
  subscriptions?: Record<
    string,
    {
      store?: string | null;
      expires_date?: string | null;
      period_type?: string | null;
    }
  >;
};

type RevenueCatResponse = {
  subscriber?: RevenueCatSubscriber;
};

export function getServerSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    serviceRoleKey:
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_SECRET_KEY,
  };
}

export function createBillingAdminClient() {
  const { url, serviceRoleKey } = getServerSupabaseConfig();
  if (!url || !serviceRoleKey) return null;

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function getBearerToken(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.toLowerCase().startsWith("bearer ")) return null;
  return header.slice("bearer ".length).trim();
}

export async function verifyRequestUser(request: Request) {
  const { url, publishableKey } = getServerSupabaseConfig();
  const token = getBearerToken(request);
  if (!url || !publishableKey || !token) return null;

  const client = createClient(url, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const {
    data: { user },
    error,
  } = await client.auth.getUser(token);

  return error ? null : user;
}

async function getRevenueCatSubscriber(userId: string) {
  const apiKey = process.env.REVENUECAT_SECRET_API_KEY;
  if (!apiKey) {
    throw new Error("RevenueCat server verification is not configured.");
  }

  const response = await fetch(
    `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`RevenueCat verification failed with ${response.status}.`);
  }

  return (await response.json()) as RevenueCatResponse;
}

export async function syncRevenueCatEntitlement(
  adminClient: SupabaseClient,
  userId: string,
  event?: {
    id?: string | null;
    type?: string | null;
    productId?: string | null;
    store?: string | null;
    environment?: string | null;
  }
) {
  const response = await getRevenueCatSubscriber(userId);
  const entitlement = response?.subscriber?.entitlements?.[PRO_ENTITLEMENT_ID];
  const expiresAt = entitlement?.expires_date ?? null;
  const isActive = isEntitlementActive(entitlement);
  const productId = entitlement?.product_identifier ?? event?.productId ?? null;
  const subscription = productId
    ? response?.subscriber?.subscriptions?.[productId]
    : null;

  const { error: entitlementError } = await adminClient
    .from("billing_entitlements")
    .upsert(
      {
        user_id: userId,
        entitlement_id: PRO_ENTITLEMENT_ID,
        is_active: isActive,
        product_id: productId,
        store: subscription?.store ?? event?.store ?? null,
        environment: event?.environment ?? null,
        expires_at: expiresAt,
        last_event_id: event?.id ?? null,
        last_event_type: event?.type ?? null,
      },
      { onConflict: "user_id,entitlement_id" }
    );

  if (entitlementError) throw entitlementError;

  const { error: profileError } = await adminClient
    .from("profiles")
    .update({ plan: isActive ? "pro" : "free" })
    .eq("id", userId);

  if (profileError) throw profileError;

  return {
    plan: isActive ? ("pro" as const) : ("free" as const),
    isActive,
    productId,
    expiresAt,
  };
}
