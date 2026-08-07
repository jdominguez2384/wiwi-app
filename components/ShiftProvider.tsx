"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUserShifts } from "../lib/data/shifts";
import type { Shift } from "../lib/domain";
import { mapShiftRow, type ShiftRow } from "../lib/shiftRecord";
import { useAuth } from "./AuthProvider";

export type { Shift } from "../lib/domain";

type ShiftContextType = {
  shifts: Shift[];
  addShift: (shift: Shift) => void;
  updateShift: (shift: Shift) => void;
  removeShift: (shiftId: string) => void;
  isLoadingShifts: boolean;
  shiftsError: string | null;
  reloadShifts: () => Promise<void>;
};

const ShiftContext = createContext<ShiftContextType | null>(null);

export function ShiftProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoadingUser } = useAuth();
  const [state, setState] = useState<{
    ownerId: string | null;
    shifts: Shift[];
    error: string | null;
    isReloading: boolean;
  }>({ ownerId: null, shifts: [], error: null, isReloading: false });

  async function reloadShifts() {
    if (!user) {
      return;
    }

    setState((current) => ({ ...current, error: null, isReloading: true }));
    const { data, error } = await getUserShifts(user.id);

    if (error || !data) {
      console.error("Failed to load shifts", error);
      setState((current) => ({
        ...current,
        ownerId: user.id,
        error: "We could not load your shifts. Your saved data has not been changed.",
        isReloading: false,
      }));
      return;
    }

    setState({
      ownerId: user.id,
      shifts: data.map((shift) => mapShiftRow(shift as ShiftRow)),
      error: null,
      isReloading: false,
    });
  }

  useEffect(() => {
    if (!user) return;
    let isActive = true;

    void getUserShifts(user.id).then(({ data, error }) => {
      if (!isActive) return;

      if (error || !data) {
        console.error("Failed to load shifts", error);
        setState({
          ownerId: user.id,
          shifts: [],
          error: "We could not load your shifts. Your saved data has not been changed.",
          isReloading: false,
        });
        return;
      }

      setState({
        ownerId: user.id,
        shifts: data.map((shift) => mapShiftRow(shift as ShiftRow)),
        error: null,
        isReloading: false,
      });
    });

    return () => {
      isActive = false;
    };
  }, [user]);

  const isCurrentUser = Boolean(user && state.ownerId === user.id);
  const shifts = isCurrentUser ? state.shifts : [];
  const shiftsError = isCurrentUser ? state.error : null;
  const isLoadingShifts =
    isLoadingUser || Boolean(user && (!isCurrentUser || state.isReloading));

  function addShift(shift: Shift) {
    setState((current) => ({
      ...current,
      shifts: [shift, ...current.shifts],
    }));
  }

  function updateShift(updatedShift: Shift) {
    setState((current) => ({
      ...current,
      shifts: current.shifts.map((shift) =>
        shift.id === updatedShift.id ? updatedShift : shift
      ),
    }));
  }

  function removeShift(shiftId: string) {
    setState((current) => ({
      ...current,
      shifts: current.shifts.filter((shift) => shift.id !== shiftId),
    }));
  }

  return (
    <ShiftContext.Provider
      value={{
        shifts,
        addShift,
        updateShift,
        removeShift,
        isLoadingShifts,
        shiftsError,
        reloadShifts,
      }}
    >
      {children}
    </ShiftContext.Provider>
  );
}

export function useShifts() {
  const context = useContext(ShiftContext);

  if (!context) {
    throw new Error("useShifts must be used inside ShiftProvider");
  }

  return context;
}
