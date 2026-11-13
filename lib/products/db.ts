import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig, hasSupabaseConfig } from "@/lib/supabase/config";

/**
 * Team-managed catalogue products. Rows live in the `catalogue_products` table
 * (see supabase/migrations/20261113000000_catalogue_products.sql). All reads
 * here use the publishable key, so row-level security only ever exposes
 * published products on the public site.
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

/** Category → illustrative interior used on detail pages until photos are published. */
export const categoryApplicationImages: Record<ProductCategorySlug, { src: string; alt: string }> = {
  marble: { src: "/images/catalogue/imported-marble/marble-feature-hero.webp", alt: "Illustrative interior with a bookmatched marble feature wall and stone counter" },
  granite: { src: "/images/neolith-interior.webp", alt: "Illustrative kitchen interior with a grey stone island and worktops" },
  quartzite: { src: "/images/home-hero.webp", alt: "Illustrative interior with a stone-topped island counter" },
  onyx: { src: "/images/catalogue/materials/pexels-porcelain-application.webp", alt: "Illustrative bathroom interior with stone-clad walls and vanity" },
  sandstone: { src: "/images/catalogue/natural-stone-families/sandstone-outdoor.webp", alt: "Illustrative sandstone in an exterior, landscape context" },
  "travertine-limestone": { src: "/images/home-hero.webp", alt: "Illustrative warm beige interior with stone feature wall and island counter" },
  porcelain: { src: "/images/neolith-interior.webp", alt: "Illustrative kitchen interior clad in large-format surface slabs" },
  quartz: { src: "/images/catalogue/materials/pexels-porcelain-application.webp", alt: "Illustrative engineered stone surface in a bathroom interior" },
  composite: { src: "/images/uploads/neolith-facade-reference.webp", alt: "Illustrative architectural facade with composite cladding" },
  ceramic: { src: "/images/catalogue/materials/pexels-porcelain-application.webp", alt: "Illustrative ceramic surface in a contemporary interior" }
};

/** Category → illustrative slab/texture used as the gallery fallback before photos are published. */
export const categoryFallbackImages: Record<ProductCategorySlug, string> = {
  marble: "/images/catalogue/imported-marble/marble-family-collection.webp",
  granite: "/images/catalogue/natural-stone-families/granite-family-collection.webp",
  quartzite: "/images/catalogue/materials/pexels-quartzite.webp",
  onyx: "/images/catalogue/natural-stone-families/onyx-amber.webp",
  sandstone: "/images/catalogue/natural-stone-families/sandstone.webp",
  "travertine-limestone": "/images/catalogue/natural-stone-families/travertine.webp",
  porcelain: "/images/catalogue/materials/pexels-porcelain-application.webp",
  quartz: "/images/catalogue/materials/pexels-porcelain-application.webp",
  composite: "/images/uploads/neolith-facade-reference.webp",
  ceramic: "/images/catalogue/materials/pexels-porcelain-application.webp"
};

export type CatalogueProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  tags: string[];
  origin_country: string;
  origin_region: string;
  colours: string[];
  patterns: string[];
  finishes: string[];
  applications: string[];
  attributes_verified: boolean;
  care_notes: string;
  seo_title: string;
  seo_description: string;
  status: string;
  published_at: string | null;
  updated_at: string;
};

const productColumns = "id,slug,name,category,summary,description,tags,origin_country,origin_region,colours,patterns,finishes,applications,attributes_verified,care_notes,seo_title,seo_description,status,published_at,updated_at";

function publicClient() {
  const { url, key } = getSupabaseConfig();
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function getPublishedProduct(slug: string): Promise<CatalogueProduct | null> {
  if (!hasSupabaseConfig()) return null;
  try {
    const { data } = await publicClient()
      .from("catalogue_products")
      .select(productColumns)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    return (data as CatalogueProduct) ?? null;
  } catch {
    return null;
  }
}

export async function getPublishedProductsByCategory(category: string): Promise<CatalogueProduct[]> {
  if (!hasSupabaseConfig()) return [];
  try {
    const { data } = await publicClient()
      .from("catalogue_products")
      .select(productColumns)
      .eq("category", category)
      .eq("status", "published")
      .order("published_at", { ascending: false });
    return (data as CatalogueProduct[]) ?? [];
  } catch {
    return [];
  }
}

export async function getAllPublishedProducts(): Promise<CatalogueProduct[]> {
  if (!hasSupabaseConfig()) return [];
  try {
    const { data } = await publicClient()
      .from("catalogue_products")
      .select("slug,updated_at")
      .eq("status", "published");
    return (data as CatalogueProduct[]) ?? [];
  } catch {
    return [];
  }
}

/** First published (detail-variant) image URL for a product, or null. */
export async function getProductCoverUrl(slug: string): Promise<string | null> {
  if (!hasSupabaseConfig()) return null;
  try {
    const supabase = publicClient();
    const { data } = await supabase
      .from("published_media")
      .select("public_path")
      .eq("content_type", "product")
      .eq("entity_slug", slug)
      .eq("variant", "detail")
      .order("position", { ascending: true })
      .limit(1);
    const row = data?.[0];
    if (!row?.public_path) return null;
    return supabase.storage.from("crystal-stones-published").getPublicUrl(row.public_path).data.publicUrl;
  } catch {
    return null;
  }
}

export function slugify(name: string) {
  return name.toLowerCase().trim().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);
}
