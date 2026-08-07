import { supabase } from "../supabase/client";

export async function getUserShifts(userId: string) {
  return supabase
    .from("shifts")
    .select("*")
    .eq("user_id", userId)
    .order("shift_date", { ascending: false });
}

export async function getUserShift(shiftId: string, userId: string) {
  return supabase
    .from("shifts")
    .select("*")
    .eq("id", shiftId)
    .eq("user_id", userId)
    .maybeSingle();
}

export type ShiftWriteInput = {
  user_id: string;
  shift_date: string;
  app_name: string;
  gross_earnings: number;
  hours_worked: number;
  miles_driven: number;
  other_expenses: number;
  tax_rate_snapshot: number;
  mpg_snapshot: number;
  gas_price_snapshot: number;
  cost_profile_id: string | null;
  cost_profile_name_snapshot: string | null;
  notes: string;
  tags: string[];
};

export async function createUserShift(input: ShiftWriteInput) {
  return supabase
    .from("shifts")
    .insert(input)
    .select()
    .single();
}

export async function updateUserShift(
  shiftId: string,
  userId: string,
  input: Omit<ShiftWriteInput, "user_id">
) {
  return supabase
    .from("shifts")
    .update(input)
    .eq("id", shiftId)
    .eq("user_id", userId)
    .select()
    .single();
}

export async function deleteUserShift(shiftId: string, userId: string) {
  return supabase
    .from("shifts")
    .delete()
    .eq("id", shiftId)
    .eq("user_id", userId);
}
