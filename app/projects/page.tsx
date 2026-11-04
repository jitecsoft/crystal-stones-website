import type { Metadata } from "next";
import { LegacyLanding } from "@/components/LegacyLanding";

export const metadata: Metadata = { title: "Projects", description: "A place for verified Crystal Stones project references, applications and material choices. Project photography and details should be published only when accurate and approved.", alternates: { canonical: "/projects/" } };
const config = { title: "Projects", description: "A place for verified Crystal Stones project references, applications and material choices. Project photography and details should be published only when accurate and approved.", eyebrow: "Project inspiration", bullets: ["Residential and commercial applications", "Material and finish references", "Project-specific enquiries"] };
export default function Page() { return <LegacyLanding config={config} />; }
