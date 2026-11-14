import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig, hasSupabaseConfig } from "@/lib/supabase/config";
import {
  categoryForFamily,
  categorySubfamilies,
  isValidSubfamily,
  productCategories,
  productCategory,
  productCategoryLabel,
  productCategorySlugs,
  subfamiliesForCategory,
  subfamilyLabel,
  subfamilySlugs,
  type ProductCategorySlug
} from "./categories";

export {
  categoryForFamily,
  categorySubfamilies,
  isValidSubfamily,
  productCategories,
  productCategory,
  productCategoryLabel,
  productCategorySlugs,
  subfamiliesForCategory,
  subfamilyLabel,
  subfamilySlugs
};
export type { ProductCategorySlug };

/**
 * Team-managed catalogue products. Rows live in the `catalogue_products` table
 * (see supabase/migrations/20261113000000_catalogue_products.sql). All reads
 * here use the publishable key, so row-level security only ever exposes
 * published products on the public site.
 */

/** Category → illustrative interior used on detail pages until photos are published. */
export const categoryApplicationImages: Record<ProductCategorySlug, { src: string; alt: string }> = {
  marble: { src: "/images/catalogue/imported-marble/marble-feature-hero.webp", alt: "Illustrative interior with a bookmatched marble feature wall and stone counter" },
  granite: { src: "/images/neolith-interior.webp", alt: "Illustrative kitchen interior with a grey stone island and worktops" },
  quartzite: { src: "/images/catalogue/interiors/interior-blue-kitchen.webp", alt: "Illustrative kitchen with dramatic stone worktops and a marble backsplash" },
  onyx: { src: "/images/catalogue/interiors/interior-backlit-bar.webp", alt: "Illustrative bar counter with a backlit onyx feature wall" },
  sandstone: { src: "/images/catalogue/natural-stone-families/sandstone-outdoor.webp", alt: "Illustrative sandstone in an exterior, landscape context" },
  "travertine-limestone": { src: "/images/home-hero.webp", alt: "Illustrative warm beige interior with stone feature wall and island counter" },
  porcelain: { src: "/images/neolith-interior.webp", alt: "Illustrative kitchen interior clad in large-format surface slabs" },
  quartz: { src: "/images/catalogue/materials/pexels-porcelain-application.webp", alt: "Illustrative engineered stone surface in a bathroom interior" },
  composite: { src: "/images/uploads/neolith-facade-reference.webp", alt: "Illustrative architectural facade with composite cladding" },
  ceramic: { src: "/images/catalogue/materials/pexels-porcelain-application.webp", alt: "Illustrative ceramic surface in a contemporary interior" }
};

/** Colour- and application-aware interior pool for product detail pages.
 *  Each entry matches a family of stones so a white marble and a black
 *  granite are shown in different settings. All entries are honestly
 *  labelled as illustrative on the page. */
const applicationInteriorPool = {
  whiteFeature: {
    src: "/images/catalogue/imported-marble/marble-feature-hero.webp",
    alt: "Illustrative interior with a white bookmatched marble feature wall and stone counter"
  },
  mutedKitchen: {
    src: "/images/neolith-interior.webp",
    alt: "Illustrative kitchen interior with muted grey stone worktops and a stone island"
  },
  warmLiving: {
    src: "/images/home-hero.webp",
    alt: "Illustrative living space with a warm beige marble island and feature wall"
  },
  marbleBathroom: {
    src: "/images/catalogue/materials/pexels-porcelain-application.webp",
    alt: "Illustrative bathroom interior clad in white marble with warm veining"
  },
  facadeCladding: {
    src: "/images/uploads/neolith-facade-reference.webp",
    alt: "Illustrative facade with grey architectural cladding panels"
  },
  sandstoneLandscape: {
    src: "/images/catalogue/natural-stone-families/sandstone-outdoor.webp",
    alt: "Illustrative sandstone in an exterior, landscape context"
  },
  greenBathroom: {
    src: "/images/catalogue/interiors/interior-green-bathroom.webp",
    alt: "Illustrative bathroom with a green-tiled feature wall, grey marble cladding and a rough stone basin"
  },
  blueKitchen: {
    src: "/images/catalogue/interiors/interior-blue-kitchen.webp",
    alt: "Illustrative kitchen with blue cabinetry and a dramatic grey marble backsplash"
  },
  backlitBar: {
    src: "/images/catalogue/interiors/interior-backlit-bar.webp",
    alt: "Illustrative bar counter with a backlit onyx and marble feature wall"
  },
  brownMarbleBathroom: {
    src: "/images/catalogue/interiors/interior-brown-marble-bathroom.webp",
    alt: "Illustrative bathroom with a dark brown marble vanity and backlit detail"
  },
  terracottaLiving: {
    src: "/images/catalogue/interiors/interior-terracotta-living.webp",
    alt: "Illustrative rose-terracotta interior with warm plastered walls and a stone counter"
  }
} as const;

