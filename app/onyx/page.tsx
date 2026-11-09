import type { Metadata } from "next";
import { FamilyLanding, type FamilyLandingConfig } from "@/components/FamilyLanding";

export const metadata: Metadata = {
  title: "Onyx",
  description: "Explore onyx as a distinctive decorative stone for feature applications. Backlighting, translucency, slab condition and fabrication requirements are assessed per material.",
  alternates: { canonical: "/onyx/" }
};

const config: FamilyLandingConfig = {
  family: "Onyx",
  shortName: "Onyx",
  eyebrow: "Natural stone · Decorative surfaces",
  title: <>Onyx, for a <em>decisive</em> interior.</>,
  intro: "A translucent, heavily patterned stone used where a surface should lead the room. Onyx rewards a precise brief: lighting intent, slab condition, reinforcement and fabrication all need to be understood before the material is committed.",
  heroImage: "/images/catalogue/natural-stone-families/onyx-amber.webp",
  heroAlt: "Illustrative close-up of amber onyx with layered translucent banding",
  heroCaption: "Illustrative onyx study · Backlighting and slab condition vary by lot",
  facts: [
    { label: "Character", value: "Translucent, patterned, fragile" },
    { label: "Formats", value: "Bookmatched slabs" },
    { label: "Best for", value: "Feature walls and backlit panels" },
    { label: "Review", value: "Condition, reinforcement, lighting" },
  ],
  headline: "Selected onyx references.",
  sectionCopy: "Photography shows a direction, not a guaranteed slab. Onyx is selected against the project and reviewed for condition before fabrication.",
  notes: [
    { number: "01", title: "Plan the lighting", copy: "Backlighting reveals colour and movement but also highlights cracks and fill. Decide the lighting approach before the slab is cut." },
    { number: "02", title: "Review the slab", copy: "Onyx can be brittle and variable. Inspect the actual slab, its reinforcement and any natural voids or repairs with the fabricator." },
    { number: "03", title: "Keep it protected", copy: "Acids, heat and abrasion affect many onyx surfaces. Confirm the sealing and maintenance routine for the intended application." },
  ],
  applications: [
    { label: "Feature walls", value: "Wall cladding / feature wall" },
    { label: "Bathroom vanities", value: "Bathroom / vanity" },
    { label: "Bespoke furniture", value: "Furniture / bespoke work" },
  ],
  quoteHref: `/requirement-builder/?${new URLSearchParams({ material: "Onyx" }).toString()}`,
  related: [
    { href: "/marble/", label: "Imported marble" },
    { href: "/travertine/", label: "Travertine" },
    { href: "/all-materials/", label: "All materials" },
  ],
};

export default function OnyxPage() {
  return <FamilyLanding config={config} />;
}
