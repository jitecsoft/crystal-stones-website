import type { Metadata } from "next";
import { LegacyLanding } from "@/components/LegacyLanding";

export const metadata: Metadata = { title: "Quartz surfaces", description: "Explore engineered quartz surface options for selected interior applications. Confirm manufacturer, colour, slab size, thickness, finish and intended-use guidance.", alternates: { canonical: "/all-materials/quartz/" } };
const config = { title: "Quartz surfaces", description: "Explore engineered quartz surface options for selected interior applications. Confirm manufacturer, colour, slab size, thickness, finish and intended-use guidance.", eyebrow: "Engineered surfaces \u00b7 Material family", bullets: ["Preferred brand or colour", "Countertop or other application", "Slab dimensions and thickness"], image: "/images/catalogue/materials/pexels-porcelain-application.webp", imageAlt: "Illustrative large-format engineered surface in a contemporary setting", imageCaption: "Illustrative engineered surface · Verify brand, colour and slab" };
export default function Page() { return <LegacyLanding config={config} />; }
