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

    const { error } = await signIn(email, password);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => setLanguage("en")}
            className={`rounded-xl border px-4 py-2 ${
              language === "en" ? "bg-black text-white" : "bg-white"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("es")}
            className={`rounded-xl border px-4 py-2 ${
              language === "es" ? "bg-black text-white" : "bg-white"
            }`}
          >
            ES
          </button>
        </div>

        <p className="text-sm text-zinc-500">RealRate</p>
        <h1 className="text-3xl font-semibold mt-2">
          {language === "en" ? "Sign in" : "Iniciar sesión"}
        </h1>
        <p className="text-zinc-600 mt-3">
          {language === "en"
            ? "Access your account and track your real pay."
            : "Entra a tu cuenta y sigue tu pago real."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              {language === "en" ? "Password" : "Contraseña"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3"
            />
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm underline text-zinc-600"
            >
              {language === "en" ? "Forgot password?" : "¿Olvidaste tu contraseña?"}
            </Link>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-black text-white px-4 py-3"
          >
            {language === "en" ? "Sign in" : "Entrar"}
          </button>
        </form>

        {message ? (
          <p className="text-sm text-zinc-600 mt-4">{message}</p>
        ) : null}

        <p className="text-sm text-zinc-600 mt-6">
          {language === "en" ? "Need an account?" : "¿Necesitas una cuenta?"}{" "}
          <Link href="/signup" className="font-medium underline">
            {language === "en" ? "Create one" : "Crea una"}
          </Link>
        </p>

        <p className="text-sm text-zinc-600 mt-2">
          <Link href="/" className="underline">
            {language === "en" ? "Back to home" : "Volver al inicio"}
          </Link>
        </p>
      </div>
    </main>
  );
}