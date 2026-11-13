import { redirect } from "next/navigation";
import Link from "next/link";
import { canReviewMedia } from "@/lib/media/domain";
import { requireMediaMember } from "@/lib/media/auth";
import { ProductDashboard, type ProductRow } from "./product-dashboard";
import { SignOutButton } from "../sign-out-button";

export const metadata = { title: "Products | Crystal Stones" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const { supabase, role } = await requireMediaMember();
  if (!canReviewMedia(role)) redirect("/admin");
  const { data: rows, error } = await supabase.from("catalogue_products").select("id,slug,name,category,summary,status,updated_at,published_at,tags").order("updated_at", { ascending: false }).limit(200);
  const products: ProductRow[] = (rows ?? []).map((row) => ({ ...row, updated_at: String(row.updated_at) }));
  return <div className="admin-workspace">
    <header className="admin-topbar"><Link href="/admin" className="admin-wordmark">CRYSTAL STONES <span>PRODUCT CATALOGUE</span></Link><div><span className="admin-role">{role.replace("_", " ")}</span><SignOutButton /></div></header>
    <nav className="admin-nav" aria-label="Media workspace"><Link href="/admin/library">Library</Link><Link aria-current="page" href="/admin/products">Products</Link></nav>
    <main className="admin-main">
      <div className="admin-heading"><div><p className="eyebrow">Content operations</p><h1>Products</h1><p>Create catalogue products under their stone category, add description, tags and SEO details, then publish them to the website.</p></div><Link className="button button-dark" href="/admin/products/new">New product</Link></div>
      {error && <p className="admin-error" role="alert">Could not load products: {error.message}</p>}
      <ProductDashboard initial={products} />
    </main>
  </div>;
}
