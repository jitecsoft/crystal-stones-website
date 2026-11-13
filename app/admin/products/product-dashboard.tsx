"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { productCategories, productCategoryLabel } from "@/lib/products/db";

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  summary: string;
  status: string;
  updated_at: string;
  published_at: string | null;
  tags: string[];
};

export function ProductDashboard({ initial }: { initial: ProductRow[] }) {
  const [products, setProducts] = useState(initial);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => products.filter((product) =>
    (statusFilter === "all" || product.status === statusFilter)
    && (categoryFilter === "all" || product.category === categoryFilter)
    && `${product.name} ${product.slug} ${product.tags.join(" ")}`.toLowerCase().includes(search.toLowerCase())
  ), [products, statusFilter, categoryFilter, search]);

  async function setStatus(product: ProductRow, status: "published" | "draft") {
    setBusyId(product.id); setError(""); setMessage("");
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: status === "published" ? "publish" : "unpublish" }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Action failed.");
      setProducts((current) => current.map((item) => item.id === product.id ? { ...item, status: result.status, published_at: result.published_at ?? item.published_at } : item));
      setMessage(status === "published" ? `${product.name} is now live at /material/${product.slug}/` : `${product.name} removed from the website (kept as draft).`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Action failed."); }
    finally { setBusyId(null); }
  }

  async function remove(product: ProductRow) {
    if (!window.confirm(`Delete “${product.name}” permanently? Any published photos stay in the media library.`)) return;
    setBusyId(product.id); setError(""); setMessage("");
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Delete failed.");
      setProducts((current) => current.filter((item) => item.id !== product.id));
      setMessage(`${product.name} deleted.`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Delete failed."); }
    finally { setBusyId(null); }
  }

  return <>
    {error && <p className="admin-error" role="alert">{error}</p>}
    {message && <p className="admin-success" role="status">{message}</p>}
    <section className="admin-library">
      <div className="admin-section-heading"><div><h2>Catalogue</h2><p>Published products appear on their category page and at /material/&lt;slug&gt;/ with their own gallery and SEO setup.</p></div></div>
      <div className="admin-filters">
        <label>Search<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, slug or tag" /></label>
        <label>Category<select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="all">All categories</option>{productCategories.map((category) => <option key={category.slug} value={category.slug}>{category.label}</option>)}</select></label>
        <label>Status<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All statuses</option><option value="draft">Draft</option><option value="published">Published</option></select></label>
      </div>
      {!filtered.length ? <div className="admin-empty">{products.length ? "No products match these filters." : "No products yet. Use “New product” to add the first catalogue entry."}</div> : (
        <div className="admin-product-list">
          {filtered.map((product) => (
            <article className="admin-product" key={product.id}>
              <div className="admin-product__main">
                <div className="admin-product__title"><h3>{product.name}</h3><span className={`admin-status admin-status--${product.status === "published" ? "published" : "review_needed"}`}>{product.status}</span></div>
                <p className="admin-product__meta">/{product.slug}/ · {productCategoryLabel(product.category)} · updated {new Date(product.updated_at).toLocaleDateString()}</p>
                {product.summary && <p className="admin-product__summary">{product.summary}</p>}
              </div>
              <div className="admin-product__actions">
                <Link className="button button-outline" href={`/admin/products/${product.id}`}>Edit</Link>
                {product.status === "draft"
                  ? <button className="button button-dark" disabled={busyId === product.id} onClick={() => setStatus(product, "published")}>{busyId === product.id ? "Working…" : "Publish"}</button>
                  : <button className="button button-outline" disabled={busyId === product.id} onClick={() => setStatus(product, "draft")}>Unpublish</button>}
                <button className="admin-product__delete" disabled={busyId === product.id} onClick={() => remove(product)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  </>;
}
