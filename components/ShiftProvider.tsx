"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "../lib/auth";
import { getUserShifts } from "../lib/data/shifts";
import { supabase } from "../lib/supabase/client";

export type Shift = {
  id: string;
  date: string;
  appName: string;
  grossEarnings: number;
  hoursWorked: number;
  milesDriven: number;
};

type ShiftContextType = {
  shifts: Shift[];
  addShift: (shift: Shift) => void;
  updateShift: (shift: Shift) => void;
  removeShift: (shiftId: string) => void;
};

const ShiftContext = createContext<ShiftContextType | null>(null);

export function ShiftProvider({ children }: { children: React.ReactNode }) {
  const [shifts, setShifts] = useState<Shift[]>([]);

  async function loadShifts() {
    const user = await getCurrentUser();

    if (!user) {
      setShifts([]);
      return;
    }

    const { data, error } = await getUserShifts(user.id);

    if (error || !data) {
      setShifts([]);
      return;
    }

    setShifts(
      data.map((shift) => ({
        id: shift.id,
        date: shift.shift_date,
        appName: shift.app_name,
        grossEarnings: Number(shift.gross_earnings),
        hoursWorked: Number(shift.hours_worked),
        milesDriven: Number(shift.miles_driven),
      }))
    );
  }

  useEffect(() => {
    loadShifts();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadShifts();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  function addShift(shift: Shift) {
    setShifts((prev) => [shift, ...prev]);
  }

  function updateShift(updatedShift: Shift) {
    setShifts((prev) =>
      prev.map((shift) => (shift.id === updatedShift.id ? updatedShift : shift))
    );
  }

  function removeShift(shiftId: string) {
    setShifts((prev) => prev.filter((shift) => shift.id !== shiftId));
  }

  const value = useMemo(() => {
    return {
      shifts,
      addShift,
      updateShift,
      removeShift,
    };
  }, [shifts]);

  return <ShiftContext.Provider value={value}>{children}</ShiftContext.Provider>;
}

export function useShifts() {
  const context = useContext(ShiftContext);

  if (!context) {
    throw new Error("useShifts must be used inside ShiftProvider");
  }

  return context;
}