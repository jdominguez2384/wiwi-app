import type { Language } from "./translations";

export type PlanKey = "free" | "pro";

export type PlanFeatureKey =
  | "shift_tracking"
  | "real_pay_calculator"
  | "basic_insights"
  | "export_reports"
  | "advanced_insights"
  | "goal_forecasting"
  | "custom_cost_profiles";

type PlanProfileFields = {
  plan?: unknown;
  subscription_plan?: unknown;
  is_pro?: unknown;
};

export const defaultPlan: PlanKey = "free";

export const planFeatures: Record<
  PlanFeatureKey,
  {
    includedOnFree: boolean;
    label: Record<Language, string>;
    description: Record<Language, string>;
  }
> = {
  shift_tracking: {
    includedOnFree: true,
    label: {
      en: "Shift tracking",
      es: "Registro de turnos",
    },
    description: {
      en: "Save shifts, miles, hours, and gross earnings.",
      es: "Guarda turnos, millas, horas e ingresos brutos.",
    },
  },
  real_pay_calculator: {
    includedOnFree: true,
    label: {
      en: "Real-pay calculator",
      es: "Calculadora de pago real",
    },
    description: {
      en: "Estimate net pay after fuel and tax set-asides.",
      es: "Estima pago neto después de gasolina e impuestos.",
    },
  },
  basic_insights: {
    includedOnFree: true,
    label: {
      en: "Basic insights",
      es: "Análisis básico",
    },
    description: {
      en: "See weekly totals, app breakdowns, and your best shift.",
      es: "Ve totales semanales, rendimiento por app y mejor turno.",
    },
  },
  export_reports: {
    includedOnFree: false,
    label: {
      en: "CSV/PDF exports",
      es: "Exportar CSV/PDF",
    },
    description: {
      en: "Download shift reports for records, taxes, and planning.",
      es: "Descarga reportes para registros, impuestos y planeación.",
    },
  },
  advanced_insights: {
    includedOnFree: false,
    label: {
      en: "Advanced insights",
      es: "Análisis avanzado",
    },
    description: {
      en: "Spot trends by app, month, day, and real hourly performance.",
      es: "Detecta tendencias por app, mes, día y pago real por hora.",
    },
  },
  goal_forecasting: {
    includedOnFree: false,
    label: {
      en: "Goal forecasting",
      es: "Pronóstico de metas",
    },
    description: {
      en: "Estimate how many shifts you need to hit weekly goals.",
      es: "Estima cuántos turnos necesitas para llegar a tus metas.",
    },
  },
  custom_cost_profiles: {
    includedOnFree: false,
    label: {
      en: "Custom cost profiles",
      es: "Perfiles de costos",
    },
    description: {
      en: "Save presets for different cars, gas prices, and tax assumptions.",
      es: "Guarda ajustes para autos, gasolina e impuestos distintos.",
    },
  },
};

export function resolvePlanKey(profile?: PlanProfileFields | null): PlanKey {
  if (!profile) {
    return defaultPlan;
  }

  if (profile.is_pro === true) {
    return "pro";
  }

  const rawPlan = profile.plan || profile.subscription_plan;

  return typeof rawPlan === "string" && rawPlan.toLowerCase() === "pro"
    ? "pro"
    : defaultPlan;
}

export function canUseFeature(plan: PlanKey, feature: PlanFeatureKey) {
  return plan === "pro" || planFeatures[feature].includedOnFree;
}

export function getPlanName(plan: PlanKey) {
  return plan === "pro" ? "WIWI Pro" : "WIWI Free";
}

export function getPlanSummary(plan: PlanKey, language: Language) {
  if (plan === "pro") {
    return language === "es"
      ? "Funciones premium activas para sacar mas valor de cada turno."
      : "Premium features are active for getting more value from every shift.";
  }

  return language === "es"
    ? "Todo lo esencial para registrar turnos y ver tu pago real."
    : "Everything essential for logging shifts and seeing your real pay.";
}

export function getProPreviewFeatures(language: Language) {
  return [
    planFeatures.export_reports,
    planFeatures.advanced_insights,
    planFeatures.goal_forecasting,
    planFeatures.custom_cost_profiles,
  ].map((feature) => ({
    label: feature.label[language],
    description: feature.description[language],
  }));
}
