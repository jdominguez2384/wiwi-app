import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outputRoot = path.join(root, "store", "assets");
const iconSource = await readFile(path.join(root, "public", "wiwi-icon.svg"));

const listings = {
  "en-US": {
    eyebrow: "WIWI / WAS IT WORTH IT?",
    eyebrowWidth: 276,
    title: ["KNOW WHAT", "THE SHIFT PAID."],
    body: ["Real earnings after mileage, fuel, expenses, and taxes."],
    verdict: "WORTH IT",
    hourly: "$26.40 / HR",
    hourlyLabel: "REAL HOURLY",
    breakdownLabel: "SHIFT BREAKDOWN",
    grossLabel: "Gross pay",
    costsLabel: "Costs + reserve",
    netLabel: "NET $118.80",
  },
  "es-US": {
    eyebrow: "WIWI / ¿VALIÓ LA PENA?",
    eyebrowWidth: 304,
    title: ["DESCUBRE CUÁNTO", "PAGÓ EL TURNO."],
    body: [
      "Ganancias reales después de millas,",
      "combustible, gastos e impuestos.",
    ],
    verdict: "VALIÓ LA PENA",
    hourly: "$26.40 / HORA",
    hourlyLabel: "GANANCIA POR HORA",
    breakdownLabel: "RESUMEN DEL TURNO",
    grossLabel: "Pago bruto",
    costsLabel: "Gastos + reserva",
    netLabel: "NETO $118.80",
  },
};

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function featureGraphic(copy) {
  const bodyLines = copy.body
    .map(
      (line, index) =>
        `<text x="65" y="${292 + index * 25}" fill="#b9c7dd" font-size="18" font-weight="400">${escapeXml(line)}</text>`
    )
    .join("");

  return Buffer.from(`
    <svg width="1024" height="500" viewBox="0 0 1024 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#020617"/>
          <stop offset="0.55" stop-color="#07152f"/>
          <stop offset="1" stop-color="#0b2551"/>
        </linearGradient>
        <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#79dcff"/>
          <stop offset="1" stop-color="#2563eb"/>
        </linearGradient>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000b24" flood-opacity="0.65"/>
        </filter>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#7dd3fc" stroke-opacity="0.05" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="1024" height="500" fill="url(#background)"/>
      <rect width="1024" height="500" fill="url(#grid)"/>
      <circle cx="930" cy="-30" r="250" fill="#0ea5e9" opacity="0.12"/>
      <circle cx="50" cy="520" r="260" fill="#2563eb" opacity="0.11"/>

      <g font-family="Segoe UI, Arial, sans-serif">
        <rect x="62" y="58" width="${copy.eyebrowWidth}" height="36" rx="18" fill="#0ea5e9" fill-opacity="0.12" stroke="#38bdf8" stroke-opacity="0.38"/>
        <text x="82" y="82" fill="#8bdcff" font-size="16" font-weight="700" letter-spacing="1.2">${escapeXml(copy.eyebrow)}</text>
        <text x="62" y="176" fill="#f8fafc" font-size="54" font-weight="800" letter-spacing="-1.7">${escapeXml(copy.title[0])}</text>
        <text x="62" y="235" fill="#f8fafc" font-size="54" font-weight="800" letter-spacing="-1.7">${escapeXml(copy.title[1])}</text>
        ${bodyLines}
        <rect x="62" y="348" width="190" height="64" rx="20" fill="url(#accent)"/>
        <text x="157" y="388" text-anchor="middle" fill="#ffffff" font-size="20" font-weight="800">${escapeXml(copy.verdict)}</text>
      </g>

      <g transform="translate(650 54)" filter="url(#shadow)" font-family="Segoe UI, Arial, sans-serif">
        <rect width="304" height="392" rx="42" fill="#030a1d" stroke="#2a426b" stroke-width="2"/>
        <rect x="24" y="26" width="256" height="84" rx="24" fill="#07152d" stroke="#17345d"/>
        <text x="44" y="57" fill="#7e91ae" font-size="14" font-weight="600">${escapeXml(copy.hourlyLabel)}</text>
        <text x="44" y="91" fill="#f8fafc" font-size="30" font-weight="800">${escapeXml(copy.hourly)}</text>
        <rect x="24" y="132" width="256" height="152" rx="24" fill="#07152d" stroke="#17345d"/>
        <text x="44" y="165" fill="#7e91ae" font-size="14" font-weight="600">${escapeXml(copy.breakdownLabel)}</text>
        <text x="44" y="201" fill="#cbd5e1" font-size="16">${escapeXml(copy.grossLabel)}</text>
        <text x="260" y="201" text-anchor="end" fill="#f8fafc" font-size="16" font-weight="700">$164.50</text>
        <text x="44" y="232" fill="#cbd5e1" font-size="16">${escapeXml(copy.costsLabel)}</text>
        <text x="260" y="232" text-anchor="end" fill="#f0a96b" font-size="16" font-weight="700">-$45.70</text>
        <path d="M44 249H260" stroke="#263d61"/>
        <text x="44" y="271" fill="#77e6bd" font-size="18" font-weight="800">${escapeXml(copy.netLabel)}</text>
        <rect x="24" y="306" width="256" height="62" rx="20" fill="#0e9f77" fill-opacity="0.14" stroke="#39d7aa" stroke-opacity="0.45"/>
        <circle cx="55" cy="337" r="13" fill="#39d7aa"/>
        <path d="M49 337l4 4 8-9" fill="none" stroke="#032419" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="80" y="344" fill="#7ff0c6" font-size="19" font-weight="800">${escapeXml(copy.verdict)}</text>
      </g>
    </svg>
  `);
}

await mkdir(outputRoot, { recursive: true });
await sharp(iconSource)
  .resize(512, 512)
  .flatten({ background: "#020617" })
  .png()
  .toFile(path.join(outputRoot, "google-play-icon-512.png"));

for (const [locale, copy] of Object.entries(listings)) {
  const localeDirectory = path.join(outputRoot, locale);
  await mkdir(localeDirectory, { recursive: true });
  await sharp(featureGraphic(copy))
    .flatten({ background: "#020617" })
    .png()
    .toFile(path.join(localeDirectory, "google-play-feature-1024x500.png"));
}

console.log("Generated WIWI store icons and localized feature graphics.");
