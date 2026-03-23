"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "../lib/auth";
import { getUserSettings } from "../lib/data/settings";
import { supabase } from "../lib/supabase/client";

export type AppSettings = {
  taxRate: number;
  mpg: number;
  gasPrice: number;
  weeklyGoal: number;
};

type SettingsContextType = {
  settings: AppSettings;
  updateSettings: (values: Partial<AppSettings>) => void;
};

const defaultSettings: AppSettings = {
  taxRate: 0.2,
  mpg: 27,
  gasPrice: 3.45,
  weeklyGoal: 800,
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  async function loadSettings() {
    const user = await getCurrentUser();

    if (!user) {
      setSettings(defaultSettings);
      return;
    }

    const { data, error } = await getUserSettings(user.id);

    if (error || !data) {
      setSettings(defaultSettings);
      return;
    }

    setSettings({
      taxRate: Number(data.tax_rate),
      mpg: Number(data.mpg),
      gasPrice: Number(data.gas_price),
      weeklyGoal: Number(data.weekly_goal),
    });
  }

  useEffect(() => {
    loadSettings();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadSettings();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  function updateSettings(values: Partial<AppSettings>) {
    setSettings((prev) => ({
      ...prev,
      ...values,
    }));
  }

  const value = useMemo(() => {
    return {
      settings,
      updateSettings,
    };
  }, [settings]);

  return (
    <SettingsContext.Provider value={value}>
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