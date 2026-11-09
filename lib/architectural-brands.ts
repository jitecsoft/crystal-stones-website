export type ArchitecturalBrand = {
  slug: string;
  name: string;
  producer: string;
  category: string;
  summary: string;
  applications: string[];
  officialUrl: string;
  href: string;
  sourceChecked: string;
  image: {
    src: string;
    alt: string;
  };
};

/** Brand and category references only. This list does not assert a Crystal Stones authorization or current supply relationship. */
export const architecturalBrands: ArchitecturalBrand[] = [
  {
    slug: "neolith",
    name: "Neolith",
    producer: "Neolith",
    category: "Sintered stone architectural surfaces",
    summary: "A dedicated brand journey for architectural surface discovery. Check the current collection, finish and technical documents against the manufacturer’s product information before specification.",
    applications: ["Kitchen countertop", "Wall cladding / feature wall", "Flooring", "Bathroom / vanity"],
    officialUrl: "https://www.neolith.com/",
    href: "/neolith/",
    sourceChecked: "2026-11-04",
    image: {
      src: "/images/catalogue/architectural-surfaces/neolith.webp",
      alt: "Illustrative contemporary kitchen using a large-format architectural surface",
    },
  },
  {
    slug: "dekton",
    name: "Dekton",
    producer: "Cosentino",
    category: "Ultracompact surface",
    summary: "Dekton is presented by Cosentino as its ultracompact surface for design and architecture. Range names, available formats and product-specific details should be checked against current manufacturer information.",
    applications: ["Kitchen countertop", "Bathroom / vanity", "Flooring", "Wall cladding / feature wall", "Facade / exterior", "Furniture / bespoke work"],
    officialUrl: "https://www.cosentino.com/dekton/",
    href: "/architectural-surfaces/brands/dekton/",
    sourceChecked: "2026-11-04",
    image: {
      src: "/images/catalogue/architectural-surfaces/dekton.webp",
      alt: "Illustrative architectural surface application for a contemporary interior",
    },
  },
  {
    slug: "laminam",
    name: "Laminam",
    producer: "Laminam",
    category: "Large-format ceramic slabs",
    summary: "Laminam describes its offer as large-format ceramic slabs used in exterior architecture, interior design and furnishings. Confirm the chosen collection, application guidance and current specification with the manufacturer.",
    applications: ["Facade / exterior", "Wall cladding / feature wall", "Flooring", "Furniture / bespoke work"],
    officialUrl: "https://www.laminam.com/",
    href: "/architectural-surfaces/brands/laminam/",
    sourceChecked: "2026-11-04",
    image: {
      src: "/images/catalogue/architectural-surfaces/laminam.webp",
      alt: "Illustrative large-format ceramic surface application",
    },
  },
  {
    slug: "stonelam",
    name: "Stonelam",
    producer: "Stonelam Surfaces",
    category: "Porcelain slabs and architectural surfaces",
    summary: "Stonelam presents porcelain slabs for architecture, cladding, kitchens, bathrooms and furnishings. Its current product details and regional supply options should be confirmed for the project.",
    applications: ["Facade / exterior", "Wall cladding / feature wall", "Kitchen countertop", "Bathroom / vanity", "Furniture / bespoke work"],
    officialUrl: "https://www.stonelam.com/porcelain-slabs/",
    href: "/architectural-surfaces/brands/stonelam/",
    sourceChecked: "2026-11-04",
    image: {
      src: "/images/catalogue/materials/pexels-porcelain-application.webp",
      alt: "Illustrative porcelain surface application in a contemporary interior",
    },
  },
];

export function getArchitecturalBrand(slug: string) {
  return architecturalBrands.find((brand) => brand.slug === slug);
}
