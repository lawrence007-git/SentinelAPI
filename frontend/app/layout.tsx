import type { Metadata } from "next";
import { IBM_Plex_Sans, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import ThemeProvider from "@/components/custom/ThemeProvider";
import ThemeToggle from "@/components/custom/ThemeToggle";

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
});
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Sentinel",
  description: "Know when your APIs break before your users do.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plex.variable} ${grotesk.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider>
          <header className="border-b border-border bg-card">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-8 py-4">
              <Link href="/" className="font-display text-lg font-semibold tracking-tight">
                Sentinel
              </Link>
              <nav className="flex items-center gap-6">
                <Link href="/monitors" className="text-sm text-muted-foreground hover:text-foreground">
                  Monitors
                </Link>
                <ThemeToggle />
              </nav>
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}