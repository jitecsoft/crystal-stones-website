/**
 * Maps a media/product placement to the public page where it appears, so the
 * admin workspace can offer "view where it is placed" preview links.
 * Client-safe: only imports static data, never Supabase.
 */
import { categorySubfamilies, productCategoryHref } from "@/lib/products/categories";

/** Sub-families have no standalone page; they are groups on the category page. */
export function productSubfamilyHref(subfamilySlug: string) {
  for (const [category, subs] of Object.entries(categorySubfamilies)) {
    if (subs.some((sub) => sub.slug === subfamilySlug)) return productCategoryHref(category);
  }
  return null;
}

export function placementHref(contentType: string, entitySlug: string): string | null {
  switch (contentType) {
    case "family": return productCategoryHref(entitySlug);
    case "subfamily": return productSubfamilyHref(entitySlug);
    case "material":
    case "product": return `/material/${entitySlug}/`;
    case "marble_variety": return `/marble/variety/${entitySlug}/`;
    case "brand": return `/architectural-surfaces/brands/${entitySlug}/`;
    default: return null;
  }
}
