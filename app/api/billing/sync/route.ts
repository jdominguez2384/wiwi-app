import { NextResponse } from "next/server";
import {
  createBillingAdminClient,
  syncRevenueCatEntitlement,
  verifyRequestUser,
} from "../../../../lib/server/billing";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await verifyRequestUser(request);
  if (!user) {
    return NextResponse.json(
      { error: "Your session expired. Please sign in again." },
      { status: 401 }
    );
  }

  const adminClient = createBillingAdminClient();
  if (!adminClient || !process.env.REVENUECAT_SECRET_API_KEY) {
    return NextResponse.json(
      { error: "WIWI billing verification is not configured yet." },
      { status: 503 }
    );
  }

  try {
    const result = await syncRevenueCatEntitlement(adminClient, user.id);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("Failed to synchronize WIWI Pro entitlement", error);
    return NextResponse.json(
      { error: "We could not verify your WIWI Pro access." },
      { status: 502 }
    );
  }
}
