import type { Metadata } from "next";
import { LegacyLanding } from "@/components/LegacyLanding";

export const metadata: Metadata = { title: "Onyx", description: "Explore onyx as a distinctive decorative stone for selected feature applications. Backlighting, translucency, slab condition and fabrication requirements must be assessed per material.", alternates: { canonical: "/onyx/" } };
const config = { title: "Onyx", description: "Explore onyx as a distinctive decorative stone for selected feature applications. Backlighting, translucency, slab condition and fabrication requirements must be assessed per material.", eyebrow: "Natural stone \u00b7 Decorative surfaces", bullets: ["Feature application and lighting intent", "Slab dimensions and thickness", "Fabrication and installation location"] };
export default function Page() { return <LegacyLanding config={config} />; }
