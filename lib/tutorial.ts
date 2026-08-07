import type { Language } from "./translations";

export const TUTORIAL_VERSION = 1;

export type TutorialStepId =
  | "welcome"
  | "home"
  | "add"
  | "history"
  | "insights"
  | "settings"
  | "ready";

export type TutorialStep = {
  id: TutorialStepId;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
};

export type TutorialFaq = {
  question: string;
  answer: string;
};

type TutorialCopy = {
  close: string;
  skip: string;
  back: string;
  next: string;
  finish: string;
  stepLabel: (current: number, total: number) => string;
  steps: TutorialStep[];
};

const tutorialCopy: Record<Language, TutorialCopy> = {
  en: {
    close: "Close tutorial",
    skip: "Skip tutorial",
    back: "Back",
    next: "Next",
    finish: "Start using WIWI",
    stepLabel: (current, total) => `Step ${current} of ${total}`,
    steps: [
      {
        id: "welcome",
        eyebrow: "Welcome to WIWI",
        title: "Know what your shift was really worth.",
        description:
          "WIWI stands for Was It Worth It. It turns your gross pay, time, miles, fuel, taxes, and extra expenses into one honest view of your earnings.",
        bullets: [
          "Track shifts from DoorDash, Uber, Lyft, Instacart, and more.",
          "See estimated net income and real hourly pay.",
          "Keep every shift private inside your account.",
        ],
      },
      {
        id: "home",
        eyebrow: "Home",
        title: "Get the quick answer first.",
        description:
          "Home keeps the most important numbers together so you can understand your week at a glance.",
        bullets: [
          "Weekly net shows what remains after estimated costs.",
          "Real hourly pay shows what your time actually earned.",
          "Your WIWI verdict and goal progress help you decide what to do next.",
        ],
      },
      {
        id: "add",
        eyebrow: "Add a shift",
        title: "Log the shift you just finished.",
        description:
          "Choose the date and app, then enter gross earnings, hours, miles, and any tolls, parking, or other expenses.",
        bullets: [
          "Minutes can be entered as decimals: 0.5 is 30 minutes and 0.25 is 15 minutes.",
          "WIWI previews fuel, tax set-aside, net earnings, and real hourly pay before you save.",
          "Values cannot be negative, and hours must be greater than zero.",
        ],
      },
      {
        id: "history",
        eyebrow: "History and editing",
        title: "Find, fix, or remove any shift.",
        description:
          "History holds your complete shift list without cluttering Home. Filter it by month or gig app whenever the list grows.",
        bullets: [
          "Tap Edit beside a shift, change the details, and choose Save changes.",
          "A shift keeps the gas, MPG, and tax assumptions used when it was saved.",
          "Delete is available when a shift was added by mistake.",
        ],
      },
      {
        id: "insights",
        eyebrow: "Insights",
        title: "Spot the work that pays you best.",
        description:
          "Insights turns all your saved shifts into lifetime totals, cost breakdowns, best-shift results, and app comparisons.",
        bullets: [
          "Compare gross earnings with estimated net income.",
          "Review miles, fuel, expenses, hours, and tax set-asides.",
          "Use app performance to learn which work is most worthwhile.",
        ],
      },
      {
        id: "settings",
        eyebrow: "Settings",
        title: "Make every estimate match your reality.",
        description:
          "Set your tax reserve, vehicle MPG, local gas price, and weekly earnings goal before you rely on WIWI's estimates.",
        bullets: [
          "Update gas price whenever prices in your area change.",
          "Switch between English and Spanish at any time.",
          "Replay this tutorial and find quick answers here whenever you need help.",
        ],
      },
      {
        id: "ready",
        eyebrow: "You are ready",
        title: "Log one shift and let WIWI answer the question.",
        description:
          "Start with your real tax, MPG, gas price, and goal settings. Then add your next completed shift and check the verdict on Home.",
        bullets: [
          "Settings first if you want the most accurate estimate.",
          "Add after every shift while the numbers are fresh.",
          "Use History and Insights when you are ready to compare patterns.",
        ],
      },
    ],
  },
  es: {
    close: "Cerrar tutorial",
    skip: "Omitir tutorial",
    back: "Atrás",
    next: "Siguiente",
    finish: "Empezar a usar WIWI",
    stepLabel: (current, total) => `Paso ${current} de ${total}`,
    steps: [
      {
        id: "welcome",
        eyebrow: "Te damos la bienvenida a WIWI",
        title: "Descubre cuánto valió realmente tu turno.",
        description:
          "WIWI significa Was It Worth It, o ¿Valió la pena? Convierte tu pago bruto, tiempo, millas, gasolina, impuestos y gastos en una vista honesta de tus ganancias.",
        bullets: [
          "Registra turnos de DoorDash, Uber, Lyft, Instacart y más.",
          "Ve tu ingreso neto estimado y tu pago real por hora.",
          "Mantén cada turno privado dentro de tu cuenta.",
        ],
      },
      {
        id: "home",
        eyebrow: "Inicio",
        title: "Obtén primero la respuesta rápida.",
        description:
          "Inicio mantiene juntos los números más importantes para que entiendas tu semana de un vistazo.",
        bullets: [
          "El neto semanal muestra lo que queda después de los costos estimados.",
          "El pago real por hora muestra lo que realmente produjo tu tiempo.",
          "El veredicto WIWI y el progreso de tu meta te ayudan a decidir qué hacer después.",
        ],
      },
      {
        id: "add",
        eyebrow: "Agregar un turno",
        title: "Registra el turno que acabas de terminar.",
        description:
          "Elige la fecha y la app; luego ingresa ganancias brutas, horas, millas y cualquier peaje, estacionamiento u otro gasto.",
        bullets: [
          "Puedes ingresar minutos con decimales: 0.5 son 30 minutos y 0.25 son 15 minutos.",
          "WIWI muestra gasolina, impuestos, ganancia neta y pago real por hora antes de guardar.",
          "Los valores no pueden ser negativos y las horas deben ser mayores que cero.",
        ],
      },
      {
        id: "history",
        eyebrow: "Historial y edición",
        title: "Encuentra, corrige o elimina cualquier turno.",
        description:
          "Historial guarda tu lista completa sin llenar la pantalla de Inicio. Filtra por mes o app cuando la lista crezca.",
        bullets: [
          "Toca Editar junto a un turno, cambia los datos y elige Guardar cambios.",
          "Cada turno conserva la gasolina, MPG e impuestos usados cuando se guardó.",
          "Puedes eliminar un turno si lo agregaste por error.",
        ],
      },
      {
        id: "insights",
        eyebrow: "Análisis",
        title: "Descubre qué trabajo te paga mejor.",
        description:
          "Análisis convierte tus turnos guardados en totales, costos, mejores turnos y comparaciones entre apps.",
        bullets: [
          "Compara ganancias brutas con ingreso neto estimado.",
          "Revisa millas, gasolina, gastos, horas e impuestos apartados.",
          "Usa el rendimiento por app para saber qué trabajo más te conviene.",
        ],
      },
      {
        id: "settings",
        eyebrow: "Ajustes",
        title: "Haz que cada estimación refleje tu realidad.",
        description:
          "Configura impuestos, MPG de tu vehículo, precio local de gasolina y meta semanal antes de depender de las estimaciones de WIWI.",
        bullets: [
          "Actualiza la gasolina cuando cambien los precios de tu zona.",
          "Cambia entre inglés y español en cualquier momento.",
          "Repite este tutorial y consulta respuestas rápidas aquí cuando necesites ayuda.",
        ],
      },
      {
        id: "ready",
        eyebrow: "Todo listo",
        title: "Registra un turno y deja que WIWI responda.",
        description:
          "Empieza con tus impuestos, MPG, gasolina y meta reales. Luego agrega tu próximo turno terminado y revisa el veredicto en Inicio.",
        bullets: [
          "Configura Ajustes primero para obtener una estimación más precisa.",
          "Agrega cada turno mientras todavía recuerdas los números.",
          "Usa Historial y Análisis cuando quieras comparar patrones.",
        ],
      },
    ],
  },
};

