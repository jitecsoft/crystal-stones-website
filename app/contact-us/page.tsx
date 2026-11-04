import type { Metadata } from "next";
import { LegacyLanding } from "@/components/LegacyLanding";

export const metadata: Metadata = { title: "Contact Crystal Stones", description: "Tell us about your project, material preference, approximate area and delivery location so the team can review the requirement.", alternates: { canonical: "/contact-us/" } };
const config = { title: "Contact Crystal Stones", description: "Tell us about your project, material preference, approximate area and delivery location so the team can review the requirement.", eyebrow: "Start a conversation", bullets: ["Material and colour preference", "Approximate area and application", "Project location and timeline"] };
export default function Page() { return <LegacyLanding config={config} />; }
