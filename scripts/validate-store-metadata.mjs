import { readFile } from "node:fs/promises";
import path from "node:path";

const metadataPath = path.join(process.cwd(), "store", "metadata.json");
const metadata = JSON.parse(await readFile(metadataPath, "utf8"));
const errors = [];

const limits = {
  name: 30,
  subtitle: 30,
  promotionalText: 170,
  shortDescription: 80,
  description: 4000,
  keywords: 100,
};

function characterCount(value) {
  return [...value].length;
}

function requireText(locale, key, value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`${locale}.${key} is required.`);
    return;
  }

  const limit = limits[key];
  if (limit && characterCount(value) > limit) {
    errors.push(
      `${locale}.${key} is ${characterCount(value)} characters; maximum is ${limit}.`
    );
  }
}

for (const [locale, listing] of Object.entries(metadata.locales ?? {})) {
  for (const key of Object.keys(limits)) {
    requireText(locale, key, listing[key]);
  }
}

for (const [key, value] of Object.entries(metadata.urls ?? {})) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") {
      errors.push(`urls.${key} must use HTTPS.`);
    }
  } catch {
    errors.push(`urls.${key} must be a valid URL.`);
  }
}

if (metadata.defaultLocale !== "en-US") {
  errors.push("defaultLocale must remain en-US for the first release.");
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  `Validated ${Object.keys(metadata.locales).length} WIWI store locales for version ${metadata.version}.`
);
