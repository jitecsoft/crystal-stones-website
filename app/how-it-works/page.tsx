import type { Metadata } from "next";
import { LegacyLanding } from "@/components/LegacyLanding";

export const metadata: Metadata = { title: "How it works", description: "A straightforward path from material discovery to a usable requirement and a quotation conversation.", alternates: { canonical: "/how-it-works/" } };
const config = { title: "How it works", description: "A straightforward path from material discovery to a usable requirement and a quotation conversation.", eyebrow: "The process", bullets: ["Explore material families", "Share area, finish, thickness and application", "Confirm specifications, availability and quotation"] };
export default function Page() { return <LegacyLanding config={config} />; }
