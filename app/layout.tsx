import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Archivo, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

const display = Archivo({ variable: "--font-display", subsets: ["latin"], weight: ["800", "900"] });
const sans = Manrope({ variable: "--font-sans", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

const description =
  "Portfolio of Soham Banerjee, MS Computer Science at USC and Data Science Intern at H2O.ai. Ask the built-in assistant about Soham's experience.";

export const metadata: Metadata = {
  metadataBase: new URL("https://soham286.github.io"),
  title: "Soham Banerjee",
  description,
  openGraph: { title: "Soham Banerjee", description, type: "website", url: "/" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