/**
 * Picks the "Applied in an interior" image for a product from its category,
 * colour-family sub-category, colours, patterns and applications — so each
 * colour family lands in a matching setting: white marble in a bright
 * feature-wall interior, grey or dark stone in a muted kitchen, green and
 * blue stones in green/blue interiors, amber onyx in a backlit bar, brown
 * marble in a dark marble bathroom, red and pink stones in a warm
 * terracotta space, beige stones in a warm living space, and stones
 * specified for exteriors in a facade context. Computed at render time, so
 * it applies to every published product without data changes.
 */
export function applicationImageForProduct(product: Pick<CatalogueProduct, "name" | "category" | "subfamily" | "colours" | "patterns" | "applications">): { src: string; alt: string } {
  const category = productCategory(product.category);
  const fallback = category ? categoryApplicationImages[category.slug] : null;
  const haystack = [product.name, product.subfamily, ...product.colours, ...product.patterns, ...product.applications].join(" ").toLowerCase();
  if (/facade|exterior|outdoor/.test(haystack)) {
    return product.category === "sandstone" ? applicationInteriorPool.sandstoneLandscape : applicationInteriorPool.facadeCladding;
  }
  const wantsBathroom = /bathroom|vanity|wet area|shower/.test(haystack);
  if (/black|dark|charcoal|noir|graphite|nero/.test(haystack)) {
    return applicationInteriorPool.mutedKitchen;
  }
  if (/green|verde|emerald|olive/.test(haystack)) {
    return applicationInteriorPool.greenBathroom;
  }
  if (/blue|azzurro|celeste/.test(haystack)) {
    return applicationInteriorPool.blueKitchen;
  }
  if (/amber|honey|miele|backlit/.test(haystack)) {
    return applicationInteriorPool.backlitBar;
  }
  if (/red|pink|rose|rosa|bordeaux|terracotta/.test(haystack)) {
    return applicationInteriorPool.terracottaLiving;
  }
  if (/white|bianco|bright|light/.test(haystack)) {
    return wantsBathroom ? applicationInteriorPool.marbleBathroom : applicationInteriorPool.whiteFeature;
  }
  if (/grey|gray|silver|smoke/.test(haystack)) {
    return applicationInteriorPool.mutedKitchen;
  }
  if (/brown|marrone|chocolate|walnut|noce|bronze/.test(haystack)) {
    return applicationInteriorPool.brownMarbleBathroom;
  }
  if (/beige|gold|cream|ivory|taupe|sand|warm/.test(haystack)) {
    return applicationInteriorPool.warmLiving;
  }
  return fallback ?? applicationInteriorPool.mutedKitchen;
}

/** Category → illustrative slab/texture used as the gallery fallback before photos are published. */export const categoryFallbackImages: Record<ProductCategorySlug, string> = {
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
  subfamily: string;
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

const productColumns = "id,slug,name,category,subfamily,summary,description,tags,origin_country,origin_region,colours,patterns,finishes,applications,attributes_verified,care_notes,seo_title,seo_description,status,published_at,updated_at";

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
