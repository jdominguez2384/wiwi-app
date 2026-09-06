import { Capacitor } from "@capacitor/core";
import { supabase } from "./supabase/client";
import { getEmailConfirmationRedirectUrl } from "./emailConfirmation";
import {
  getNativeAuthRedirectUrl,
  type NativeAuthPath,
} from "./nativeLinks";

function getWebOrigin() {
  if (!Capacitor.isNativePlatform() && typeof window !== "undefined") {
    return window.location.origin;
  }

  return process.env.NEXT_PUBLIC_SITE_URL || "https://getwiwi.com";
}

function getAuthRedirectUrl(path: NativeAuthPath) {
  // Signup email may be opened on a different device from the app.
  if (path === "/auth/confirmed") {
    return getEmailConfirmationRedirectUrl(getWebOrigin());
  }
  if (Capacitor.isNativePlatform()) return getNativeAuthRedirectUrl(path);
  return new URL(path, getWebOrigin()).href;
}

export async function signUp(
  email: string,
  password: string,
  metadata?: Record<string, unknown>
) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata || {},
      emailRedirectTo: getAuthRedirectUrl("/auth/confirmed"),
    },
  });
}

export async function resendConfirmationEmail(email: string) {
  return supabase.auth.resend({
    type: "signup",
    email: email.trim(),
    options: { emailRedirectTo: getAuthRedirectUrl("/auth/confirmed") },
  });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function sendPasswordResetEmail(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getAuthRedirectUrl("/reset-password"),
  });
}

export async function updatePassword(password: string) {
  return supabase.auth.updateUser({
    password,
  });
}
