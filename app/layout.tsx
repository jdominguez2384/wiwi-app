import "./globals.css";
import { LanguageProvider } from "../components/LanguageProvider";
import { ShiftProvider } from "../components/ShiftProvider";
import { SettingsProvider } from "../components/SettingsProvider";

export const metadata = {
  title: "RealRate",
  description: "See your real pay after miles, fuel, and taxes.",
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