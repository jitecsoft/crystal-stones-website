import type { Metadata } from "next";
import { LegacyLanding } from "@/components/LegacyLanding";

export const metadata: Metadata = { title: "Ceramic surfaces", description: "Explore ceramic surface options and share your project application, dimensions and finish requirements for a more relevant recommendation.", alternates: { canonical: "/all-materials/ceramic/" } };
const config = { title: "Ceramic surfaces", description: "Explore ceramic surface options and share your project application, dimensions and finish requirements for a more relevant recommendation.", eyebrow: "Architectural surfaces \u00b7 Material family", bullets: ["Wall, floor or other application", "Format and thickness", "Finish and project location"] };
export default function Page() { return <LegacyLanding config={config} />; }
