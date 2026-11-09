import type { Metadata } from "next";
import { LegacyLanding } from "@/components/LegacyLanding";

export const metadata: Metadata = { title: "Resources", description: "Practical material-selection guidance for architects, designers, fabricators, trade buyers and homeowners. Content should be specific, accurate and tied to real material decisions.", alternates: { canonical: "/blog/" } };
const config = { title: "Resources", description: "Practical material-selection guidance for architects, designers, fabricators, trade buyers and homeowners. Content should be specific, accurate and tied to real material decisions.", eyebrow: "Material knowledge", bullets: ["Natural stone vs engineered surfaces", "Finishes, thickness and slab formats", "Area measurement, wastage and maintenance"], image: "/images/catalogue/imported-marble/marble-family-collection.webp", imageAlt: "Illustrative arrangement of marble samples", imageCaption: "Illustrative material library · Guidance is general until confirmed for a project" };
export default function Page() { return <LegacyLanding config={config} />; }
