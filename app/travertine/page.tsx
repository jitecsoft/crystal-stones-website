import type { Metadata } from "next";
import { FamilyLanding, type FamilyLandingConfig } from "@/components/FamilyLanding";

export const metadata: Metadata = {
  title: "Travertine",
  description: "Explore travertine and related warm-toned natural stone for floors, walls and architectural details. Confirm filling, finish, sealing and application suitability before specification.",
  alternates: { canonical: "/travertine/" }
};

const config: FamilyLandingConfig = {
  family: "Travertine / limestone",
  shortName: "Travertine",
  eyebrow: "Natural stone · Material family",
  title: <>Travertine, warm by <em>nature.</em></>,
  intro: "A layered, warm-toned stone that brings quiet texture to floors, walls and bathrooms. Its surface can be filled or left open, honed or brushed; that choice changes both the look and the maintenance story.",
  heroImage: "/images/catalogue/natural-stone-families/travertine.webp",
  heroAlt: "Illustrative close-up of a warm beige travertine surface with natural pitting",
  heroCaption: "Illustrative travertine study · Filling and finish vary by product",
  facts: [
    { label: "Character", value: "Layered, porous, warm-toned" },
    { label: "Finishes", value: "Honed, brushed, filled or open" },
    { label: "Best for", value: "Floors, walls and bathrooms" },
    { label: "Confirm", value: "Filling, sealing and exposure" },
  ],
  headline: "Selected travertine references.",
  sectionCopy: "A warm neutral direction for calm interiors. Confirm whether the surface is filled, how it is finished and how it should be maintained.",
  notes: [
    { number: "01", title: "Choose filled or open", copy: "Filled travertine gives a smoother, more uniform floor. Unfilled surfaces keep the stone's natural pitting, which suits some walls but needs more care underfoot." },
    { number: "02", title: "Think about sealing", copy: "Travertine is porous. Confirm the sealer, the reapplication interval and how the surface will behave in wet or high-traffic areas." },
    { number: "03", title: "Check the tone and lot", copy: "Warm neutrals shift between blocks, from pale ivory to walnut. Review the actual batch together before ordering for a continuous scheme." },
  ],
  applications: [
    { label: "Floors & stairs", value: "Flooring" },
    { label: "Wall cladding", value: "Wall cladding / feature wall" },
    { label: "Bathrooms & vanities", value: "Bathroom / vanity" },
    { label: "Facades & exterior", value: "Facade / exterior" },
  ],
  quoteHref: `/requirement-builder/?${new URLSearchParams({ material: "Travertine / limestone" }).toString()}`,
  related: [
    { href: "/marble/", label: "Imported marble" },
    { href: "/sandstone/", label: "Sandstone" },
    { href: "/all-materials/", label: "All materials" },
  ],
};

export default function TravertinePage() {
  return <FamilyLanding config={config} />;
}
