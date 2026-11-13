import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig, hasSupabaseConfig } from "@/lib/supabase/config";
import { isValidMediaAssociation } from "@/lib/media/catalogue";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const contentType = request.nextUrl.searchParams.get("type") || "";
  const slug = request.nextUrl.searchParams.get("slug") || "";
  if (!await isValidMediaAssociation(contentType, slug)) return NextResponse.json({ items: [] }, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
  if (!hasSupabaseConfig()) return NextResponse.json({ items: [] }, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });

  try {
    const { url, key } = getSupabaseConfig();
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await supabase.from("published_media")
      .select("id,title,alt_text,caption,attribution,variant,public_path,width,height,placement,position")
      .eq("content_type", contentType).eq("entity_slug", slug)
      .eq("variant", "detail").order("position", { ascending: true });
    if (error) return NextResponse.json({ items: [] }, { headers: { "Cache-Control": "public, max-age=30" } });
    const items = (data ?? []).map((item) => ({
      id: item.id, title: item.title, alt: item.alt_text, caption: item.caption,
      attribution: item.attribution, variant: item.variant, width: item.width, height: item.height,
      placement: item.placement, position: item.position,
      url: supabase.storage.from("crystal-stones-published").getPublicUrl(item.public_path).data.publicUrl,
    }));
    return NextResponse.json({ items }, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
  } catch {
    return NextResponse.json({ items: [] }, { headers: { "Cache-Control": "public, max-age=30" } });
  }
}
