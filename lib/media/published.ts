import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig, hasSupabaseConfig } from "@/lib/supabase/config";

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
