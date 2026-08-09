"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useLanguage } from "./LanguageProvider";
import { WiwiTutorial } from "./WiwiTutorial";
import { supabase } from "../lib/supabase/client";
import {
  getTutorialCompletionVersion,
  getTutorialStorageKey,
  TUTORIAL_VERSION,
} from "../lib/tutorial";

type TutorialContextType = {
  openTutorial: () => void;
};

const TutorialContext = createContext<TutorialContextType | null>(null);

function isAppRoute(pathname: string) {
  return (
    pathname === "/dashboard" ||
    pathname === "/add-shift" ||
    pathname === "/history" ||
    pathname === "/insights" ||
    pathname === "/settings" ||
    pathname.startsWith("/edit-shift")
  );
}

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoadingUser } = useAuth();
  const { isLoadingLanguage } = useLanguage();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const autoShownForUser = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      autoShownForUser.current = null;
      return;
    }

    if (
      isLoadingUser ||
      isLoadingLanguage ||
      !isAppRoute(pathname) ||
      autoShownForUser.current === user.id
    ) {
      return;
    }

    const metadataVersion = getTutorialCompletionVersion(
      user.user_metadata?.wiwi_onboarding_version
    );
    let localVersion = 0;

    try {
      localVersion = getTutorialCompletionVersion(
        window.localStorage.getItem(getTutorialStorageKey(user.id))
      );
    } catch {
      localVersion = 0;
    }

    autoShownForUser.current = user.id;
    if (Math.max(metadataVersion, localVersion) < TUTORIAL_VERSION) {
      const openTimer = window.setTimeout(() => setIsOpen(true), 0);
      return () => window.clearTimeout(openTimer);
    }
  }, [isLoadingLanguage, isLoadingUser, pathname, user]);

  function openTutorial() {
    setIsOpen(true);
  }

  function completeTutorial() {
    setIsOpen(false);

    if (!user) return;

    try {
      window.localStorage.setItem(
        getTutorialStorageKey(user.id),
        String(TUTORIAL_VERSION)
      );
    } catch {
      // Account metadata remains the durable fallback when local storage is unavailable.
    }

    void supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        wiwi_onboarding_version: TUTORIAL_VERSION,
        wiwi_onboarding_completed_at: new Date().toISOString(),
      },
    });
  }

  return (
    <TutorialContext.Provider value={{ openTutorial }}>
      {children}
      {isOpen && user ? <WiwiTutorial onClose={completeTutorial} /> : null}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);

  if (!context) {
    throw new Error("useTutorial must be used inside TutorialProvider");
  }

  return context;
}
