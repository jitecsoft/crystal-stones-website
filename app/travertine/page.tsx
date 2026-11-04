import type { Metadata } from "next";
import { LegacyLanding } from "@/components/LegacyLanding";

export const metadata: Metadata = { title: "Travertine", description: "Explore travertine and related warm-toned natural stone for floors, walls and architectural details. Confirm filling, finish, sealing and application suitability before specification.", alternates: { canonical: "/travertine/" } };
const config = { title: "Travertine", description: "Explore travertine and related warm-toned natural stone for floors, walls and architectural details. Confirm filling, finish, sealing and application suitability before specification.", eyebrow: "Natural stone \u00b7 Material family", bullets: ["Filled or unfilled preference", "Finish and application", "Maintenance and sealing expectations"] };
export default function Page() { return <LegacyLanding config={config} />; }
