"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">
        <main className="flex min-h-screen items-center justify-center p-6">
          <div className="max-w-lg rounded-[32px] border border-slate-800 bg-slate-900 p-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
              WIWI
            </p>
            <h1 className="mt-4 text-3xl font-black">We could not load the app.</h1>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Your saved data was not changed. Please try again.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950"
            >
              Reload WIWI
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
