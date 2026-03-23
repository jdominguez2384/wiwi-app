import { supabase } from "../supabase/client";

export async function getUserProfile(userId: string) {
  return supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
}

export async function updateUserProfile(
  userId: string,
  values: {
    preferred_language: string;
  }
) {
  return supabase
    .from("profiles")
    .update(values)
    .eq("id", userId)
    .select()
    .single();
}