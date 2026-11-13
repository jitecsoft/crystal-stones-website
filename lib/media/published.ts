import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig, hasSupabaseConfig } from "@/lib/supabase/config";
import { subfamiliesForCategory } from "@/lib/products/categories";

/**
 * Published photos associated with a stone *category* (content type "family",
 * e.g. every photo tagged simply "Granite"). Read with the publishable key so
 * row-level security only ever exposes published images on the public site.
 */

export type PublishedCategoryImage = {
  id: string;
  url: string;
  alt: string;
  caption: string;
  attribution: string;
  width: number;
  height: number;
};

export async function getPublishedCategoryMedia(category: string, limit = 12): Promise<PublishedCategoryImage[]> {
  if (!hasSupabaseConfig()) return [];
  try {
    const { url, key } = getSupabaseConfig();
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data } = await supabase
      .from("published_media")
      .select("id,title,alt_text,caption,attribution,public_path,width,height,position")
      .eq("content_type", "family")
      .eq("entity_slug", category)
      .eq("variant", "detail")
      .order("position", { ascending: true })
      .limit(limit);
    return (data ?? []).map((item) => ({
      id: item.id,
      url: supabase.storage.from("crystal-stones-published").getPublicUrl(item.public_path).data.publicUrl,
      alt: item.alt_text || item.title || "",
      caption: item.caption || "",
      attribution: item.attribution || "",
      width: item.width,
      height: item.height
    }));
  } catch {
    return [];
  }
}

export type PublishedCategoryPhotos = {
  general: PublishedCategoryImage[];
  groups: { slug: string; label: string; images: PublishedCategoryImage[] }[];
};

/**
 * Every published photo for a stone category: photos tagged with the category
 * itself plus photos tagged with one of its colour-family sub-categories.
 */
export async function getPublishedCategoryPhotos(category: string): Promise<PublishedCategoryPhotos> {
  if (!hasSupabaseConfig()) return { general: [], groups: [] };
  try {
    const { url, key } = getSupabaseConfig();
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data } = await supabase
      .from("published_media")
      .select("id,title,alt_text,caption,attribution,public_path,width,height,position,entity_slug")
      .eq("content_type", "subfamily")
      .like("entity_slug", `${category}-%`)
      .eq("variant", "detail")
      .order("position", { ascending: true })
      .limit(48);
    const toImage = (item: Record<string, unknown>) => ({
      id: item.id as string,
      url: supabase.storage.from("crystal-stones-published").getPublicUrl(item.public_path as string).data.publicUrl,
      alt: (item.alt_text as string) || (item.title as string) || "",
      caption: (item.caption as string) || "",
      attribution: (item.attribution as string) || "",
      width: item.width as number,
      height: item.height as number
    });
    const subfamilyImages = (data ?? []).map((item) => ({ slug: item.entity_slug as string, image: toImage(item) }));
    const [general, groupDefs] = await Promise.all([
      getPublishedCategoryMedia(category),
      Promise.resolve(subfamiliesForCategory(category))
    ]);
    return {
      general,
      groups: groupDefs
        .map((sub) => ({ slug: sub.slug, label: sub.label, images: subfamilyImages.filter((row) => row.slug === sub.slug).map((row) => row.image) }))
        .filter((group) => group.images.length > 0)
    };
  } catch {
    return { general: [], groups: [] };
  }
}
