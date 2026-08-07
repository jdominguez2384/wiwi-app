import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "../components/LanguageProvider";
import { PlanProvider } from "../components/PlanProvider";
import { ShiftProvider } from "../components/ShiftProvider";
import { SettingsProvider } from "../components/SettingsProvider";
import { AuthProvider } from "../components/AuthProvider";
import { AppDataNotice } from "../components/AppDataNotice";
import { TutorialProvider } from "../components/TutorialProvider";

const appName = "WIWI";
const appDescription =
  "Track gig work shifts and see your real hourly pay after miles, fuel, and taxes.";

export const metadata: Metadata = {
  metadataBase: new URL("https://getwiwi.com"),
  applicationName: appName,
  title: {
    default: "WIWI | Was It Worth It?",
    template: "%s | WIWI",
  },
  description: appDescription,
  manifest: "/manifest.webmanifest",
  keywords: [
    "WIWI",
    "Was It Worth It",
    "gig worker income",
    "DoorDash income",
    "Uber driver pay",
    "real hourly pay",
    "mileage and fuel tracking",
  ],
  openGraph: {
    type: "website",
    url: "https://getwiwi.com",
    siteName: appName,
    title: "WIWI | Was It Worth It?",
    description: appDescription,
  },
  twitter: {
    card: "summary",
    title: "WIWI | Was It Worth It?",
    description: appDescription,
  },
  icons: {
    icon: [
      { url: "/wiwi-icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/wiwi-icon-192.png", type: "image/png", sizes: "192x192" }],
  },
  appleWebApp: {
    capable: true,
    title: appName,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#020617",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LanguageProvider>
            <TutorialProvider>
              <PlanProvider>
                <SettingsProvider>
                  <ShiftProvider>
                    <AppDataNotice />
                    {children}
                  </ShiftProvider>
                </SettingsProvider>
              </PlanProvider>
            </TutorialProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
