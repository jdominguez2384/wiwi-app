import { createClient } from "@supabase/supabase-js";
import { nativeJson, nativePreflight } from "../../../../lib/server/native-cors";

export const dynamic = "force-dynamic";

const allowedMethods = ["DELETE"];

export function OPTIONS(request: Request) {
  return nativePreflight(request, allowedMethods);
}

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  return {
    url,
    publishableKey,
    serviceRoleKey,
  };
}

function getBearerToken(request: Request) {
  const header = request.headers.get("authorization");

  if (!header?.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  return header.slice("bearer ".length).trim();
}

export async function DELETE(request: Request) {
  const { url, publishableKey, serviceRoleKey } = getSupabaseConfig();

  if (!url || !publishableKey || !serviceRoleKey) {
    return nativeJson(
      request,
      {
        error:
          "Account deletion is not configured yet. Please contact WIWI support.",
      },
      { status: 500, methods: allowedMethods }
    );
  }

  const token = getBearerToken(request);

  if (!token) {
    return nativeJson(
      request,
      { error: "You must be signed in to delete your account." },
      { status: 401, methods: allowedMethods }
    );
  }

  const userClient = createClient(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser(token);

  if (userError || !user) {
    return nativeJson(
      request,
      { error: "Your session expired. Please sign in again." },
      { status: 401, methods: allowedMethods }
    );
  }

  const adminClient = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const dataDeletes = [
    adminClient.from("shifts").delete().eq("user_id", user.id),
    adminClient.from("cost_profiles").delete().eq("user_id", user.id),
    adminClient.from("billing_entitlements").delete().eq("user_id", user.id),
    adminClient
      .from("billing_webhook_events")
      .delete()
      .eq("app_user_id", user.id),
    adminClient.from("user_settings").delete().eq("user_id", user.id),
    adminClient.from("profiles").delete().eq("id", user.id),
  ];

  const deleteResults = await Promise.all(dataDeletes);
  const dataError = deleteResults.find((result) => result.error)?.error;

  if (dataError) {
    return nativeJson(
      request,
      { error: "We could not delete your WIWI data. Please try again." },
      { status: 500, methods: allowedMethods }
    );
  }

  const { error: authDeleteError } =
    await adminClient.auth.admin.deleteUser(user.id);

  if (authDeleteError) {
    return nativeJson(
      request,
      { error: "We could not delete your account. Please try again." },
      { status: 500, methods: allowedMethods }
    );
  }

  return nativeJson(request, { ok: true }, { methods: allowedMethods });
}
