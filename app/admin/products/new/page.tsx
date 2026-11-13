import Link from "next/link";
import { redirect } from "next/navigation";
import { canReviewMedia } from "@/lib/media/domain";
import { requireMediaMember } from "@/lib/media/auth";
import { ProductForm } from "../product-form";
import { SignOutButton } from "../../sign-out-button";

export const metadata = { title: "New product | Crystal Stones" };
export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const { role } = await requireMediaMember();
  if (!canReviewMedia(role)) redirect("/admin");
  return <div className="admin-workspace">
    <header className="admin-topbar"><Link href="/admin" className="admin-wordmark">CRYSTAL STONES <span>PRODUCT CATALOGUE</span></Link><div><span className="admin-role">{role.replace("_", " ")}</span><SignOutButton /></div></header>
    <nav className="admin-nav" aria-label="Media workspace"><Link href="/admin/library">Library</Link><Link aria-current="page" href="/admin/products">Products</Link></nav>
    <main className="admin-main">
      <div className="admin-heading"><div><p className="eyebrow">Catalogue operations</p><h1>New product</h1><p>The product stays a draft until you publish it. Photos are attached from the media library after the product exists.</p></div><Link className="text-link" href="/admin/products">← All products</Link></div>
      <ProductForm />
    </main>
  </div>;
}
