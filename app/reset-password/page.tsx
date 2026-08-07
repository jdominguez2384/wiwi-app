"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, KeyRound, ShieldCheck } from "lucide-react";
import { AuthShell } from "../../components/AuthShell";
import { useLanguage } from "../../components/LanguageProvider";
import { signOut, updatePassword } from "../../lib/auth";
import { getFriendlyAuthError } from "../../lib/auth-messages";
import { supabase } from "../../lib/supabase/client";

export default function ResetPasswordPage() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const isSpanish = language === "es";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);
  const [isCheckingRecovery, setIsCheckingRecovery] = useState(true);
  const [recoveryError, setRecoveryError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let isActive = true;

    function finishChecking(nextReady: boolean, errorMessage = "") {
      if (!isActive) return;
      setReady(nextReady);
      setRecoveryError(errorMessage);
      setIsCheckingRecovery(false);
    }

    function clearRecoveryUrl() {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    async function handleRecovery() {
      setIsCheckingRecovery(true);

      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
          clearRecoveryUrl();
          finishChecking(true);
          return;
        }

        finishChecking(
          false,
          isSpanish
            ? "No pudimos verificar este enlace. Solicita uno nuevo."
            : "We could not verify this link. Request a new one."
        );
        return;
      }

      const hash = window.location.hash;

      if (hash) {
        const params = new URLSearchParams(hash.replace("#", ""));
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");

        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (!error) {
            clearRecoveryUrl();
            finishChecking(true);
            return;
          }

          finishChecking(
            false,
            isSpanish
              ? "No pudimos abrir este enlace. Solicita uno nuevo."
              : "We could not open this link. Request a new one."
          );
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        finishChecking(true);
        return;
      }

      finishChecking(false);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        finishChecking(true);
      }
    });

    void handleRecovery();

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [isSpanish]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!password || !confirmPassword) {
      setMessage(
        isSpanish
          ? "Por favor completa todos los campos."
          : "Please fill out all fields."
      );
      return;
    }

    if (password !== confirmPassword) {
      setMessage(
        isSpanish
          ? "Las contraseñas no coinciden."
          : "Passwords do not match."
      );
      return;
    }

    setIsUpdating(true);

    try {
      const { error } = await updatePassword(password);

      if (error) {
        setMessage(getFriendlyAuthError(error, language));
        return;
      }

      setMessage(
        isSpanish
          ? "Contraseña actualizada. Redirigiendo..."
          : "Password updated. Redirecting..."
      );

      setTimeout(() => {
        void signOut();
        router.push("/login");
      }, 1500);
    } catch (error) {
      setMessage(getFriendlyAuthError(error, language));
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <AuthShell
      language={language}
      setLanguage={setLanguage}
      disabled={isUpdating}
      eyebrow={isSpanish ? "Nueva contraseña" : "New password"}
      title={
        isSpanish ? (
          <>
            Protege tu cuenta y vuelve a ver si{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              valió la pena
            </span>
            .
          </>
        ) : (
          <>
            Protect your account and get back to seeing if it{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              was worth it
            </span>
            .
          </>
        )
      }
      description={
        isSpanish
          ? "Elige una contraseña nueva para volver a entrar a tu panel de WIWI."
          : "Choose a new password to get back into your WIWI dashboard."
      }
      sideEyebrow={isSpanish ? "Seguridad simple" : "Simple security"}
      sideTitle={
        isSpanish ? (
          <>
            Vuelve rápido a tus{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              métricas reales
            </span>
            .
          </>
        ) : (
          <>
            Get back quickly to your{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              real earnings view
            </span>
            .
          </>
        )
      }
      sideDescription={
        isSpanish
          ? "Una vez actualices tu contraseña, podrás revisar otra vez tus turnos, tu progreso semanal y tus mejores resultados."
          : "Once your password is updated, you can jump back into your shifts, weekly progress, and best results."
      }
      sideActionHref="/login"
      sideActionLabel={isSpanish ? "Ir a iniciar sesión" : "Go to sign in"}
      footer={
        <div className="space-y-3">
          <p>
            <Link
              href="/login"
              className="font-semibold text-sky-300 transition hover:text-sky-200"
            >
              {isSpanish ? "Volver a iniciar sesión" : "Back to sign in"}
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
        </div>
      }
    >
      {isCheckingRecovery ? (
        <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 px-4 py-4 text-sm text-sky-100">
          {isSpanish
            ? "Verificando tu enlace de restablecimiento..."
            : "Verifying your reset link..."}
        </div>
      ) : !ready ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 px-4 py-4 text-sm text-orange-100">
            {recoveryError || (isSpanish
              ? "El enlace para restablecer la contraseña es inválido o ha expirado."
              : "The password reset link is invalid or has expired.")}
          </div>

          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
          >
            <ArrowRight className="h-4 w-4" />
            <span>
              {isSpanish
                ? "Solicitar un nuevo enlace"
                : "Request a new reset link"}
            </span>
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-slate-300"
              >
                {isSpanish ? "Nueva contraseña" : "New password"}
              </label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="new-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isUpdating}
                  className="block w-full rounded-2xl border border-slate-700 bg-slate-950 px-12 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500 disabled:opacity-60"
                  placeholder={isSpanish ? "Crea una contraseña nueva" : "Create a new password"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-slate-300"
              >
                {isSpanish ? "Confirmar contraseña" : "Confirm password"}
              </label>
              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isUpdating}
                  className="block w-full rounded-2xl border border-slate-700 bg-slate-950 px-12 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500 disabled:opacity-60"
                  placeholder={isSpanish ? "Confirma tu contraseña" : "Confirm your password"}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 disabled:opacity-60"
            >
              <span>
                {isUpdating
                  ? isSpanish
                    ? "Actualizando..."
                    : "Updating..."
                  : isSpanish
                    ? "Actualizar contraseña"
                    : "Update password"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {message ? (
            <div className="mt-4 rounded-2xl border border-sky-500/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
              {message}
            </div>
          ) : null}
        </>
      )}
    </AuthShell>
  );
}
