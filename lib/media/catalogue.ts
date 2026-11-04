import { importedMarbleVarieties } from "@/lib/imported-marble";
import { materials } from "@/lib/materials";
import { architecturalBrands } from "@/lib/architectural-brands";

const catalogueSlugs: Record<string, Set<string>> = {
  material: new Set(materials.map((item) => item.slug)),
  marble_variety: new Set(importedMarbleVarieties.map((item) => item.slug)),
  brand: new Set(architecturalBrands.map((item) => item.slug)),
};

export function isValidMediaAssociation(contentType: string, entitySlug: string) {
  return Object.hasOwn(catalogueSlugs, contentType) && catalogueSlugs[contentType].has(entitySlug);
}
