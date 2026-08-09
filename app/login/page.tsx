"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, KeyRound, Mail } from "lucide-react";
import { AuthShell } from "../../components/AuthShell";
import { useLanguage } from "../../components/LanguageProvider";
import { signIn } from "../../lib/auth";
import { getFriendlyAuthError } from "../../lib/auth-messages";
import { consumeNativeAuthError } from "../../components/NativeLinkProvider";

export default function LoginPage() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const isSpanish = language === "es";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (consumeNativeAuthError() !== "confirmation") return;

    setMessage(
      isSpanish
        ? "No pudimos confirmar ese enlace. Solicita un correo nuevo e intentalo otra vez."
        : "We could not confirm that link. Request a new email and try again."
    );
  }, [isSpanish]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage(
        isSpanish
          ? "Por favor completa todos los campos."
          : "Please fill out all fields."
      );
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        setMessage(getFriendlyAuthError(error, language));
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      setMessage(getFriendlyAuthError(error, language));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell
      language={language}
      setLanguage={setLanguage}
      disabled={isLoading}
      eyebrow={isSpanish ? "Iniciar sesión" : "Sign in"}
      title={
        isSpanish ? (
          <>
            Entra y descubre si{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              valió la pena
            </span>
            .
          </>
        ) : (
          <>
            Sign in and see if it{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              was worth it
            </span>
            .
          </>
        )
      }
      description={
        isSpanish
          ? "Accede a tu cuenta para revisar tus turnos, tu meta semanal y tu pago real por hora."
          : "Access your account to review shifts, weekly goals, and your true hourly pay."
      }
      sideEyebrow={isSpanish ? "Vuelve a tu panel" : "Back to your dashboard"}
      sideTitle={
        isSpanish ? (
          <>
            Todo tu trabajo gig,{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              explicado con claridad
            </span>
            .
          </>
        ) : (
          <>
            All your gig work,{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              made easier to read
            </span>
            .
          </>
        )
      }
      sideDescription={
        isSpanish
          ? "WIWI reúne millas, gasolina, impuestos y tiempo en una vista simple para que sepas exactamente cómo te fue."
          : "WIWI brings miles, fuel, taxes, and time into one simple view so you know exactly how your shift went."
      }
      sideActionHref="/signup"
      sideActionLabel={isSpanish ? "Crear una cuenta nueva" : "Create a new account"}
      footer={
        <div className="space-y-3">
          <p>
            {isSpanish ? "¿Necesitas una cuenta?" : "Need an account?"}{" "}
            <Link
              href="/signup"
              className="font-semibold text-sky-300 transition hover:text-sky-200"
            >
              {isSpanish ? "Créala aquí" : "Create one here"}
            </Link>
          </p>
          <p>
            <Link
              href="/"
              className="text-slate-500 transition hover:text-sky-300"
            >
              {isSpanish ? "Volver al inicio" : "Back to home"}
            </Link>
          </p>
          <p className="flex flex-wrap justify-center gap-3 text-xs">
            <Link
              href="/privacy"
              className="text-slate-500 transition hover:text-sky-300"
            >
              {isSpanish ? "Privacidad" : "Privacy"}
            </Link>
            <Link
              href="/terms"
              className="text-slate-500 transition hover:text-sky-300"
            >
              {isSpanish ? "Terminos" : "Terms"}
            </Link>
          </p>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="login-email"
            className="block text-sm font-medium text-slate-300"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="block w-full rounded-2xl border border-slate-700 bg-slate-950 px-12 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500 disabled:opacity-60"
              placeholder={isSpanish ? "tu@correo.com" : "you@example.com"}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-slate-300"
          >
            {isSpanish ? "Contraseña" : "Password"}
          </label>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="block w-full rounded-2xl border border-slate-700 bg-slate-950 px-12 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500 disabled:opacity-60"
              placeholder={isSpanish ? "Tu contraseña" : "Your password"}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-slate-400 transition hover:text-sky-300"
          >
            {isSpanish ? "¿Olvidaste tu contraseña?" : "Forgot password?"}
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 disabled:opacity-60"
        >
          <span>
            {isLoading
              ? isSpanish
                ? "Entrando..."
                : "Signing in..."
              : isSpanish
                ? "Entrar a WIWI"
                : "Sign in to WIWI"}
          </span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {message ? (
        <div className="mt-4 rounded-2xl border border-sky-500/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
          {message}
        </div>
      ) : null}
    </AuthShell>
  );
}
