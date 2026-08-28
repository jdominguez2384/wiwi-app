import type { Language } from "./translations";
import type { ComputedShift } from "./shiftMetrics";
import { buildReportData } from "./proReports";

async function buildShiftPdf(
  shifts: ComputedShift[],
  language: Language
) {
  const { jsPDF } = await import("jspdf");
  const report = buildReportData(shifts, language);
  const document = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = document.internal.pageSize.getWidth();
  const pageHeight = document.internal.pageSize.getHeight();
  const margin = 44;
  const contentWidth = pageWidth - margin * 2;
  const isSpanish = language === "es";

  function drawHeader() {
    document.setFillColor(2, 6, 23);
    document.rect(0, 0, pageWidth, 116, "F");
    document.setFillColor(14, 165, 233);
    document.roundedRect(margin, 30, 42, 42, 12, 12, "F");
    document.setTextColor(255, 255, 255);
    document.setFont("helvetica", "bold");
    document.setFontSize(10);
    document.text("WI", margin + 21, 47, { align: "center" });
    document.text("WI", margin + 21, 60, { align: "center" });
    document.setFontSize(20);
    document.text("WIWI", margin + 56, 48);
    document.setFont("helvetica", "normal");
    document.setTextColor(148, 163, 184);
    document.setFontSize(9);
    document.text("WAS IT WORTH IT?", margin + 56, 64);
    document.setTextColor(226, 232, 240);
    document.setFontSize(10);
    document.text(report.generatedLabel, pageWidth - margin, 48, {
      align: "right",
    });
  }

  function drawFooter(pageNumber: number) {
    document.setDrawColor(226, 232, 240);
    document.line(margin, pageHeight - 42, pageWidth - margin, pageHeight - 42);
    document.setFont("helvetica", "normal");
    document.setFontSize(8);
    document.setTextColor(100, 116, 139);
    document.text(
      isSpanish
        ? "Estimacion para planeacion. WIWI no ofrece asesoria fiscal, legal ni financiera."
        : "Planning estimate only. WIWI does not provide tax, legal, or financial advice.",
      margin,
      pageHeight - 26
    );
    document.text(String(pageNumber), pageWidth - margin, pageHeight - 26, {
      align: "right",
    });
  }

  drawHeader();
  document.setTextColor(15, 23, 42);
  document.setFont("helvetica", "bold");
  document.setFontSize(22);
  document.text(report.title, margin, 150);

  const cardGap = 8;
  const cardWidth = (contentWidth - cardGap * 2) / 3;
  report.summary.slice(0, 3).forEach((item, index) => {
    const x = margin + index * (cardWidth + cardGap);
    document.setFillColor(241, 245, 249);
    document.roundedRect(x, 170, cardWidth, 58, 8, 8, "F");
    document.setFont("helvetica", "normal");
    document.setFontSize(8);
    document.setTextColor(100, 116, 139);
    document.text(item.label.toUpperCase(), x + 12, 190);
    document.setFont("helvetica", "bold");
    document.setFontSize(13);
    document.setTextColor(15, 23, 42);
    document.text(item.value, x + 12, 213);
  });

  let y = 264;
  let pageNumber = 1;
  const tableHeaders = [
    report.headers[0],
    report.headers[1],
    report.headers[2],
    report.headers[8],
    report.headers[9],
  ];
  const columnWidths = [70, 156, 82, 82, 92];

  function drawTableHeader() {
    document.setFillColor(15, 23, 42);
    document.rect(margin, y, contentWidth, 26, "F");
    document.setFont("helvetica", "bold");
    document.setFontSize(8);
    document.setTextColor(255, 255, 255);
    let x = margin + 8;
    tableHeaders.forEach((header, index) => {
      document.text(header, x, y + 17);
      x += columnWidths[index];
    });
    y += 26;
  }

  drawTableHeader();

  report.rows.forEach((row, rowIndex) => {
    if (y > pageHeight - 76) {
      drawFooter(pageNumber);
      document.addPage();
      pageNumber += 1;
      drawHeader();
      y = 136;
      drawTableHeader();
    }

    if (rowIndex % 2 === 0) {
      document.setFillColor(248, 250, 252);
      document.rect(margin, y, contentWidth, 24, "F");
    }

    const cells = [row[0], row[1], `$${row[2]}`, `$${row[8]}`, `$${row[9]}`];
    document.setFont("helvetica", "normal");
    document.setFontSize(8.5);
    document.setTextColor(51, 65, 85);
    let x = margin + 8;
    cells.forEach((cell, index) => {
      const maxWidth = columnWidths[index] - 12;
      const text = document.splitTextToSize(cell, maxWidth)[0] ?? "";
      document.text(text, x, y + 16);
      x += columnWidths[index];
    });
    y += 24;
  });

  if (report.rows.length === 0) {
    document.setFont("helvetica", "normal");
    document.setTextColor(100, 116, 139);
    document.text(
      isSpanish ? "No hay turnos en este periodo." : "No shifts in this period.",
      margin + 8,
      y + 24
    );
  }

  drawFooter(pageNumber);
  return document;
}

export async function createShiftPdfBase64(
  shifts: ComputedShift[],
  language: Language
) {
  const document = await buildShiftPdf(shifts, language);
  const dataUri = document.output("datauristring");
  const base64 = dataUri.split(",", 2)[1];
  if (!base64) throw new Error("The PDF could not be encoded.");
  return base64;
}

export async function downloadShiftPdf(
  shifts: ComputedShift[],
  language: Language,
  filename: string
) {
  const document = await buildShiftPdf(shifts, language);
  document.save(filename);
}
