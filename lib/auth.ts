import { supabase } from "./supabase/client";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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
      emailRedirectTo: `${siteUrl}/auth/confirmed`,
    },
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
    redirectTo: `${siteUrl}/reset-password`,
  });
}

export async function updatePassword(password: string) {
  return supabase.auth.updateUser({
    password,
  });
}