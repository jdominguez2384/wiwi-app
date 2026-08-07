"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUserProfile } from "../lib/data/profile";
import { defaultPlan, resolvePlanKey, type PlanKey } from "../lib/plans";
import { useAuth } from "./AuthProvider";

type PlanContextType = {
  plan: PlanKey;
  isPro: boolean;
  isLoadingPlan: boolean;
  reloadPlan: () => Promise<void>;
};

const PlanContext = createContext<PlanContextType | null>(null);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoadingUser } = useAuth();
  const [state, setState] = useState<{
    ownerId: string | null;
    plan: PlanKey;
    isReloading: boolean;
  }>({ ownerId: null, plan: defaultPlan, isReloading: false });

  async function reloadPlan() {
    if (!user) return;

    setState((current) => ({ ...current, isReloading: true }));
    const { data, error } = await getUserProfile(user.id);
    setState({
      ownerId: user.id,
      plan: error || !data ? defaultPlan : resolvePlanKey(data),
      isReloading: false,
    });
  }

  useEffect(() => {
    if (!user) return;
    let isActive = true;

    void getUserProfile(user.id).then(({ data, error }) => {
      if (!isActive) return;

      setState({
        ownerId: user.id,
        plan: error || !data ? defaultPlan : resolvePlanKey(data),
        isReloading: false,
      });
    });

    return () => {
      isActive = false;
    };
  }, [user]);

  const isCurrentUser = Boolean(user && state.ownerId === user.id);
  const plan = isCurrentUser ? state.plan : defaultPlan;
  const isLoadingPlan =
    isLoadingUser || Boolean(user && (!isCurrentUser || state.isReloading));

  return (
    <PlanContext.Provider
      value={{
        plan,
        isPro: plan === "pro",
        isLoadingPlan,
        reloadPlan,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);

  if (!context) {
    throw new Error("usePlan must be used inside PlanProvider");
  }

  return context;
}
