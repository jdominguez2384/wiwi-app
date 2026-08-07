export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-4 text-sm text-slate-300">
        <div className="h-3 w-3 animate-pulse rounded-full bg-sky-400" />
        Loading WIWI...
      </div>
    </main>
  );
}
