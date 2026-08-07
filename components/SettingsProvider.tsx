"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUserSettings } from "../lib/data/settings";
import type { AppSettings } from "../lib/domain";
import { useAuth } from "./AuthProvider";

export type { AppSettings } from "../lib/domain";

type SettingsContextType = {
  settings: AppSettings;
  updateSettings: (values: Partial<AppSettings>) => void;
  isLoadingSettings: boolean;
  settingsError: string | null;
  reloadSettings: () => Promise<void>;
};

export const defaultSettings: AppSettings = {
  taxRate: 0.2,
  mpg: 27,
  gasPrice: 3.45,
  weeklyGoal: 800,
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoadingUser } = useAuth();
  const [state, setState] = useState<{
    ownerId: string | null;
    settings: AppSettings;
    error: string | null;
    isReloading: boolean;
  }>({
    ownerId: null,
    settings: defaultSettings,
    error: null,
    isReloading: false,
  });

  async function reloadSettings() {
    if (!user) {
      return;
    }

    setState((current) => ({ ...current, error: null, isReloading: true }));
    const { data, error } = await getUserSettings(user.id);

    if (error || !data) {
      console.error("Failed to load settings", error);
      setState((current) => ({
        ...current,
        ownerId: user.id,
        error: "We could not load your calculation settings.",
        isReloading: false,
      }));
      return;
    }

    setState({
      ownerId: user.id,
      settings: {
        taxRate: Number(data.tax_rate),
        mpg: Number(data.mpg),
        gasPrice: Number(data.gas_price),
        weeklyGoal: Number(data.weekly_goal),
      },
      error: null,
      isReloading: false,
    });
  }

  useEffect(() => {
    if (!user) return;
    let isActive = true;

    void getUserSettings(user.id).then(({ data, error }) => {
      if (!isActive) return;

      if (error || !data) {
        console.error("Failed to load settings", error);
        setState({
          ownerId: user.id,
          settings: defaultSettings,
          error: "We could not load your calculation settings.",
          isReloading: false,
        });
        return;
      }

      setState({
        ownerId: user.id,
        settings: {
          taxRate: Number(data.tax_rate),
          mpg: Number(data.mpg),
          gasPrice: Number(data.gas_price),
          weeklyGoal: Number(data.weekly_goal),
        },
        error: null,
        isReloading: false,
      });
    });

    return () => {
      isActive = false;
    };
  }, [user]);

  const isCurrentUser = Boolean(user && state.ownerId === user.id);
  const settings = isCurrentUser ? state.settings : defaultSettings;
  const settingsError = isCurrentUser ? state.error : null;
  const isLoadingSettings =
    isLoadingUser || Boolean(user && (!isCurrentUser || state.isReloading));

  function updateSettings(values: Partial<AppSettings>) {
    setState((current) => ({
      ...current,
      settings: { ...current.settings, ...values },
    }));
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        isLoadingSettings,
        settingsError,
        reloadSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }

  return context;
}
