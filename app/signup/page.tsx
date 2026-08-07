"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, KeyRound, Mail, UserRound } from "lucide-react";
import { AuthShell } from "../../components/AuthShell";
import { useLanguage } from "../../components/LanguageProvider";
import { signUp } from "../../lib/auth";
import { getFriendlyAuthError } from "../../lib/auth-messages";

export default function SignupPage() {
  const { language, setLanguage } = useLanguage();
  const isSpanish = language === "es";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    if (!name || !email || !password) {
      setMessage(
        isSpanish
          ? "Por favor completa todos los campos."
          : "Please fill out all fields."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signUp(email, password, {
        display_name: name,
        preferred_language: language,
      });

      if (error) {
        setIsSuccess(false);
        setMessage(getFriendlyAuthError(error, language));
        return;
      }

      setIsSuccess(true);
      setMessage(
        isSpanish
          ? "Si este correo puede crear una cuenta nueva, te enviaremos un enlace de confirmacion. Si ya tienes cuenta, intenta iniciar sesion o restablecer tu contrasena."
          : "If this email can create a new account, we will send a confirmation link. If you already have an account, try signing in or resetting your password."
      );
    } catch (error) {
      setIsSuccess(false);
      setMessage(getFriendlyAuthError(error, language));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      language={language}
      setLanguage={setLanguage}
      disabled={isSubmitting}
      eyebrow={isSpanish ? "Crear cuenta" : "Create account"}
      title={
        isSpanish ? (
          <>
            Crea tu cuenta y empieza a ver si{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              valió la pena
            </span>
            .
          </>
        ) : (
          <>
            Create your account and see if it{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              was worth it
            </span>
            .
          </>
        )
      }
      description={
        isSpanish
          ? "Empieza a guardar turnos, comparar apps y entender tu ingreso real después de gasolina e impuestos."
          : "Start saving shifts, comparing apps, and understanding your real pay after gas and taxes."
      }
      sideEyebrow={isSpanish ? "Arranca con ventaja" : "Start with an edge"}
      sideTitle={
        isSpanish ? (
          <>
            Convierte cada turno en{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              mejores decisiones
            </span>
            .
          </>
        ) : (
          <>
            Turn every shift into{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              better decisions
            </span>
            .
          </>
        )
      }
      sideDescription={
        isSpanish
          ? "WIWI te ayuda a detectar qué apps, horarios y turnos realmente te convienen para crecer con más claridad."
          : "WIWI helps you spot which apps, hours, and shifts are actually helping you earn more."
      }
      sideActionHref="/login"
      sideActionLabel={isSpanish ? "Ya tengo cuenta" : "I already have an account"}
      footer={
        <div className="space-y-3">
          <p>
            {isSpanish ? "¿Ya tienes una cuenta?" : "Already have an account?"}{" "}
            <Link
              href="/login"
              className="font-semibold text-sky-300 transition hover:text-sky-200"
            >
              {isSpanish ? "Inicia sesión" : "Sign in"}
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
            htmlFor="signup-name"
            className="block text-sm font-medium text-slate-300"
          >
            {isSpanish ? "Nombre" : "Name"}
          </label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="signup-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="block w-full rounded-2xl border border-slate-700 bg-slate-950 px-12 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500 disabled:opacity-60"
              placeholder={isSpanish ? "Tu nombre" : "Your name"}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="signup-email"
            className="block text-sm font-medium text-slate-300"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="block w-full rounded-2xl border border-slate-700 bg-slate-950 px-12 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500 disabled:opacity-60"
              placeholder={isSpanish ? "tu@correo.com" : "you@example.com"}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="signup-password"
            className="block text-sm font-medium text-slate-300"
          >
            {isSpanish ? "Contraseña" : "Password"}
          </label>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              className="block w-full rounded-2xl border border-slate-700 bg-slate-950 px-12 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500 disabled:opacity-60"
              placeholder={isSpanish ? "Crea una contraseña" : "Create a password"}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 disabled:opacity-60"
        >
          <span>
            {isSubmitting
              ? isSpanish
                ? "Creando cuenta..."
                : "Creating account..."
              : isSpanish
                ? "Crear cuenta en WIWI"
                : "Create WIWI account"}
          </span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {message ? (
        <div
          role={isSuccess ? "status" : "alert"}
          aria-live="polite"
          className={`mt-4 rounded-2xl border px-4 py-4 text-sm ${
            isSuccess
              ? "border-sky-500/20 bg-sky-500/10 text-sky-100"
              : "border-rose-400/30 bg-rose-500/10 text-rose-100"
          }`}
        >
          {!isSuccess ? (
            <p className="mb-2 font-semibold">
              {isSpanish
                ? "No se pudo crear la cuenta"
                : "Account not created"}
            </p>
          ) : null}
          <p>{message}</p>

          {isSuccess ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-sky-400"
              >
                {isSpanish ? "Ir a iniciar sesion" : "Go to sign in"}
              </Link>
              <Link
                href="/forgot-password"
                className="inline-flex items-center justify-center rounded-2xl border border-sky-500/20 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-sky-100 transition hover:border-sky-400/40"
              >
                {isSpanish ? "Restablecer contrasena" : "Reset password"}
              </Link>
            </div>
          ) : (
            <Link
              href="/support"
              className="mt-3 inline-flex font-semibold text-rose-200 underline decoration-rose-300/40 underline-offset-4 transition hover:text-white"
            >
              {isSpanish ? "Obtener ayuda" : "Get help"}
            </Link>
          )}
        </div>
      ) : null}
    </AuthShell>
  );
}
