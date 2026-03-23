"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  translations,
  type Language,
  type TranslationStrings,
} from "../lib/translations";
import { getCurrentUser } from "../lib/auth";
import { getUserProfile, updateUserProfile } from "../lib/data/profile";
import { supabase } from "../lib/supabase/client";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationStrings;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguageState] = useState<Language>("en");

  async function loadLanguage() {
    const user = await getCurrentUser();

    if (!user) {
      setLanguageState("en");
      return;
    }

    const { data, error } = await getUserProfile(user.id);

    if (error || !data) {
      setLanguageState("en");
      return;
    }

    const nextLanguage: Language =
      data.preferred_language === "es" ? "es" : "en";

    setLanguageState(nextLanguage);
  }

  useEffect(() => {
    loadLanguage();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadLanguage();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  function setLanguage(lang: Language) {
    setLanguageState(lang);

    void (async () => {
      const user = await getCurrentUser();

      if (!user) return;

      await updateUserProfile(user.id, {
        preferred_language: lang,
      });
    })();
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translations[language],
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}