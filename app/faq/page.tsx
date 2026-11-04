import type { Metadata } from "next";
import { LegacyLanding } from "@/components/LegacyLanding";

export const metadata: Metadata = { title: "FAQ", description: "Answers to common questions about choosing stone and architectural surfaces, estimating area, sharing specifications and requesting quotations.", alternates: { canonical: "/faq/" } };
const config = { title: "FAQ", description: "Answers to common questions about choosing stone and architectural surfaces, estimating area, sharing specifications and requesting quotations.", eyebrow: "Helpful guidance", bullets: ["How much material should I allow?", "Which specifications affect quotation?", "How are availability and delivery confirmed?"] };
export default function Page() { return <LegacyLanding config={config} />; }
