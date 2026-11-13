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
