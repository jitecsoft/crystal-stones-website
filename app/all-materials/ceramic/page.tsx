import type { Metadata } from "next";
import { LegacyLanding } from "@/components/LegacyLanding";

export const metadata: Metadata = { title: "Ceramic surfaces", description: "Explore ceramic surface options and share your project application, dimensions and finish requirements for a more relevant recommendation.", alternates: { canonical: "/all-materials/ceramic/" } };
const config = { family: "Ceramic", title: "Ceramic surfaces", description: "Explore ceramic surface options and share your project application, dimensions and finish requirements for a more relevant recommendation.", eyebrow: "Architectural surfaces \u00b7 Material family", bullets: ["Wall, floor or other application", "Format and thickness", "Finish and project location"], image: "/images/catalogue/materials/pexels-porcelain-application.webp", imageAlt: "Illustrative ceramic surface in a contemporary interior", imageCaption: "Illustrative ceramic direction · Confirm product, format and finish" };
export default function Page() { return <LegacyLanding config={config} />; }
