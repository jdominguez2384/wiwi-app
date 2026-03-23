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
    welcome: "Welcome to RealRate",
    tagline: "See what you really made after miles, fuel, and taxes.",
    dashboard: "Dashboard",
    addShift: "Add Shift",
    settings: "Settings",
    language: "Language",
  },
  es: {
    welcome: "Bienvenido a RealRate",
    tagline: "Mira lo que realmente ganaste después de millas, gasolina e impuestos.",
    dashboard: "Panel",
    addShift: "Agregar turno",
    settings: "Ajustes",
    language: "Idioma",
  },
};