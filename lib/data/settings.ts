import { supabase } from "../supabase/client";

export async function getUserSettings(userId: string) {
  return supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .single();
}

export async function updateUserSettings(
  userId: string,
  values: {
    tax_rate: number;
    mpg: number;
    gas_price: number;
    weekly_goal: number;
  }
) {
  return supabase
    .from("user_settings")
    .update(values)
    .eq("user_id", userId)
    .select()
    .single();
}