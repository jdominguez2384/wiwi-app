"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUserCostProfiles } from "../lib/data/costProfiles";
import type { CostProfile } from "../lib/domain";
import {
  mapCostProfileRow,
  type CostProfileRow,
} from "../lib/costProfiles";
import { useAuth } from "./AuthProvider";

type CostProfileContextType = {
  costProfiles: CostProfile[];
  isLoadingCostProfiles: boolean;
  costProfilesError: string | null;
  addCostProfile: (profile: CostProfile) => void;
  updateCostProfile: (profile: CostProfile) => void;
  removeCostProfile: (profileId: string) => void;
  reloadCostProfiles: () => Promise<void>;
};

const CostProfileContext = createContext<CostProfileContextType | null>(null);

export function CostProfileProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoadingUser } = useAuth();
  const [state, setState] = useState<{
    ownerId: string | null;
    profiles: CostProfile[];
    error: string | null;
    isReloading: boolean;
  }>({ ownerId: null, profiles: [], error: null, isReloading: false });

  async function reloadCostProfiles() {
    if (!user) return;

    setState((current) => ({ ...current, error: null, isReloading: true }));
    const { data, error } = await getUserCostProfiles(user.id);

    if (error || !data) {
      console.error("Failed to load cost profiles", error);
      setState((current) => ({
        ...current,
        ownerId: user.id,
        error: "We could not load your cost profiles.",
        isReloading: false,
      }));
      return;
    }

    setState({
      ownerId: user.id,
      profiles: data.map((profile) =>
        mapCostProfileRow(profile as CostProfileRow)
      ),
      error: null,
      isReloading: false,
    });
  }

  useEffect(() => {
    if (!user) return;
    let isActive = true;

    void getUserCostProfiles(user.id).then(({ data, error }) => {
      if (!isActive) return;

      if (error || !data) {
        console.error("Failed to load cost profiles", error);
        setState({
          ownerId: user.id,
          profiles: [],
          error: "We could not load your cost profiles.",
          isReloading: false,
        });
        return;
      }

      setState({
        ownerId: user.id,
        profiles: data.map((profile) =>
          mapCostProfileRow(profile as CostProfileRow)
        ),
        error: null,
        isReloading: false,
      });
    });

    return () => {
      isActive = false;
    };
  }, [user]);

  const isCurrentUser = Boolean(user && state.ownerId === user.id);
  const costProfiles = isCurrentUser ? state.profiles : [];
  const costProfilesError = isCurrentUser ? state.error : null;
  const isLoadingCostProfiles =
    isLoadingUser || Boolean(user && (!isCurrentUser || state.isReloading));

  function addCostProfile(profile: CostProfile) {
    setState((current) => ({
      ...current,
      profiles: [...current.profiles, profile],
    }));
  }

  function updateCostProfile(updatedProfile: CostProfile) {
    setState((current) => ({
      ...current,
      profiles: current.profiles.map((profile) =>
        profile.id === updatedProfile.id ? updatedProfile : profile
      ),
    }));
  }

  function removeCostProfile(profileId: string) {
    setState((current) => ({
      ...current,
      profiles: current.profiles.filter((profile) => profile.id !== profileId),
    }));
  }

  return (
    <CostProfileContext.Provider
      value={{
        costProfiles,
        isLoadingCostProfiles,
        costProfilesError,
        addCostProfile,
        updateCostProfile,
        removeCostProfile,
        reloadCostProfiles,
      }}
    >
      {children}
    </CostProfileContext.Provider>
  );
}

export function useCostProfiles() {
  const context = useContext(CostProfileContext);

  if (!context) {
    throw new Error("useCostProfiles must be used inside CostProfileProvider");
  }

  return context;
}
