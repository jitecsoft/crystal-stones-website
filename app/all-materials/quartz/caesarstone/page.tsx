import type { Metadata } from "next";
import { LegacyLanding } from "@/components/LegacyLanding";

export const metadata: Metadata = { title: "Caesarstone", description: "Explore Caesarstone surface options and submit your application, preferred design and quantity for confirmation. Product range, availability and current specifications must be verified before purchase.", alternates: { canonical: "/all-materials/quartz/caesarstone/" } };
const config = { title: "Caesarstone", description: "Explore Caesarstone surface options and submit your application, preferred design and quantity for confirmation. Product range, availability and current specifications must be verified before purchase.", eyebrow: "Brand reference \u00b7 Verify current range", bullets: ["Preferred design or colour", "Application and dimensions", "Quantity and delivery destination"], image: "/images/catalogue/materials/pexels-porcelain-application.webp", imageAlt: "Illustrative engineered quartz surface", imageCaption: "Illustrative surface direction · Not a current Caesarstone range image" };
export default function Page() { return <LegacyLanding config={config} />; }
