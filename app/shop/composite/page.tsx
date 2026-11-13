import type { Metadata } from "next";
import { LegacyLanding } from "@/components/LegacyLanding";

export const metadata: Metadata = { title: "Composite surfaces", description: "Explore composite surface categories and clarify the application, finish, dimensions and performance requirements before selecting a product.", alternates: { canonical: "/shop/composite/" } };
const config = { title: "Composite surfaces", description: "Explore composite surface categories and clarify the application, finish, dimensions and performance requirements before selecting a product.", eyebrow: "Architectural surfaces \u00b7 Material family", bullets: ["Application and performance needs", "Colour and finish", "Format, thickness and quantity"], image: "/images/uploads/neolith-facade-reference.webp", imageAlt: "Illustrative architectural facade with composite cladding", imageCaption: "Illustrative facade direction · Confirm product and performance data" };
export default function Page() { return <LegacyLanding config={config} />; }
