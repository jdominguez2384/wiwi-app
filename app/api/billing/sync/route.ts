import {
  createBillingAdminClient,
  syncRevenueCatEntitlement,
  verifyRequestUser,
} from "../../../../lib/server/billing";
import { nativeJson, nativePreflight } from "../../../../lib/server/native-cors";

export const dynamic = "force-dynamic";

const allowedMethods = ["POST"];

export function OPTIONS(request: Request) {
  return nativePreflight(request, allowedMethods);
}

export async function POST(request: Request) {
  const user = await verifyRequestUser(request);
  if (!user) {
    return nativeJson(
      request,
      { error: "Your session expired. Please sign in again." },
      { status: 401, methods: allowedMethods }
    );
  }

  const adminClient = createBillingAdminClient();
  if (!adminClient || !process.env.REVENUECAT_SECRET_API_KEY) {
    return nativeJson(
      request,
      { error: "WIWI billing verification is not configured yet." },
      { status: 503, methods: allowedMethods }
    );
  }

  try {
    const result = await syncRevenueCatEntitlement(adminClient, user.id);
    return nativeJson(
      request,
      { ok: true, ...result },
      { methods: allowedMethods }
    );
  } catch (error) {
    console.error("Failed to synchronize WIWI Pro entitlement", error);
    return nativeJson(
      request,
      { error: "We could not verify your WIWI Pro access." },
      { status: 502, methods: allowedMethods }
    );
  }
}
