import { requireMediaMember } from "@/lib/media/auth";
import { MediaLibrary } from "../media-library";
import { SignOutButton } from "../sign-out-button";
import Link from "next/link";
export const metadata = { title: "Media library | Crystal Stones" };
export const dynamic = "force-dynamic";

export default async function AdminLibraryPage() {
  const { supabase, role } = await requireMediaMember();
  const { data: rows, error } = await supabase.from("media_assets").select("id,title,alt_text,caption,description,seo_title,seo_description,attribution,usage_rights,source_url,status,error_message,created_at,original_mime,original_bytes,width,height,created_by,assigned_to,media_associations(content_type,entity_slug,placement),media_variants(variant,private_path)").order("created_at", { ascending: false }).limit(100);
  const { data: productRows } = await supabase.from("catalogue_products").select("slug,name").order("name");
  const products = (productRows ?? []).map((item) => ({ slug: item.slug, name: item.name }));
  const assets = await Promise.all((rows ?? []).map(async (asset) => {
    const preview = asset.media_variants.find((variant) => variant.variant === "thumbnail") ?? asset.media_variants[0];
    if (!preview) return { ...asset, previewUrl: undefined };
    const { data } = await supabase.storage.from("crystal-stones-private").createSignedUrl(preview.private_path, 15 * 60);
    return { ...asset, previewUrl: data?.signedUrl };
  }));
  return <div className="admin-workspace"><header className="admin-topbar"><Link href="/admin/library" className="admin-wordmark">CRYSTAL STONES <span>MEDIA LIBRARY</span></Link><div><span className="admin-role">{role.replace("_", " ")}</span><SignOutButton /></div></header><nav className="admin-nav" aria-label="Media workspace"><Link aria-current="page" href="/admin/library">Library</Link><Link href="/admin/products">Products</Link></nav><main className="admin-main"><div className="admin-heading"><div><p className="eyebrow">Content operations</p><h1>Media library</h1><p>Upload images in batches, document their usage rights, and review them before publication.</p></div><span className="admin-count">{assets.length} recent assets</span></div>{error && <p className="admin-error" role="alert">Could not load media records: {error.message}</p>}<MediaLibrary assets={assets} products={products} role={role} /></main></div>;
}
