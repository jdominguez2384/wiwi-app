"use client";

import type { ReactNode } from "react";
import { cx } from "../lib/ui";

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cx(
        "rounded-[28px] border border-slate-800/80 bg-slate-950/70 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-sm",
        className
      )}
    >
      {children}
    </section>
  );
}

export function InputLabel({
  children,
  icon,
}: {
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
      {icon}
      <span>{children}</span>
    </label>
  );
}

export function MessageBanner({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-sky-500/20 bg-sky-500/10 px-5 py-4 text-sm text-sky-100",
        className
      )}
    >
      {children}
    </div>
  );
}

export function PageHero({
  eyebrowContent,
  title,
  description,
  actions,
  children,
  className,
  decoration,
}: {
  eyebrowContent?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  decoration?: ReactNode;
}) {
  return (
    <Panel className={cx("relative overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_45%)]" />
      {decoration}

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {eyebrowContent ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2">
              {eyebrowContent}
            </div>
          ) : null}

          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
            {title}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            {description}
          </p>
        </div>

        {actions ? (
          <div className="flex flex-col gap-3 sm:flex-row">{actions}</div>
        ) : null}
      </div>

      {children ? <div className="relative mt-8">{children}</div> : null}
    </Panel>
  );
}
