export type ArchitecturalBrandCollection = {
  name: string;
  /** Colourway names when the catalogue groups several colours on one collection page. */
  colours?: string[];
  image?: string;
};

export type ArchitecturalBrand = {
  slug: string;
  name: string;
  producer: string;
  category: string;
  summary: string;
  applications: string[];
  href: string;
  sourceChecked: string;
  image: {
    src: string;
    alt: string;
  };
  collections?: ArchitecturalBrandCollection[];
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
    href: "/architectural-surfaces/brands/stonelam/",
    sourceChecked: "2026-11-04",
    image: {
      src: "/images/catalogue/materials/pexels-porcelain-application.webp",
      alt: "Illustrative porcelain surface application in a contemporary interior",
    },
  },
  {
    slug: "techlam",
    name: "Techlam",
    producer: "Levantina Group",
    category: "Sintered stone surfaces",
    summary: "Techlam is Levantina Group's specialised sintered stone brand and a pioneer in the material since 2007. Its 2027 general catalogue lists around seventy collections in 3–20 mm thicknesses and slab formats up to 3200 × 1600 mm for facades, interiors, worktops and furniture.",
    applications: ["Kitchen countertop", "Bathroom / vanity", "Flooring", "Wall cladding / feature wall", "Facade / exterior", "Furniture / bespoke work"],
    href: "/architectural-surfaces/brands/techlam/",
    sourceChecked: "2026-11-13",
    image: {
      src: "/images/catalogue/architectural-surfaces/techlam/techlam-showroom.webp",
      alt: "Manufacturer catalogue render of Techlam sintered stone surfaces in a contemporary showroom",
    },
    collections: [
      { name: "Pure", colours: ["Ice", "Neu", "Bone", "Antracita", "Coal", "Black"], image: "/images/catalogue/architectural-surfaces/techlam/collections/pure.webp" },
      { name: "Blaze", colours: ["Snow", "Dark"], image: "/images/catalogue/architectural-surfaces/techlam/collections/blaze.webp" },
      { name: "Avilea", colours: ["Ivory", "Grey", "Ocre"], image: "/images/catalogue/architectural-surfaces/techlam/collections/avilea.webp" },
      { name: "Hydra", colours: ["Argen", "Beige"], image: "/images/catalogue/architectural-surfaces/techlam/collections/hydra.webp" },
      { name: "Alcázar", colours: ["Beige", "Cotto"], image: "/images/catalogue/architectural-surfaces/techlam/collections/alcazar.webp" },
      { name: "Steel", colours: ["White", "Corten", "Dark", "Chrome", "Marine"], image: "/images/catalogue/architectural-surfaces/techlam/collections/steel.webp" },
      { name: "Vulcano", colours: ["Concrete", "Ceniza", "Roca", "Coal"], image: "/images/catalogue/architectural-surfaces/techlam/collections/vulcano.webp" },
      { name: "Rust", colours: ["Corten", "Iron"], image: "/images/catalogue/architectural-surfaces/techlam/collections/rust.webp" },
      { name: "Slate Ivory", image: "/images/catalogue/architectural-surfaces/techlam/collections/slate-ivory.webp" },
      { name: "Strattos", image: "/images/catalogue/architectural-surfaces/techlam/collections/strattos.webp" },
      { name: "Zahir Perle", image: "/images/catalogue/architectural-surfaces/techlam/collections/zahir-perle.webp" },
      { name: "Urban", image: "/images/catalogue/architectural-surfaces/techlam/collections/urban.webp" },
      { name: "Tektonika", image: "/images/catalogue/architectural-surfaces/techlam/collections/tektonika.webp" },
      { name: "Opium Black", image: "/images/catalogue/architectural-surfaces/techlam/collections/opium-black.webp" },
      { name: "Tesa", image: "/images/catalogue/architectural-surfaces/techlam/collections/tesa.webp" },
      { name: "Bianco Lasa", image: "/images/catalogue/architectural-surfaces/techlam/collections/bianco-lasa.webp" },
      { name: "Montblanc", image: "/images/catalogue/architectural-surfaces/techlam/collections/montblanc.webp" },
      { name: "Calacatta White", image: "/images/catalogue/architectural-surfaces/techlam/collections/calacatta-white.webp" },
      { name: "Marvel Gold", image: "/images/catalogue/architectural-surfaces/techlam/collections/marvel-gold.webp" },
      { name: "Kalos Bianco", image: "/images/catalogue/architectural-surfaces/techlam/collections/kalos-bianco.webp" },
      { name: "Macchia Gold", image: "/images/catalogue/architectural-surfaces/techlam/collections/macchia-gold.webp" },
      { name: "Tropical Green", image: "/images/catalogue/architectural-surfaces/techlam/collections/tropical-green.webp" },
      { name: "Taj Mahal", image: "/images/catalogue/architectural-surfaces/techlam/collections/taj-mahal.webp" },
      { name: "Kaledonia", image: "/images/catalogue/architectural-surfaces/techlam/collections/kaledonia.webp" },
      { name: "Essential Gold", image: "/images/catalogue/architectural-surfaces/techlam/collections/essential-gold.webp" },
      { name: "Bellagio", image: "/images/catalogue/architectural-surfaces/techlam/collections/bellagio.webp" },
      { name: "Alhambra", image: "/images/catalogue/architectural-surfaces/techlam/collections/alhambra.webp" },
      { name: "Taj Mahal Beige", image: "/images/catalogue/architectural-surfaces/techlam/collections/taj-mahal-beige.webp" },
      { name: "Limestone", image: "/images/catalogue/architectural-surfaces/techlam/collections/limestone.webp" },
      { name: "Colossal Cream", image: "/images/catalogue/architectural-surfaces/techlam/collections/colossal-cream.webp" },
      { name: "Patagonia", image: "/images/catalogue/architectural-surfaces/techlam/collections/patagonia.webp" },
      { name: "Breccia Brown", image: "/images/catalogue/architectural-surfaces/techlam/collections/breccia-brown.webp" },
      { name: "Thar", image: "/images/catalogue/architectural-surfaces/techlam/collections/thar.webp" },
      { name: "Travertino Pearl", image: "/images/catalogue/architectural-surfaces/techlam/collections/travertino-pearl.webp" },
      { name: "Viana Ivory", image: "/images/catalogue/architectural-surfaces/techlam/collections/viana-ivory.webp" },
      { name: "Viana Nature", image: "/images/catalogue/architectural-surfaces/techlam/collections/viana-nature.webp" },
      { name: "Delta", image: "/images/catalogue/architectural-surfaces/techlam/collections/delta.webp" },
      { name: "Salina Ivory", image: "/images/catalogue/architectural-surfaces/techlam/collections/salina-ivory.webp" },
      { name: "Salina Cream", image: "/images/catalogue/architectural-surfaces/techlam/collections/salina-cream.webp" },
      { name: "Salina Taupe", image: "/images/catalogue/architectural-surfaces/techlam/collections/salina-taupe.webp" },
      { name: "Itálica", image: "/images/catalogue/architectural-surfaces/techlam/collections/italica.webp" },
      { name: "Travertino Silver", image: "/images/catalogue/architectural-surfaces/techlam/collections/travertino-silver.webp" },
      { name: "Nuvola", image: "/images/catalogue/architectural-surfaces/techlam/collections/nuvola.webp" },
      { name: "Thundra", image: "/images/catalogue/architectural-surfaces/techlam/collections/thundra.webp" },
      { name: "Supergrey", image: "/images/catalogue/architectural-surfaces/techlam/collections/supergrey.webp" },
      { name: "Ceppo", image: "/images/catalogue/architectural-surfaces/techlam/collections/ceppo.webp" },
      { name: "Amazonia", image: "/images/catalogue/architectural-surfaces/techlam/collections/amazonia.webp" },
      { name: "Forest", image: "/images/catalogue/architectural-surfaces/techlam/collections/forest.webp" },
      { name: "Ferox", image: "/images/catalogue/architectural-surfaces/techlam/collections/ferox.webp" },
      { name: "Fior di Bosco", image: "/images/catalogue/architectural-surfaces/techlam/collections/fior-di-bosco.webp" },
      { name: "Tambora", image: "/images/catalogue/architectural-surfaces/techlam/collections/tambora.webp" },
      { name: "Regio", image: "/images/catalogue/architectural-surfaces/techlam/collections/regio.webp" },
      { name: "Basalt Black", image: "/images/catalogue/architectural-surfaces/techlam/collections/basalt-black.webp" },
      { name: "Pierre Bleue", image: "/images/catalogue/architectural-surfaces/techlam/collections/pierre-bleue.webp" },
      { name: "Concerto", image: "/images/catalogue/architectural-surfaces/techlam/collections/concerto.webp" },
      { name: "Cosmopolitan Black", image: "/images/catalogue/architectural-surfaces/techlam/collections/cosmopolitan-black.webp" },
      { name: "St. Laurent", image: "/images/catalogue/architectural-surfaces/techlam/collections/st-laurent.webp" },
      { name: "Starlight", image: "/images/catalogue/architectural-surfaces/techlam/collections/starlight.webp" },
    ],
  },
  {
    slug: "sapienstone",
    name: "SapienStone",
    producer: "Iris Ceramica Group",
    category: "Full-body porcelain slabs",
    summary: "SapienStone is Iris Ceramica Group's full-body porcelain slab brand, focused on kitchen worktops, vanities and facade systems. Its collection names, available formats and technical data should be confirmed against the manufacturer's current catalogue.",
    applications: ["Kitchen countertop", "Bathroom / vanity", "Wall cladding / feature wall", "Flooring", "Furniture / bespoke work"],
    href: "/architectural-surfaces/brands/sapienstone/",
    sourceChecked: "2026-11-13",
    image: {
      src: "/images/catalogue/materials/pexels-porcelain-application.webp",
      alt: "Illustrative porcelain slab application in a contemporary interior",
    },
  },
];

export function getArchitecturalBrand(slug: string) {
  return architecturalBrands.find((brand) => brand.slug === slug);
}
