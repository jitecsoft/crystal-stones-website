import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import "./redesign.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteUrl } from "@/lib/site";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Crystal Stones | Natural Stone & Architectural Surfaces", template: "%s | Crystal Stones" },
  description: "Explore natural stone and architectural surfaces for residential, commercial and trade projects. Build a material requirement for a tailored quotation.",
  openGraph: {
    type: "website",
    siteName: "Crystal Stones",
    title: "Crystal Stones | Natural Stone & Architectural Surfaces",
    description: "Discover stone materials and build a requirement for your next project."
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: "#243129",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a className="skip-link" href="#page-content">Skip to content</a>
        <Header />
        <div id="page-content" tabIndex={-1}>{children}</div>
        <Footer />
      </body>
    </html>
  );
}
