"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "../../components/LanguageProvider";
import { updatePassword } from "../../lib/auth";
import { supabase } from "../../lib/supabase/client";

export default function ResetPasswordPage() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function handleRecovery() {
      // 👇 This is the missing piece
      const hash = window.location.hash;

      if (hash) {
        const params = new URLSearchParams(hash.replace("#", ""));
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");

        if (access_token && refresh_token) {
          await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          setReady(true);
          return;
        }
      }

      // fallback: check existing session
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setReady(true);
      }
    }

    handleRecovery();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!password || !confirmPassword) {
      setMessage(
        language === "en"
          ? "Please fill out all fields."
          : "Por favor completa todos los campos."
      );
      return;
    }

    if (password !== confirmPassword) {
      setMessage(
        language === "en"
          ? "Passwords do not match."
          : "Las contraseñas no coinciden."
      );
      return;
    }

    setIsUpdating(true);

    try {
      const { error } = await updatePassword(password);

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage(
        language === "en"
          ? "Password updated. Redirecting to login..."
          : "Contraseña actualizada. Redirigiendo al inicio de sesión..."
      );

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => setLanguage("en")}
            disabled={isUpdating}
            className={`rounded-xl border px-4 py-2 ${
              language === "en" ? "bg-black text-white" : "bg-white"
            } disabled:opacity-60`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("es")}
            disabled={isUpdating}
            className={`rounded-xl border px-4 py-2 ${
              language === "es" ? "bg-black text-white" : "bg-white"
            } disabled:opacity-60`}
          >
            ES
          </button>
        </div>

        <p className="text-sm text-zinc-500">RealRate</p>
        <h1 className="text-3xl font-semibold mt-2">
          {language === "en" ? "Reset password" : "Restablecer contraseña"}
        </h1>
        <p className="text-zinc-600 mt-3">
          {language === "en"
            ? "Enter your new password below."
            : "Ingresa tu nueva contraseña abajo."}
        </p>

        {!ready ? (
          <p className="text-sm text-zinc-600 mt-6">
            {language === "en"
              ? "Invalid or expired reset link."
              : "Enlace inválido o expirado."}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-700">
                {language === "en" ? "New password" : "Nueva contraseña"}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isUpdating}
                className="block w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3 disabled:opacity-60"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-700">
                {language === "en"
                  ? "Confirm new password"
                  : "Confirmar nueva contraseña"}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isUpdating}
                className="block w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3 disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full rounded-xl bg-black text-white px-4 py-3 disabled:opacity-60"
            >
              {isUpdating
                ? language === "en"
                  ? "Updating..."
                  : "Actualizando..."
                : language === "en"
                ? "Update password"
                : "Actualizar contraseña"}
            </button>
          </form>
        )}

        {message ? (
          <p className="text-sm text-zinc-600 mt-4">{message}</p>
        ) : null}

        <p className="text-sm text-zinc-600 mt-6">
          <Link href="/login" className="underline">
            {language === "en"
              ? "Back to sign in"
              : "Volver a iniciar sesión"}
          </Link>
        </p>
      </div>
    </main>
  );
}