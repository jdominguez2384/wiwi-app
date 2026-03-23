import { supabase } from "../supabase/client";

export async function getUserShifts(userId: string) {
  return supabase
    .from("shifts")
    .select("*")
    .eq("user_id", userId)
    .order("shift_date", { ascending: false });
}

export async function createUserShift(input: {
  user_id: string;
  shift_date: string;
  app_name: string;
  gross_earnings: number;
  hours_worked: number;
  miles_driven: number;
}) {
  return supabase
    .from("shifts")
    .insert(input)
    .select()
    .single();
}

export async function updateUserShift(
  shiftId: string,
  input: {
    shift_date: string;
    app_name: string;
    gross_earnings: number;
    hours_worked: number;
    miles_driven: number;
  }
) {
  return supabase
    .from("shifts")
    .update(input)
    .eq("id", shiftId)
    .select()
    .single();
}

export async function deleteUserShift(shiftId: string) {
  return supabase
    .from("shifts")
    .delete()
    .eq("id", shiftId);
}