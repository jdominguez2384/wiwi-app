import { supabase } from "../supabase/client";

export type CostProfileWriteInput = {
  user_id: string;
  name: string;
  tax_rate: number;
  mpg: number;
  gas_price: number;
};

export async function getUserCostProfiles(userId: string) {
  return supabase
    .from("cost_profiles")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
}

export async function createCostProfile(input: CostProfileWriteInput) {
  return supabase.from("cost_profiles").insert(input).select().single();
}

export async function updateCostProfile(
  profileId: string,
  userId: string,
  input: Omit<CostProfileWriteInput, "user_id">
) {
  return supabase
    .from("cost_profiles")
    .update(input)
    .eq("id", profileId)
    .eq("user_id", userId)
    .select()
    .single();
}

export async function deleteCostProfile(profileId: string, userId: string) {
  return supabase
    .from("cost_profiles")
    .delete()
    .eq("id", profileId)
    .eq("user_id", userId);
}
