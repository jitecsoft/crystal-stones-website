import type { Metadata } from "next";
import { LegacyLanding } from "@/components/LegacyLanding";

export const metadata: Metadata = { title: "Sandstone", description: "Explore sandstone options for architectural and landscape applications. Suitability depends on stone properties, finish, exposure, installation and local conditions.", alternates: { canonical: "/sandstone/" } };
const config = { title: "Sandstone", description: "Explore sandstone options for architectural and landscape applications. Suitability depends on stone properties, finish, exposure, installation and local conditions.", eyebrow: "Natural stone \u00b7 Material family", bullets: ["Interior, exterior or landscape use", "Surface finish and colour", "Exposure and installation conditions"] };
export default function Page() { return <LegacyLanding config={config} />; }
