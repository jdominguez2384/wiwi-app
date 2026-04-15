"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getCurrentUser } from "../lib/auth";
import { getUserProfile } from "../lib/data/profile";
import { defaultPlan, resolvePlanKey, type PlanKey } from "../lib/plans";
import { supabase } from "../lib/supabase/client";

type PlanContextType = {
  plan: PlanKey;
  isPro: boolean;
  isLoadingPlan: boolean;
  reloadPlan: () => Promise<void>;
};

const PlanContext = createContext<PlanContextType | null>(null);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<PlanKey>(defaultPlan);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);

  async function loadPlan() {
    setIsLoadingPlan(true);

    try {
      const user = await getCurrentUser();

      if (!user) {
        setPlan(defaultPlan);
        return;
      }

      const { data, error } = await getUserProfile(user.id);

      if (error || !data) {
        setPlan(defaultPlan);
        return;
      }

      setPlan(resolvePlanKey(data));
    } finally {
      setIsLoadingPlan(false);
    }
  }

  useEffect(() => {
    void loadPlan();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void loadPlan();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      plan,
      isPro: plan === "pro",
      isLoadingPlan,
      reloadPlan: loadPlan,
    }),
    [isLoadingPlan, plan]
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const context = useContext(PlanContext);

  if (!context) {
    throw new Error("usePlan must be used inside PlanProvider");
  }

  return context;
}
