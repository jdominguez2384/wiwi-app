"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("WIWI route error", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <div className="w-full max-w-lg rounded-[32px] border border-orange-500/25 bg-slate-900/80 p-8 text-center shadow-2xl shadow-slate-950/60">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-400/25 bg-orange-400/10 text-orange-200">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-orange-200">
          WIWI hit a roadblock
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">
          Your saved data was not changed.
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-400">
          Try loading this screen again. If the problem continues, contact WIWI support.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/support"
            className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-400"
          >
            Contact support
          </Link>
        </div>
      </div>
    </main>
  );
}
