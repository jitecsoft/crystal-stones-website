import type { Metadata } from "next";
import { FamilyLanding, type FamilyLandingConfig } from "@/components/FamilyLanding";

export const metadata: Metadata = {
  title: "Granite",
  description: "Explore granite surface directions for countertops, flooring and architectural applications. Share the project to confirm grade, finish, dimensions and availability.",
  alternates: { canonical: "/granite/" }
};

const config: FamilyLandingConfig = {
  family: "Granite",
  shortName: "Granite",
  eyebrow: "Natural stone · Material family",
  title: <>Granite, shaped by <em>purpose.</em></>,
  intro: "A hard-wearing natural stone with a broad colour and finish range, used across kitchens, floors, stairs and exterior architecture. The right granite depends on the application, the finish and the slab actually available.",
  heroImage: "/images/catalogue/natural-stone-families/granite-family-collection.webp",
  heroAlt: "Illustrative arrangement of granite samples in silver, charcoal, black, beige and green",
  heroCaption: "Illustrative granite references · Not a representation of current stock",
  facts: [
    { label: "Formats", value: "Slabs, cut-to-size, tiles" },
    { label: "Finishes", value: "Polished, honed, flamed, leathered" },
    { label: "Best for", value: "Countertops, flooring, exterior" },
    { label: "Confirmed", value: "Grade, lot and availability" },
  ],
  headline: "Selected granite references.",
  sectionCopy: "A starting point for colour and finish direction. Each reference is confirmed against the project before specification.",
  notes: [
    { number: "01", title: "Confirm the grade", copy: "Granite is a broad family. Mineral composition, porosity and consistency vary by quarry and lot, so confirm the actual stone rather than the category." },
    { number: "02", title: "Match the finish to use", copy: "Polished surfaces suit vertical and low-traffic work; flamed or leathered finishes are often preferred where grip and exterior exposure matter." },
    { number: "03", title: "Check slab and batch", copy: "Movement, veining and shade can shift between blocks. Review the slab or batch photography and dimensions before cutting begins." },
  ],
  applications: [
    { label: "Kitchen countertops", value: "Kitchen countertop" },
    { label: "Floors & stairs", value: "Flooring" },
    { label: "Facades & exterior", value: "Facade / exterior" },
    { label: "Bespoke furniture", value: "Furniture / bespoke work" },
  ],
  quoteHref: `/requirement-builder/?${new URLSearchParams({ material: "Granite" }).toString()}`,
  related: [
    { href: "/marble/", label: "Imported marble" },
    { href: "/shop/sintered-stone/", label: "Architectural surfaces" },
    { href: "/all-materials/", label: "All materials" },
  ],
};

export default function GranitePage() {
  return <FamilyLanding config={config} />;
}
