export type Material = {
  slug: string;
  name: string;
  family: string;
  colour: string;
  finish: string[];
  applications: string[];
  summary: string;
  image: string;
  /** Illustrative interior showing the material family applied in a space — not the specific stone. */
  applicationImage?: {
    src: string;
    alt: string;
  };
  illustrative: boolean;
};

export const materials: Material[] = [
  {
    slug: "calacatta-style-marble",
    name: "Calacatta-style marble",
    family: "Marble",
    colour: "White",
    finish: ["Polished", "Honed"],
    applications: ["Flooring", "Feature walls", "Vanities"],
    summary: "A bright, expressive marble look for statement interiors. Confirm exact stone identity and lot availability before specification.",
    image: "/images/catalogue/imported-marble/pexels-white-marble.webp",
    applicationImage: {
      src: "/images/catalogue/imported-marble/marble-feature-hero.webp",
      alt: "Illustrative interior with white bookmatched marble feature wall and island counter"
    },
    illustrative: true
  },
  {
    slug: "silver-grey-granite",
    name: "Silver-grey granite",
    family: "Granite",
    colour: "Grey",
    finish: ["Polished", "Honed", "Flamed"],
    applications: ["Flooring", "Countertops", "Exterior"],
    summary: "A versatile grey-toned granite reference for residential and commercial applications.",
    image: "/images/catalogue/materials/pexels-granite.webp",
    applicationImage: {
      src: "/images/neolith-interior.webp",
      alt: "Illustrative kitchen interior with a grey stone island and worktops"
    },
    illustrative: true
  },
  {
    slug: "warm-travertine",
    name: "Warm travertine",
    family: "Travertine / limestone",
    colour: "Beige",
    finish: ["Honed", "Brushed"],
    applications: ["Flooring", "Wall cladding", "Bathrooms"],
    summary: "Warm, layered natural texture for calm interiors and architectural detailing.",
    image: "/images/catalogue/natural-stone-families/travertine.webp",
    applicationImage: {
      src: "/images/home-hero.webp",
      alt: "Illustrative warm beige interior with stone feature wall and island counter"
    },
    illustrative: true
  },
  {
    slug: "dramatic-quartzite",
    name: "Dramatic quartzite",
    family: "Quartzite",
    colour: "Green / blue",
    finish: ["Polished", "Honed"],
    applications: ["Countertops", "Feature walls", "Furniture"],
    summary: "A dramatic stone direction for feature surfaces; confirm technical suitability for the intended use.",
    image: "/images/catalogue/materials/pexels-quartzite.webp",
    applicationImage: {
      src: "/images/catalogue/interiors/interior-blue-kitchen.webp",
      alt: "Illustrative kitchen with dramatic stone worktops and a marble backsplash"
    },
    illustrative: true
  },
  {
    slug: "dark-granite",
    name: "Dark granite",
    family: "Granite",
    colour: "Black",
    finish: ["Polished", "Flamed", "Leathered"],
    applications: ["Countertops", "Flooring", "Exterior"],
    summary: "A dark-toned granite reference for bold, durable-looking surface schemes.",
    image: "/images/catalogue/materials/pexels-dark-granite.webp",
    applicationImage: {
      src: "/images/neolith-interior.webp",
      alt: "Illustrative kitchen interior with stone worktops and island"
    },
    illustrative: true
  },
  {
    slug: "amber-onyx",
    name: "Amber onyx",
    family: "Onyx",
    colour: "Amber / orange",
    finish: ["Polished", "Honed"],
    applications: ["Feature walls", "Backlit panels", "Vanities"],
    summary: "A translucent, patterned onyx direction for expressive feature surfaces. Backlighting, slab condition and reinforcement need project-specific review.",
    image: "/images/catalogue/natural-stone-families/onyx-amber.webp",
    applicationImage: {
      src: "/images/catalogue/interiors/interior-backlit-bar.webp",
      alt: "Illustrative bar counter with a backlit onyx and marble feature wall"
    },
    illustrative: true
  },
  {
    slug: "layered-sandstone",
    name: "Layered sandstone",
    family: "Sandstone",
    colour: "Brown / earthy",
    finish: ["Natural / sawn", "Honed", "Sandblasted"],
    applications: ["Facade / exterior", "Flooring", "Landscape"],
    summary: "A warm, layered sedimentary stone direction for architectural and landscape use. Confirm porosity, finish and exposure suitability.",
    image: "/images/catalogue/natural-stone-families/sandstone.webp",
    applicationImage: {
      src: "/images/catalogue/natural-stone-families/sandstone-outdoor.webp",
      alt: "Illustrative sandstone in an exterior, landscape context"
    },
    illustrative: true
  },
  {
    slug: "porcelain-surface",
    name: "Large-format porcelain surface",
    family: "Porcelain / sintered stone",
    colour: "White",
    finish: ["Polished", "Honed / matte"],
    applications: ["Countertops", "Wall cladding", "Bathrooms"],
    summary: "A contemporary large-format surface category. Confirm manufacturer, thickness and slab dimensions.",
    image: "/images/catalogue/materials/pexels-porcelain-application.webp",
    applicationImage: {
      src: "/images/neolith-interior.webp",
      alt: "Illustrative kitchen interior clad in large-format surface slabs"
    },
    illustrative: true
  }
];

export const families = [
  "Marble",
  "Granite",
  "Quartzite",
  "Travertine / limestone",
  "Onyx",
  "Sandstone",
  "Porcelain / sintered stone",
  "Other / need guidance"
];

export const colours = ["White", "Beige", "Grey", "Black", "Brown / earthy", "Amber / orange", "Green / blue", "Any / recommend options"];
