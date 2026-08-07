"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  translations,
  type Language,
  type TranslationStrings,
} from "../lib/translations";
import { getUserProfile, updateUserProfile } from "../lib/data/profile";
import { useAuth } from "./AuthProvider";

type LanguageContextType = {
  language: Language;
  isLoadingLanguage: boolean;
  setLanguage: (lang: Language) => void;
  t: TranslationStrings;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [language, setLanguageState] = useState<Language>("en");
  const [resolvedUserId, setResolvedUserId] = useState<string | null>(null);
  const isLoadingLanguage = Boolean(user && resolvedUserId !== user.id);

  useEffect(() => {
    if (!user) return;

    let isActive = true;
    const metadataLanguage =
      user.user_metadata?.preferred_language === "es" ? "es" : "en";

    void getUserProfile(user.id).then(({ data, error }) => {
      if (!isActive) return;

      setLanguageState(
        !error && data
          ? data.preferred_language === "es"
            ? "es"
            : "en"
          : metadataLanguage
      );
      setResolvedUserId(user.id);
    });

    return () => {
      isActive = false;
    };
  }, [user]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function setLanguage(lang: Language) {
    setLanguageState(lang);

    if (user) {
      void updateUserProfile(user.id, {
        preferred_language: lang,
      });
    }
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        isLoadingLanguage,
        setLanguage,
        t: translations[language],
      }}
    >
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
