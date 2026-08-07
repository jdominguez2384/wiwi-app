import type { Language } from "./translations.ts";
import type { ComputedShift } from "./shiftMetrics.ts";
import { getShiftTotals } from "./shiftMetrics.ts";

export type ReportData = {
  title: string;
  generatedLabel: string;
  headers: string[];
  rows: string[][];
  summary: Array<{ label: string; value: string }>;
};

function formatNumber(value: number, digits = 2) {
  return value.toFixed(digits);
}

function sanitizeCsvCell(value: string) {
  const protectedValue = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${protectedValue.replaceAll('"', '""')}"`;
}

export function buildReportData(
  shifts: ComputedShift[],
  language: Language,
  generatedAt = new Date()
): ReportData {
  const isSpanish = language === "es";
  const locale = isSpanish ? "es-US" : "en-US";
  const currency = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
  });
  const totals = getShiftTotals(shifts);
  const sortedShifts = [...shifts].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return {
    title: isSpanish
      ? "Reporte de ganancias y gastos de WIWI"
      : "WIWI earnings and expense report",
    generatedLabel: isSpanish
      ? `Generado ${generatedAt.toLocaleDateString(locale)}`
      : `Generated ${generatedAt.toLocaleDateString(locale)}`,
    headers: isSpanish
      ? [
          "Fecha",
          "App",
          "Bruto",
          "Horas",
          "Millas",
          "Gasolina",
          "Reserva de impuestos",
          "Otros gastos",
          "Neto",
          "Neto por hora",
        ]
      : [
          "Date",
          "App",
          "Gross",
          "Hours",
          "Miles",
          "Fuel",
          "Tax reserve",
          "Other expenses",
          "Net",
          "Net per hour",
        ],
    rows: sortedShifts.map((shift) => [
      shift.date,
      shift.appName,
      formatNumber(shift.grossEarnings),
      formatNumber(shift.hoursWorked),
      formatNumber(shift.milesDriven),
      formatNumber(shift.fuelCost),
      formatNumber(shift.taxAmount),
      formatNumber(shift.otherExpenses),
      formatNumber(shift.net),
      formatNumber(shift.hourly),
    ]),
    summary: [
      {
        label: isSpanish ? "Turnos" : "Shifts",
        value: String(shifts.length),
      },
      {
        label: isSpanish ? "Ganancias brutas" : "Gross earnings",
        value: currency.format(totals.gross),
      },
      {
        label: isSpanish ? "Ganancia neta estimada" : "Estimated net earnings",
        value: currency.format(totals.net),
      },
      {
        label: isSpanish ? "Pago real por hora" : "Real hourly pay",
        value: currency.format(totals.hourly),
      },
      {
        label: isSpanish ? "Millas" : "Miles",
        value: formatNumber(totals.totalMiles, 1),
      },
    ],
  };
}

export function buildShiftCsv(
  shifts: ComputedShift[],
  language: Language,
  generatedAt = new Date()
) {
  const report = buildReportData(shifts, language, generatedAt);
  const lines = [
    report.headers.map(sanitizeCsvCell).join(","),
    ...report.rows.map((row) => row.map(sanitizeCsvCell).join(",")),
  ];

  return `\uFEFF${lines.join("\r\n")}`;
}
