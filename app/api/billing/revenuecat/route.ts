import { NextResponse } from "next/server";
import {
  createBillingAdminClient,
  findSupabaseUserId,
  syncRevenueCatEntitlement,
} from "../../../../lib/server/billing";

export const dynamic = "force-dynamic";

type RevenueCatWebhook = {
  event?: {
    id?: string;
    type?: string;
    app_user_id?: string;
    original_app_user_id?: string;
    aliases?: string[];
    product_id?: string;
    store?: string;
    environment?: string;
  };
};

function hasValidWebhookAuthorization(request: Request) {
  const configuredKey = process.env.REVENUECAT_WEBHOOK_AUTH_KEY;
  const provided = request.headers.get("authorization");
  if (!configuredKey || !provided) return false;

  return provided === configuredKey || provided === `Bearer ${configuredKey}`;
}

export async function POST(request: Request) {
  if (!hasValidWebhookAuthorization(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const adminClient = createBillingAdminClient();
  if (!adminClient || !process.env.REVENUECAT_SECRET_API_KEY) {
    return NextResponse.json(
      { error: "Billing verification is not configured." },
      { status: 503 }
    );
  }

  let payload: RevenueCatWebhook;
  try {
    payload = (await request.json()) as RevenueCatWebhook;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const event = payload.event;
  if (!event?.id || !event.type) {
    return NextResponse.json(
      { error: "Missing RevenueCat event fields." },
      { status: 400 }
    );
  }

  const { data: existingEvent } = await adminClient
    .from("billing_webhook_events")
    .select("event_id")
    .eq("event_id", event.id)
    .maybeSingle();
  if (existingEvent) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const userId = findSupabaseUserId([
    event.app_user_id,
    event.original_app_user_id,
    ...(event.aliases ?? []),
  ]);

  if (!userId) {
    await adminClient.from("billing_webhook_events").insert({
      event_id: event.id,
      event_type: event.type,
      app_user_id: event.app_user_id ?? null,
    });
    return NextResponse.json({ ok: true, ignored: true });
  }

  const { data: profile } = await adminClient
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();
  if (!profile) {
    await adminClient.from("billing_webhook_events").insert({
      event_id: event.id,
      event_type: event.type,
      app_user_id: userId,
    });
    return NextResponse.json({ ok: true, ignored: true });
  }

  try {
    const result = await syncRevenueCatEntitlement(adminClient, userId, {
      id: event.id,
      type: event.type,
      productId: event.product_id,
      store: event.store,
      environment: event.environment,
    });

    const { error: eventError } = await adminClient
      .from("billing_webhook_events")
      .insert({
        event_id: event.id,
        event_type: event.type,
        app_user_id: userId,
      });
    if (eventError && eventError.code !== "23505") throw eventError;

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("RevenueCat webhook processing failed", error);
    return NextResponse.json(
      { error: "Entitlement synchronization failed." },
      { status: 502 }
    );
  }
}