export const tutorialFaqs: Record<Language, TutorialFaq[]> = {
  en: [
    {
      question: "Why is estimated net lower than gross earnings?",
      answer:
        "WIWI subtracts estimated fuel, your tax set-aside, and any other expenses you entered. These are estimates for planning, not tax advice.",
    },
    {
      question: "How do I enter a shift shorter than one hour?",
      answer:
        "Use decimal hours. Enter 0.5 for 30 minutes, 0.25 for 15 minutes, or 0.75 for 45 minutes.",
    },
    {
      question: "How do I edit or delete a shift?",
      answer:
        "Open History, find the shift, and choose Edit or Delete. Editing recalculates the shift with the assumptions originally saved with it.",
    },
    {
      question: "Why did an older shift stay the same after I changed Settings?",
      answer:
        "WIWI preserves the tax rate, MPG, and gas price used when each shift was saved so your historical results remain consistent.",
    },
    {
      question: "Where can I change WIWI's language?",
      answer:
        "Open Settings and choose English or Español. The tutorial and the rest of WIWI will follow your selection.",
    },
  ],
  es: [
    {
      question: "¿Por qué el neto estimado es menor que las ganancias brutas?",
      answer:
        "WIWI resta la gasolina estimada, los impuestos que quieres apartar y otros gastos. Son estimaciones para planificar, no asesoría fiscal.",
    },
    {
      question: "¿Cómo ingreso un turno de menos de una hora?",
      answer:
        "Usa horas decimales. Ingresa 0.5 para 30 minutos, 0.25 para 15 minutos o 0.75 para 45 minutos.",
    },
    {
      question: "¿Cómo edito o elimino un turno?",
      answer:
        "Abre Historial, encuentra el turno y elige Editar o Eliminar. Al editar, WIWI usa los ajustes guardados originalmente con ese turno.",
    },
    {
      question: "¿Por qué un turno anterior no cambió después de modificar Ajustes?",
      answer:
        "WIWI conserva impuestos, MPG y gasolina usados al guardar cada turno para mantener consistentes tus resultados anteriores.",
    },
    {
      question: "¿Dónde cambio el idioma de WIWI?",
      answer:
        "Abre Ajustes y elige English o Español. El tutorial y el resto de WIWI seguirán tu selección.",
    },
  ],
};

export function getTutorialCopy(language: Language) {
  return tutorialCopy[language];
}

export function getTutorialCompletionVersion(value: unknown) {
  const version = typeof value === "number" ? value : Number(value);
  return Number.isFinite(version) && version >= 0 ? version : 0;
}

export function getTutorialStorageKey(userId: string) {
  return `wiwi:tutorial:${userId}`;
}
