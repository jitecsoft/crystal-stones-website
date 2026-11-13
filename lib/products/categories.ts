/**
 * Stone category definitions shared by server pages and admin client
 * components (no Supabase imports here so the list is safe in the browser).
 */

export const productCategories = [
  { slug: "marble", label: "Marble", listingLabel: "Imported natural marble", listingHref: "/marble/" },
  { slug: "granite", label: "Granite", listingLabel: "Granite", listingHref: "/granite/" },
  { slug: "quartzite", label: "Quartzite", listingLabel: "Quartzite", listingHref: "/all-materials/" },
  { slug: "onyx", label: "Onyx", listingLabel: "Onyx", listingHref: "/onyx/" },
  { slug: "sandstone", label: "Sandstone", listingLabel: "Sandstone", listingHref: "/sandstone/" },
  { slug: "travertine-limestone", label: "Travertine & limestone", listingLabel: "Travertine", listingHref: "/travertine/" },
  { slug: "porcelain", label: "Porcelain", listingLabel: "Porcelain surfaces", listingHref: "/shop/porcelain/" },
  { slug: "quartz", label: "Quartz", listingLabel: "Quartz surfaces", listingHref: "/all-materials/quartz/" },
  { slug: "composite", label: "Composite surfaces", listingLabel: "Composite surfaces", listingHref: "/shop/composite/" },
  { slug: "ceramic", label: "Ceramic", listingLabel: "Ceramic surfaces", listingHref: "/all-materials/ceramic/" }
] as const;

export type ProductCategorySlug = (typeof productCategories)[number]["slug"];

export const productCategorySlugs = productCategories.map((category) => category.slug) as ProductCategorySlug[];

export function productCategoryLabel(slug: string) {
  return productCategories.find((category) => category.slug === slug)?.label ?? "Stone";
}

export function productCategory(slug: string) {
  return productCategories.find((category) => category.slug === slug);
}

/** Family strings used by FamilyLanding configs → product category slugs. */
const familyToCategory: Record<string, ProductCategorySlug> = {
  "Marble": "marble",
  "Granite": "granite",
  "Quartzite": "quartzite",
  "Onyx": "onyx",
  "Sandstone": "sandstone",
  "Travertine / limestone": "travertine-limestone",
  "Porcelain / sintered stone": "porcelain",
  "Quartz": "quartz",
  "Composite": "composite",
  "Ceramic": "ceramic"
};

export function categoryForFamily(family: string) {
  return familyToCategory[family] ?? null;
}

/**
 * Colour-family sub-categories, one level under each stone category
 * (e.g. "White marble" under Marble, "Black granite" under Granite).
 * Slugs are globally unique: <category>-<family>.
 */
export const categorySubfamilies: Record<ProductCategorySlug, { slug: string; label: string }[]> = {
  marble: [
    { slug: "marble-white", label: "White marble" },
    { slug: "marble-beige", label: "Beige marble" },
    { slug: "marble-grey", label: "Grey marble" },
    { slug: "marble-black", label: "Black marble" },
    { slug: "marble-brown", label: "Brown marble" },
    { slug: "marble-coloured", label: "Coloured marble" }
  ],
  granite: [
    { slug: "granite-black", label: "Black granite" },
    { slug: "granite-grey", label: "Grey granite" },
    { slug: "granite-white", label: "White granite" },
    { slug: "granite-beige-brown", label: "Beige & brown granite" },
    { slug: "granite-red-pink", label: "Red & pink granite" },
    { slug: "granite-green", label: "Green granite" }
  ],
  quartzite: [
    { slug: "quartzite-white", label: "White quartzite" },
    { slug: "quartzite-grey", label: "Grey quartzite" },
    { slug: "quartzite-green", label: "Green quartzite" },
    { slug: "quartzite-blue", label: "Blue quartzite" },
    { slug: "quartzite-pink-red", label: "Pink & red quartzite" }
  ],
  onyx: [
    { slug: "onyx-white", label: "White onyx" },
    { slug: "onyx-amber", label: "Amber & honey onyx" },
    { slug: "onyx-green", label: "Green onyx" },
    { slug: "onyx-pink-red", label: "Pink & red onyx" },
    { slug: "onyx-black-brown", label: "Black & brown onyx" }
  ],
  sandstone: [
    { slug: "sandstone-beige", label: "Beige sandstone" },
    { slug: "sandstone-red", label: "Red sandstone" },
    { slug: "sandstone-brown", label: "Brown sandstone" },
    { slug: "sandstone-grey", label: "Grey sandstone" }
  ],
  "travertine-limestone": [
    { slug: "travertine-limestone-ivory-beige", label: "Ivory & beige travertine" },
    { slug: "travertine-limestone-white", label: "White limestone" },
    { slug: "travertine-limestone-grey", label: "Grey limestone" }
  ],
  porcelain: [
    { slug: "porcelain-white", label: "White porcelain" },
    { slug: "porcelain-grey", label: "Grey porcelain" },
    { slug: "porcelain-beige", label: "Beige porcelain" },
    { slug: "porcelain-dark", label: "Dark porcelain" },
    { slug: "porcelain-patterned", label: "Patterned porcelain" }
  ],
  quartz: [
    { slug: "quartz-white", label: "White quartz" },
    { slug: "quartz-grey", label: "Grey quartz" },
    { slug: "quartz-black", label: "Black quartz" },
    { slug: "quartz-beige", label: "Beige quartz" },
    { slug: "quartz-coloured", label: "Coloured & speckled quartz" }
  ],
  composite: [
    { slug: "composite-neutral", label: "Neutral composite" },
    { slug: "composite-dark", label: "Dark composite" },
    { slug: "composite-coloured", label: "Coloured composite" },
    { slug: "composite-metallic", label: "Metallic composite" }
  ],
  ceramic: [
    { slug: "ceramic-white", label: "White ceramic" },
    { slug: "ceramic-grey", label: "Grey ceramic" },
    { slug: "ceramic-beige", label: "Beige ceramic" },
    { slug: "ceramic-dark", label: "Dark ceramic" },
    { slug: "ceramic-patterned", label: "Patterned ceramic" }
  ]
};

const allSubfamilies = Object.values(categorySubfamilies).flat();

export const subfamilySlugs = allSubfamilies.map((sub) => sub.slug);

export function subfamilyLabel(slug: string) {
  return allSubfamilies.find((sub) => sub.slug === slug)?.label ?? "";
}

export function subfamiliesForCategory(category: string) {
  return (categorySubfamilies as Record<string, { slug: string; label: string }[]>)[category] ?? [];
}

export function isValidSubfamily(slug: string) {
  return subfamilySlugs.includes(slug);
}
