import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteUrl } from "@/lib/site";

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#page-content">Skip to content</a><Header /><div id="page-content" tabIndex={-1}>{children}</div><Footer /></body></html>;
}
