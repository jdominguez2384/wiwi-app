import { access, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const root = process.cwd();
const baseUrl = process.env.WIWI_SCREENSHOT_BASE_URL ?? "https://getwiwi.com";
const credentialsPath = path.join(
  root,
  "store",
  "review-credentials.local.json"
);
const credentials = JSON.parse(
  (await readFile(credentialsPath, "utf8")).replace(/^\uFEFF/, "")
);

const browserCandidates = process.platform === "win32"
  ? [
      process.env.CHROME_PATH,
      "C:/Program Files/Google/Chrome/Application/chrome.exe",
      `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
    ]
  : process.platform === "darwin"
    ? [
        process.env.CHROME_PATH,
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      ]
    : [process.env.CHROME_PATH, "/usr/bin/google-chrome", "/usr/bin/chromium"];

let executablePath;
for (const candidate of browserCandidates.filter(Boolean)) {
  try {
    await access(candidate);
    executablePath = candidate;
    break;
  } catch {
    // Keep looking for an installed browser.
  }
}

if (!executablePath) {
  throw new Error("Google Chrome was not found. Set CHROME_PATH and try again.");
}

const capturePages = [
  { id: "01-dashboard", route: "/dashboard" },
  { id: "02-history", route: "/history" },
  { id: "03-insights", route: "/insights" },
  { id: "04-add-shift", route: "/add-shift" },
  { id: "05-settings", route: "/settings" },
];

const targets = [
  {
    directory: "apple-iphone-6.9",
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 3,
  },
  {
    directory: "google-play-phone",
    viewport: { width: 360, height: 640 },
    deviceScaleFactor: 3,
  },
];

const browser = await chromium.launch({
  executablePath,
  headless: true,
});

async function signIn(page) {
  await page.goto(`${baseUrl}/login`, { waitUntil: "domcontentloaded" });
  await page.getByRole("textbox", { name: "Email" }).fill(credentials.email);
  await page.getByRole("textbox", { name: "Password" }).fill(credentials.password);
  await Promise.all([
    page.waitForURL("**/dashboard", { timeout: 15000 }),
    page.getByRole("button", { name: "Sign in" }).click(),
  ]);
}

async function setLanguage(page, language) {
  await page.goto(`${baseUrl}/settings`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", {
    name: language === "es-US" ? "Espanol" : "English",
    exact: true,
  }).click();
  await page.waitForTimeout(500);
}

async function waitForApp(page) {
  await page.locator("main").waitFor({ state: "visible", timeout: 15000 });
  await page.waitForFunction(
    () => !document.body.innerText.includes("Loading your WIWI data"),
    undefined,
    { timeout: 15000 }
  );
  await page.waitForTimeout(500);
}

try {
  for (const target of targets) {
    const context = await browser.newContext({
      viewport: target.viewport,
      deviceScaleFactor: target.deviceScaleFactor,
      hasTouch: true,
      isMobile: true,
      locale: "en-US",
    });
    const page = await context.newPage();
    await signIn(page);

    for (const locale of ["en-US", "es-US"]) {
      await setLanguage(page, locale);
      const outputDirectory = path.join(
        root,
        "store",
        "assets",
        "screenshots",
        target.directory,
        locale
      );
      await mkdir(outputDirectory, { recursive: true });

      for (const capture of capturePages) {
        await page.goto(`${baseUrl}${capture.route}`, {
          waitUntil: "domcontentloaded",
        });
        await waitForApp(page);
        await page.screenshot({
          path: path.join(outputDirectory, `${capture.id}.png`),
        });
      }
    }

    await setLanguage(page, "en-US");
    await context.close();
  }
} finally {
  await browser.close();
}

console.log("Captured localized WIWI screenshots for Apple and Google Play.");
