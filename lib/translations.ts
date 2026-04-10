export type Language = "en" | "es";

export type TranslationStrings = {
  welcome: string;
  tagline: string;
  dashboard: string;
  addShift: string;
  settings: string;
  language: string;
};

export const translations: Record<Language, TranslationStrings> = {
  en: {
    welcome: "Welcome to WIWI",
    tagline: "See if the shift was worth it after miles, fuel, and taxes.",
    dashboard: "Dashboard",
    addShift: "Add Shift",
    settings: "Settings",
    language: "Language",
  },
  es: {
    welcome: "Bienvenido a WIWI",
    tagline: "Mira si el turno valio la pena despues de millas, gasolina e impuestos.",
    dashboard: "Panel",
    addShift: "Agregar turno",
    settings: "Ajustes",
    language: "Idioma",
  },
};
