import "./globals.css";
import { LanguageProvider } from "../components/LanguageProvider";
import { ShiftProvider } from "../components/ShiftProvider";
import { SettingsProvider } from "../components/SettingsProvider";

export const metadata = {
  title: "WIWI | Was It Worth It?",
  description: "Track your real hourly pay after miles, fuel, and taxes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <SettingsProvider>
            <ShiftProvider>{children}</ShiftProvider>
          </SettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}