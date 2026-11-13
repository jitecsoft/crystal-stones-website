import type { Metadata } from "next";
import { FamilyLanding, type FamilyLandingConfig } from "@/components/FamilyLanding";

export const metadata: Metadata = {
  title: "Sandstone",
  description: "Explore sandstone options for architectural and landscape applications. Suitability depends on stone properties, finish, exposure, installation and local conditions.",
  alternates: { canonical: "/sandstone/" }
};

const config: FamilyLandingConfig = {
  family: "Sandstone",
  shortName: "Sandstone",
  eyebrow: "Natural stone · Material family",
  title: <>Sandstone, grounded in <em>place.</em></>,
  intro: "A layered sedimentary stone with an earthy, architectural character. Sandstone works hard in facades, floors and landscape settings, provided the right grade, finish and exposure details are confirmed for the project.",
  heroImage: "/images/catalogue/natural-stone-families/sandstone-outdoor.webp",
  heroAlt: "Illustrative warm sandstone rocks in an outdoor setting",
  heroCaption: "Illustrative sandstone study · Grade and exposure suitability vary",
  facts: [
    { label: "Character", value: "Layered, earthy, sedimentary" },
    { label: "Finishes", value: "Natural, honed, sandblasted" },
    { label: "Best for", value: "Facades, floors and landscape" },
    { label: "Confirm", value: "Porosity, exposure and sealing" },
  ],
  headline: "Selected sandstone references.",
  sectionCopy: "A material direction for grounded, textural spaces. Confirm the grade and finish against sun, rain and foot traffic before specification.",
  notes: [
    { number: "01", title: "Choose the grade", copy: "Sandstone varies widely in density and absorption. A grade suitable for a sheltered interior may not suit an exposed facade or wet area." },
    { number: "02", title: "Match the texture", copy: "Natural and sandblasted faces give grip and character; honed faces are calmer but can become slippery when wet. Match the finish to the surface's use." },
    { number: "03", title: "Plan for the climate", copy: "Exposure to rain, salt and freeze-thaw cycles affects long-term performance. Confirm sealing, fixing and detailing with the project team." },
  ],
  applications: [
    { label: "Facades & exterior", value: "Facade / exterior" },
    { label: "Floors & paving", value: "Flooring" },
    { label: "Landscape & walls", value: "Wall cladding / feature wall" },
    { label: "Bespoke furniture", value: "Furniture / bespoke work" },
  ],
  quoteHref: `/requirement-builder/?${new URLSearchParams({ material: "Sandstone" }).toString()}`,
  related: [
    { href: "/travertine/", label: "Travertine" },
    { href: "/granite/", label: "Granite" },
    { href: "/all-materials/", label: "All materials" },
  ],
};

export default function SandstonePage() {
  return <FamilyLanding config={config} />;
}
