import Link from "next/link";
import { ArrowLeft, MapPinOff } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <div className="w-full max-w-lg rounded-[32px] border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl shadow-slate-950/60">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-300">
          <MapPinOff className="h-6 w-6" />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
          Page not found
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">
          This route was not worth it.
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-400">
          The page may have moved, or the link may no longer be available.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to WIWI
        </Link>
      </div>
    </main>
  );
}
