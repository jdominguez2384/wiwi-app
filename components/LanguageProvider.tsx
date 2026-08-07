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

  useEffect(() => {
    if (!user) return;
    let isActive = true;

    void getUserProfile(user.id).then(({ data, error }) => {
      if (!isActive || error || !data) return;

      setLanguageState(data.preferred_language === "es" ? "es" : "en");
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
      value={{ language, setLanguage, t: translations[language] }}
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
