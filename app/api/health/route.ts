import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function isSupabaseReachable(url: string, publishableKey: string) {
  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/auth/v1/health`, {
      cache: "no-store",
      headers: {
        apikey: publishableKey,
      },
      signal: AbortSignal.timeout(4000),
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const isConfigured = Boolean(
    supabaseUrl && publishableKey
  );
  const isBackendReachable = supabaseUrl && publishableKey
    ? await isSupabaseReachable(supabaseUrl, publishableKey)
    : false;
  const isHealthy = isConfigured && isBackendReachable;
  const commit = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) || "local";

  return NextResponse.json(
    {
      status: isHealthy ? "ok" : "degraded",
      service: "wiwi-web",
      version: commit,
      dependencies: {
        accountService: isBackendReachable ? "reachable" : "unreachable",
      },
    },
    {
      status: isHealthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
