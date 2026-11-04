export type Material = {
  slug: string;
  name: string;
  family: string;
  colour: string;
  finish: string[];
  applications: string[];
  summary: string;
  image: string;
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
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
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
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85",
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
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
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
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
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
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=85",
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
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
    illustrative: true
  }
];

export const families = [
  "Marble",
  "Granite",
  "Quartzite",
  "Travertine / limestone",
  "Onyx",
  "Porcelain / sintered stone",
  "Other / need guidance"
];

export const colours = ["White", "Beige", "Grey", "Black", "Brown / earthy", "Green / blue", "Any / recommend options"];
