import { z } from "zod";
import { materials } from "@/lib/materials";
import { productCategorySlugs } from "@/lib/products/db";

const stringList = z.array(z.string().trim().min(1).max(80)).max(24);

export const productSaveSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(180),
  slug: z.string().trim().max(120).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug may use lowercase letters, numbers and single dashes."),
  category: z.string().refine((value): value is typeof productCategorySlugs[number] => (productCategorySlugs as readonly string[]).includes(value), "Choose a valid category."),
  summary: z.string().max(500),
  description: z.string().max(8000),
  tags: stringList,
  origin_country: z.string().max(120),
  origin_region: z.string().max(120),
  colours: stringList,
  patterns: stringList,
  finishes: stringList,
  applications: stringList,
  attributes_verified: z.boolean(),
  care_notes: z.string().max(2000),
  seo_title: z.string().max(180),
  seo_description: z.string().max(320),
});

const staticMaterialSlugs = new Set(materials.map((material) => material.slug));

/** Returns a friendly message when the slug cannot be used, otherwise null. */
export function slugConflictMessage(slug: string) {
  if (!slug) return "Slug is required.";
  if (staticMaterialSlugs.has(slug)) return "This slug is already used by a starter catalogue page. Choose another.";
  return null;
}
