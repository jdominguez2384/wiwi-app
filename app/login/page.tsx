"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "../../components/LanguageProvider";
import { signIn } from "../../lib/auth";

export default function LoginPage() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage(
        language === "en"
          ? "Please fill out all fields."
          : "Por favor completa todos los campos."
      );
      return;
    }

    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl shadow-sky-950/20">
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => setLanguage("en")}
            disabled={isLoading}
            className={`rounded-xl border px-4 py-2 text-sm transition ${
              language === "en"
                ? "border-sky-400 bg-sky-500 text-black"
                : "border-zinc-700 bg-zinc-900 text-white hover:border-sky-500/40"
            } disabled:opacity-60`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("es")}
            disabled={isLoading}
            className={`rounded-xl border px-4 py-2 text-sm transition ${
              language === "es"
                ? "border-sky-400 bg-sky-500 text-black"
                : "border-zinc-700 bg-zinc-900 text-white hover:border-sky-500/40"
            } disabled:opacity-60`}
          >
            ES
          </button>
        </div>

        <p className="text-sm font-medium tracking-[0.2em] text-sky-400">WIWI</p>
        <h1 className="text-3xl font-semibold mt-2">
          {language === "en" ? "Sign in" : "Iniciar sesión"}
        </h1>
        <p className="text-zinc-400 mt-3">
          {language === "en"
            ? "Access your account and track your real pay."
            : "Entra a tu cuenta y sigue tu pago real."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="block w-full min-w-0 rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">
              {language === "en" ? "Password" : "Contraseña"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="block w-full min-w-0 rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:opacity-60"
            />
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-zinc-400 underline transition hover:text-sky-300"
            >
              {language === "en"
                ? "Forgot password?"
                : "¿Olvidaste tu contraseña?"}
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-sky-500 text-black px-4 py-3 font-medium transition hover:bg-sky-400 disabled:opacity-60"
          >
            {isLoading
              ? language === "en"
                ? "Signing in..."
                : "Entrando..."
              : language === "en"
              ? "Sign in"
              : "Entrar"}
          </button>
        </form>

        {message ? (
          <p className="text-sm text-red-300 mt-4">{message}</p>
        ) : null}

        <p className="text-sm text-zinc-400 mt-6">
          {language === "en"
            ? "Need an account?"
            : "¿Necesitas una cuenta?"}{" "}
          <Link
            href="/signup"
            className="font-medium text-sky-300 underline transition hover:text-sky-200"
          >
            {language === "en" ? "Create one" : "Crea una"}
          </Link>
        </p>

        <p className="text-sm text-zinc-500 mt-2">
          <Link href="/" className="underline transition hover:text-sky-300">
            {language === "en" ? "Back to home" : "Volver al inicio"}
          </Link>
        </p>
      </div>
    </main>
  );
}