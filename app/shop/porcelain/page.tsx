import type { Metadata } from "next";
import { LegacyLanding } from "@/components/LegacyLanding";

export const metadata: Metadata = { title: "Porcelain surfaces", description: "Explore porcelain slabs and tiles for selected flooring, wall, countertop and architectural applications. Verify the exact product specification and fabrication guidance before ordering.", alternates: { canonical: "/shop/porcelain/" } };
const config = { title: "Porcelain surfaces", description: "Explore porcelain slabs and tiles for selected flooring, wall, countertop and architectural applications. Verify the exact product specification and fabrication guidance before ordering.", eyebrow: "Architectural surfaces \u00b7 Material family", bullets: ["Slab or tile format", "Thickness and finish", "Application and quantity"], image: "/images/neolith-interior.webp", imageAlt: "Illustrative large-format porcelain surface in a kitchen interior", imageCaption: "Illustrative large-format surface · Not product photography" };
export default function Page() { return <LegacyLanding config={config} />; }
