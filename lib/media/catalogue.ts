import { createClient } from "@supabase/supabase-js";
import { importedMarbleVarieties } from "@/lib/imported-marble";
import { materials } from "@/lib/materials";
import { architecturalBrands } from "@/lib/architectural-brands";
import { getSupabaseConfig, hasSupabaseConfig } from "@/lib/supabase/config";

const catalogueSlugs: Record<string, Set<string>> = {
  material: new Set(materials.map((item) => item.slug)),
  marble_variety: new Set(importedMarbleVarieties.map((item) => item.slug)),
  brand: new Set(architecturalBrands.map((item) => item.slug)),
};

const dynamicTypes = new Set(["product"]);

export async function isValidMediaAssociation(contentType: string, entitySlug: string) {
  if (Object.hasOwn(catalogueSlugs, contentType)) return catalogueSlugs[contentType].has(entitySlug);
  if (!dynamicTypes.has(contentType)) return false;
  if (!hasSupabaseConfig()) return false;
  try {
    const { url, key } = getSupabaseConfig();
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data } = await supabase.from("catalogue_products").select("id").eq("slug", entitySlug).maybeSingle();
    return Boolean(data);
  } catch {
    return false;
  }
}
