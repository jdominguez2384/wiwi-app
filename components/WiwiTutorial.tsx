"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  Clock3,
  DollarSign,
  Fuel,
  Gauge,
  History,
  House,
  Pencil,
  Plus,
  Settings2,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import {
  getTutorialCopy,
  type TutorialStepId,
} from "../lib/tutorial";
import { cx } from "../lib/ui";

function PreviewCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-slate-700/80 bg-slate-950/75 p-4",
        className
      )}
    >
      {children}
    </div>
  );
}

function StepPreview({ stepId }: { stepId: TutorialStepId }) {
  const { language } = useLanguage();
  const isSpanish = language === "es";

  if (stepId === "welcome") {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-[32px] bg-sky-400/30 blur-3xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-[30px] bg-gradient-to-br from-sky-400 to-blue-600 text-4xl font-black text-white shadow-2xl shadow-sky-950/60">
            W
          </div>
        </div>
        <p className="mt-7 text-3xl font-black tracking-tight text-white">WIWI</p>
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">
          Was It Worth It?
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {(isSpanish
            ? ["Tiempo", "Millas", "Costos", "Pago real"]
            : ["Time", "Miles", "Costs", "Real pay"]
          ).map((label) => (
            <span
              key={label}
              className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs font-semibold text-slate-300"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (stepId === "home") {
    const metrics = isSpanish
      ? [
          ["Neto semanal", "$486.20"],
          ["Pago real", "$21.14/h"],
          ["Meta", "61%"],
        ]
      : [
          ["Weekly net", "$486.20"],
          ["Real hourly", "$21.14/h"],
          ["Goal", "61%"],
        ];

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {metrics.map(([label, value]) => (
            <PreviewCard key={label} className="p-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                {label}
              </p>
              <p className="mt-2 text-base font-black text-white sm:text-lg">
                {value}
              </p>
            </PreviewCard>
          ))}
        </div>
        <PreviewCard className="relative overflow-hidden border-emerald-500/20 p-5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.18),transparent_50%)]" />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Target className="h-4 w-4 text-sky-400" />
              <span>{isSpanish ? "Veredicto WIWI" : "WIWI verdict"}</span>
            </div>
            <p className="mt-5 text-3xl font-black text-emerald-300">
              {isSpanish ? "Valió la pena" : "Worth it"}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {isSpanish
                ? "Tu pago real por hora está en buen ritmo esta semana."
                : "Your real hourly pay is on a strong pace this week."}
            </p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-[61%] rounded-full bg-gradient-to-r from-sky-400 to-blue-500" />
            </div>
          </div>
        </PreviewCard>
      </div>
    );
  }

  if (stepId === "add") {
    const fields = isSpanish
      ? [
          ["App", "DoorDash"],
          ["Ganancias", "$125.50"],
          ["Horas", "4.5"],
          ["Millas", "42"],
        ]
      : [
          ["App", "DoorDash"],
          ["Earnings", "$125.50"],
          ["Hours", "4.5"],
          ["Miles", "42"],
        ];

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-2xl border border-sky-500/20 bg-sky-500/10 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-sky-100">
            <Plus className="h-4 w-4" />
            <span>{isSpanish ? "Agregar turno" : "Add shift"}</span>
          </div>
          <span className="text-xs text-sky-300">Aug 7</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {fields.map(([label, value]) => (
            <PreviewCard key={label} className="p-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                {label}
              </p>
              <p className="mt-2 text-sm font-semibold text-white">{value}</p>
            </PreviewCard>
          ))}
        </div>
        <PreviewCard className="border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400">
                {isSpanish ? "Neto estimado" : "Estimated net"}
              </p>
              <p className="mt-1 text-2xl font-black text-emerald-300">$93.62</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">
                {isSpanish ? "Pago real" : "Real hourly"}
              </p>
              <p className="mt-1 text-lg font-bold text-sky-300">$20.80/h</p>
            </div>
          </div>
        </PreviewCard>
      </div>
    );
  }

  if (stepId === "history") {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <PreviewCard className="p-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
              {isSpanish ? "Mes" : "Month"}
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              {isSpanish ? "Agosto 2026" : "August 2026"}
            </p>
          </PreviewCard>
          <PreviewCard className="p-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
              App
            </p>
            <p className="mt-2 text-sm font-semibold text-white">DoorDash</p>
          </PreviewCard>
        </div>
        <PreviewCard className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-bold text-white">DoorDash</p>
              <p className="mt-1 text-xs text-slate-500">Aug 7, 2026</p>
            </div>
            <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-300">
              $20.80/h
            </span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-xl bg-slate-900 px-3 py-2 text-slate-400">
              {isSpanish ? "Bruto" : "Gross"} <strong className="text-white">$125.50</strong>
            </div>
            <div className="rounded-xl bg-slate-900 px-3 py-2 text-slate-400">
              {isSpanish ? "Neto" : "Net"} <strong className="text-emerald-300">$93.62</strong>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <span className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-sky-500 px-3 py-2 text-xs font-bold text-slate-950">
              <Pencil className="h-3.5 w-3.5" />
              {isSpanish ? "Editar" : "Edit"}
            </span>
            <span className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300">
              {isSpanish ? "Eliminar" : "Delete"}
            </span>
          </div>
        </PreviewCard>
      </div>
    );
  }

  if (stepId === "insights") {
    const bars = [
      ["DoorDash", "82%", "bg-sky-400"],
      ["Uber", "64%", "bg-emerald-400"],
      ["Instacart", "48%", "bg-orange-400"],
    ];

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <PreviewCard>
            <TrendingUp className="h-4 w-4 text-sky-400" />
            <p className="mt-3 text-xs text-slate-500">
              {isSpanish ? "Neto total" : "Lifetime net"}
            </p>
            <p className="mt-1 text-xl font-black text-white">$4,286</p>
          </PreviewCard>
          <PreviewCard>
            <Clock3 className="h-4 w-4 text-emerald-400" />
            <p className="mt-3 text-xs text-slate-500">
              {isSpanish ? "Promedio real" : "Real average"}
            </p>
            <p className="mt-1 text-xl font-black text-white">$19.86/h</p>
          </PreviewCard>
        </div>
        <PreviewCard>
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <BarChart3 className="h-4 w-4 text-sky-400" />
            <span>{isSpanish ? "Rendimiento por app" : "App performance"}</span>
          </div>
          <div className="mt-5 space-y-4">
            {bars.map(([app, width, color]) => (
              <div key={app}>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-slate-300">{app}</span>
                  <span className="text-slate-500">{width}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className={cx("h-full rounded-full", color)} style={{ width }} />
                </div>
              </div>
            ))}
          </div>
        </PreviewCard>
      </div>
    );
  }

  if (stepId === "settings") {
    const settings = isSpanish
      ? [
          ["Impuestos", "25%", <DollarSign key="tax" className="h-4 w-4" />],
          ["Vehículo", "30 MPG", <Gauge key="mpg" className="h-4 w-4" />],
          ["Gasolina", "$3.50", <Fuel key="gas" className="h-4 w-4" />],
          ["Meta semanal", "$800", <Target key="goal" className="h-4 w-4" />],
        ]
      : [
          ["Tax reserve", "25%", <DollarSign key="tax" className="h-4 w-4" />],
          ["Vehicle", "30 MPG", <Gauge key="mpg" className="h-4 w-4" />],
          ["Gas price", "$3.50", <Fuel key="gas" className="h-4 w-4" />],
          ["Weekly goal", "$800", <Target key="goal" className="h-4 w-4" />],
        ];

    return (
      <div className="grid grid-cols-2 gap-3">
        {settings.map(([label, value, icon]) => (
          <PreviewCard key={String(label)} className="min-h-28">
            <div className="text-sky-400">{icon}</div>
            <p className="mt-4 text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-lg font-black text-white">{value}</p>
          </PreviewCard>
        ))}
        <div className="col-span-2 rounded-2xl border border-sky-500/20 bg-sky-500/10 px-4 py-3 text-center text-sm font-semibold text-sky-100">
          {isSpanish ? "Tutorial y respuestas siempre disponibles" : "Tutorial and answers always available"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[320px] flex-col justify-center">
      <div className="grid grid-cols-5 items-center gap-2">
        {[
          [House, isSpanish ? "Inicio" : "Home"],
          [Plus, isSpanish ? "Agregar" : "Add"],
          [History, isSpanish ? "Historial" : "History"],
          [BarChart3, isSpanish ? "Análisis" : "Insights"],
          [Settings2, isSpanish ? "Ajustes" : "Settings"],
        ].map(([Icon, label]) => {
          const IconComponent = Icon as typeof House;
          return (
            <div key={String(label)} className="text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-sky-300">
                <IconComponent className="h-5 w-5" />
              </div>
              <p className="mt-2 hidden text-[10px] text-slate-500 sm:block">{String(label)}</p>
            </div>
          );
        })}
      </div>
      <div className="relative mx-auto mt-8 flex h-28 w-28 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/10">
        <div className="absolute inset-0 rounded-full bg-emerald-400/10 blur-2xl" />
        <CheckCircle2 className="relative h-14 w-14 text-emerald-300" />
      </div>
      <p className="mt-5 text-center text-xl font-black text-white">
        {isSpanish ? "Tu próxima decisión empieza con datos reales." : "Your next decision starts with real numbers."}
      </p>
    </div>
  );
}

export function WiwiTutorial({ onClose }: { onClose: () => void }) {
  const { language, setLanguage } = useLanguage();
  const copy = getTutorialCopy(language);
  const [stepIndex, setStepIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const step = copy.steps[stepIndex];
  const isLastStep = stepIndex === copy.steps.length - 1;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0 });
  }, [stepIndex]);

  function showPreviousStep() {
    setStepIndex((current) => Math.max(0, current - 1));
  }

  function showNextStep() {
    if (isLastStep) {
      onClose();
      return;
    }

    setStepIndex((current) => Math.min(copy.steps.length - 1, current + 1));
  }

  return (
    <div
      ref={scrollContainerRef}
      className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/90 p-3 backdrop-blur-xl sm:p-6"
      role="presentation"
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="wiwi-tutorial-title"
          tabIndex={-1}
          onKeyDown={(event) => {
            if (event.key === "Escape") onClose();
            if (event.key === "ArrowLeft") showPreviousStep();
            if (event.key === "ArrowRight") showNextStep();
          }}
          className="wiwi-tutorial-panel relative w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-700/80 bg-slate-900 shadow-[0_32px_120px_rgba(2,6,23,0.85)] outline-none"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.17),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.12),transparent_40%)]" />

          <div className="relative border-b border-slate-800 px-5 py-4 sm:px-7">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 font-black text-white shadow-lg shadow-sky-950/50">
                  W
                </div>
                <div>
                  <p className="font-black tracking-tight text-white">WIWI</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    Was It Worth It?
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex rounded-xl border border-slate-700 bg-slate-950/70 p-1">
                  {(["en", "es"] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLanguage(lang)}
                      className={cx(
                        "rounded-lg px-3 py-1.5 text-xs font-bold transition",
                        language === lang
                          ? "bg-sky-500 text-slate-950"
                          : "text-slate-400 hover:text-white"
                      )}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={copy.close}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-950/70 text-slate-400 transition hover:border-sky-500/40 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5" aria-hidden="true">
              {copy.steps.map((item, index) => (
                <div
                  key={item.id}
                  className={cx(
                    "h-1.5 flex-1 rounded-full transition-all duration-300",
                    index <= stepIndex ? "bg-sky-400" : "bg-slate-700"
                  )}
                />
              ))}
            </div>
          </div>

          <div className="relative grid gap-7 p-5 sm:p-7 lg:grid-cols-[minmax(0,0.88fr)_minmax(360px,1.12fr)] lg:items-center lg:gap-10 lg:p-10">
            <div key={`copy-${step.id}`} className="wiwi-tutorial-step">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{step.eyebrow}</span>
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {copy.stepLabel(stepIndex + 1, copy.steps.length)}
              </p>
              <h2
                id="wiwi-tutorial-title"
                className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl"
              >
                {step.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                {step.description}
              </p>

              <div className="mt-6 space-y-3">
                {step.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-sm leading-6 text-slate-400">{bullet}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              key={`preview-${step.id}`}
              className="wiwi-tutorial-step rounded-[28px] border border-slate-700/80 bg-slate-950/65 p-4 shadow-inner shadow-slate-950/70 sm:p-6"
            >
              <StepPreview stepId={step.id} />
            </div>
          </div>

          <div className="relative flex flex-col-reverse gap-3 border-t border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:text-white"
            >
              {copy.skip}
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={showPreviousStep}
                disabled={stepIndex === 0}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950/70 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-white disabled:pointer-events-none disabled:opacity-35 sm:flex-none"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{copy.back}</span>
              </button>
              <button
                type="button"
                onClick={showNextStep}
                className="inline-flex flex-[1.4] items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 sm:flex-none"
              >
                <span>{isLastStep ? copy.finish : copy.next}</span>
                {isLastStep ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
