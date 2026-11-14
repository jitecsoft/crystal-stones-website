import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { canReviewMedia } from "@/lib/media/domain";
import { requireMediaMember } from "@/lib/media/auth";
import { ProductForm, type ProductRecord } from "../product-form";
import { getProductCoverUrl } from "@/lib/products/db";
import { SignOutButton } from "../../sign-out-button";

export const metadata = { title: "Edit product | Crystal Stones" };
export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase, role } = await requireMediaMember();
  if (!canReviewMedia(role)) redirect("/admin");
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data: product } = await supabase.from("catalogue_products").select("id,slug,name,category,subfamily,summary,description,tags,origin_country,origin_region,colours,patterns,finishes,applications,attributes_verified,care_notes,seo_title,seo_description,status,published_at").eq("id", id).maybeSingle();
  if (!product) notFound();
  const { count: galleryCount } = await supabase.from("media_associations").select("id", { count: "exact", head: true }).eq("content_type", "product").eq("entity_slug", product.slug);
  return <div className="admin-workspace">
    <header className="admin-topbar"><Link href="/admin" className="admin-wordmark">CRYSTAL STONES <span>PRODUCT CATALOGUE</span></Link><div><span className="admin-role">{role.replace("_", " ")}</span><SignOutButton /></div></header>
    <nav className="admin-nav" aria-label="Media workspace"><Link href="/admin/library">Image Library</Link><Link aria-current="page" href="/admin/products">Products</Link></nav>
    <main className="admin-main">
      <div className="admin-heading"><div><p className="eyebrow">{product.status === "published" ? `Published · /material/${product.slug}/` : "Draft"}</p><h1>{product.name}</h1><p>Editing a published product updates the live page immediately after you save.</p></div><Link className="text-link" href="/admin/products">← All products</Link></div>
      <ProductForm product={product as ProductRecord} galleryCount={galleryCount ?? 0} coverUrl={await getProductCoverUrl(product.slug)} />
    </main>
  </div>;
}
