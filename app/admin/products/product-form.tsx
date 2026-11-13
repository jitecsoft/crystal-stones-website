"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { productCategories, slugify, subfamiliesForCategory } from "@/lib/products/db";
import { AiFill } from "@/components/AiFill";
import { ProductPhotoStager, ProductPhotoUploader, uploadProductPhoto } from "./product-photos";
import type { AiFields } from "@/lib/ai/ai-fill";

export type ProductValues = {
  name: string;
  slug: string;
  category: string;
  subfamily: string;
  summary: string;
  description: string;
  tags: string[];
  origin_country: string;
  origin_region: string;
  colours: string[];
  patterns: string[];
  finishes: string[];
  applications: string[];
  attributes_verified: boolean;
  care_notes: string;
  seo_title: string;
  seo_description: string;
};

export type ProductRecord = ProductValues & { id: string; status: string; published_at: string | null };

const toList = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 24);
const fromList = (value: string[]) => value.join(", ");

export function ProductForm({ product, galleryCount, coverUrl }: { product?: ProductRecord; galleryCount?: number; coverUrl?: string | null }) {
  const router = useRouter();
  const editing = Boolean(product);
  const [values, setValues] = useState<ProductValues>(product ?? {
    name: "", slug: "", category: "marble", subfamily: "", summary: "", description: "", tags: [],
    origin_country: "", origin_region: "", colours: [], patterns: [], finishes: [], applications: [],
    attributes_verified: false, care_notes: "", seo_title: "", seo_description: "",
  });
  const [slugLocked, setSlugLocked] = useState(editing);
  const [status, setStatus] = useState(product?.status ?? "draft");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [staged, setStaged] = useState<File[]>([]);
  const set = <K extends keyof ProductValues>(key: K, value: ProductValues[K]) => setValues((current) => ({ ...current, [key]: value }));

  function setName(name: string) {
    setValues((current) => ({ ...current, name, slug: slugLocked ? current.slug : slugify(name) }));
  }

  async function send(action: "create" | "save" | "publish" | "unpublish" | "delete") {
    setBusy(true); setError(""); setMessage("");
    try {
      if (action === "delete") {
        if (!product || !window.confirm(`Delete “${product.name}” permanently?`)) { setBusy(false); return; }
        const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || "Delete failed.");
        router.push("/admin/products"); router.refresh(); return;
      }
      const payload = action === "create" ? { ...values } : { action: action === "save" ? "save" : action, ...values };
      const response = await fetch(action === "create" ? "/api/admin/products" : `/api/admin/products/${product!.id}`, {
        method: action === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Save failed.");
      if (action === "create") {
        const failures: string[] = [];
        for (const [index, file] of staged.entries()) {
          setMessage(`Uploading photo ${index + 1} of ${staged.length}…`);
          try { await uploadProductPhoto(file, values.slug, values.name); }
          catch (cause) { failures.push(cause instanceof Error ? cause.message : `Could not upload ${file.name}.`); }
        }
        if (failures.length) setError(failures.join(" "));
        router.push(`/admin/products/${result.id}`); router.refresh(); return;
      }
      setStatus(result.status);
      setMessage(action === "publish" ? "Published — the product page is now live." : action === "unpublish" ? "Unpublished — kept as a draft." : "Saved.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Save failed."); }
    finally { setBusy(false); }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); send(editing ? "save" : "create"); }

  const applyAi = (fields: AiFields) => {
    const nextName = fields.title ?? values.name;
    setValues((current) => ({
      ...current,
      name: nextName,
      slug: slugLocked ? current.slug : slugify(nextName),
      summary: fields.summary ?? current.summary,
      description: fields.description ?? current.description,
      tags: fields.tags ?? current.tags,
      origin_country: fields.origin_country ?? current.origin_country,
      origin_region: fields.origin_region ?? current.origin_region,
      colours: fields.colours ?? current.colours,
      patterns: fields.patterns ?? current.patterns,
      finishes: fields.finishes ?? current.finishes,
      applications: fields.applications ?? current.applications,
      care_notes: fields.care_notes ?? current.care_notes,
      seo_title: fields.seo_title ?? current.seo_title,
      seo_description: fields.seo_description ?? current.seo_description,
      category: fields.category ?? current.category,
      subfamily: fields.subfamily && subfamiliesForCategory(fields.category ?? current.category).some((sub) => sub.slug === fields.subfamily) ? fields.subfamily : current.subfamily
    }));
  };

  return <form className="admin-field-grid admin-product-form" onSubmit={onSubmit}>
    <div className="admin-field-wide">
      <AiFill mode="product" imageUrl={coverUrl ?? null} name={values.name} description={values.summary} onFill={applyAi} />
    </div>
    {product
      ? <ProductPhotoUploader slug={product.slug} name={product.name} coverUrl={coverUrl} galleryCount={galleryCount ?? 0} />
      : <ProductPhotoStager files={staged} onChange={setStaged} />}
    <label>Name<input value={values.name} onChange={(event) => setName(event.target.value)} maxLength={180} required /></label>
    <label>URL slug<small>/{values.slug || "your-product"}/ · {slugLocked ? "locked" : "auto-set from the name"}</small>
      <input value={values.slug} onChange={(event) => { setSlugLocked(true); set("slug", slugify(event.target.value)); }} maxLength={120} required /></label>
    <label>Category<select value={values.category} onChange={(event) => { const category = event.target.value; setValues((current) => ({ ...current, category, subfamily: subfamiliesForCategory(category).some((sub) => sub.slug === current.subfamily) ? current.subfamily : "" })); }}>{productCategories.map((category) => <option key={category.slug} value={category.slug}>{category.label}</option>)}</select></label>
    <label>Sub-family<small>Colour family within the category (optional)</small><select value={values.subfamily} onChange={(event) => set("subfamily", event.target.value)}><option value="">None</option>{subfamiliesForCategory(values.category).map((sub) => <option key={sub.slug} value={sub.slug}>{sub.label}</option>)}</select></label>
    <label className="admin-field-wide">Short summary<small>Shown on listing cards and as the fallback meta description.</small><input value={values.summary} onChange={(event) => set("summary", event.target.value)} maxLength={500} /></label>
    <label className="admin-field-wide">Description<textarea value={values.description} onChange={(event) => set("description", event.target.value)} maxLength={8000} rows={6} /></label>
    <label className="admin-field-wide">Tags<small>Comma-separated, e.g. beige, veined, kitchen</small><input value={fromList(values.tags)} onChange={(event) => set("tags", toList(event.target.value))} /></label>
    <label>Origin country<input value={values.origin_country} onChange={(event) => set("origin_country", event.target.value)} maxLength={120} /></label>
    <label>Origin region / quarry<input value={values.origin_region} onChange={(event) => set("origin_region", event.target.value)} maxLength={120} /></label>
    <label>Colours<small>Comma-separated</small><input value={fromList(values.colours)} onChange={(event) => set("colours", toList(event.target.value))} /></label>
    <label>Patterns<small>Comma-separated</small><input value={fromList(values.patterns)} onChange={(event) => set("patterns", toList(event.target.value))} /></label>
    <label>Finishes<small>Comma-separated</small><input value={fromList(values.finishes)} onChange={(event) => set("finishes", toList(event.target.value))} /></label>
    <label>Applications<small>Comma-separated</small><input value={fromList(values.applications)} onChange={(event) => set("applications", toList(event.target.value))} /></label>
    <label className="admin-field-wide admin-check"><input type="checkbox" checked={values.attributes_verified} onChange={(event) => set("attributes_verified", event.target.checked)} /> Attributes (origin, family, colours) verified against supplier documents</label>
    <label className="admin-field-wide">Care notes<textarea value={values.care_notes} onChange={(event) => set("care_notes", event.target.value)} maxLength={2000} rows={3} /></label>
    <label>SEO title<small>{values.seo_title.length}/180 · defaults to the product name</small><input value={values.seo_title} onChange={(event) => set("seo_title", event.target.value)} maxLength={180} /></label>
    <label>SEO meta description<small>{values.seo_description.length}/320 · defaults to the summary</small><textarea value={values.seo_description} onChange={(event) => set("seo_description", event.target.value)} maxLength={320} rows={2} /></label>

    {editing && <div className="admin-field-wide admin-product-form__hint">
      <strong>Photos on this product page:</strong> {galleryCount ? `${galleryCount} published image${galleryCount === 1 ? "" : "s"}` : "none published yet"}.{" "}
      Upload in the <Link href="/admin/library">Library</Link>, then edit that image and choose this product under “Catalogue association”.
    </div>}

    {error && <p className="admin-error admin-field-wide" role="alert">{error}</p>}
    {message && <p className="admin-success admin-field-wide" role="status">{message}</p>}
    <div className="admin-edit-actions admin-field-wide">
      <button className="button button-dark" disabled={busy}>{busy ? "Working…" : editing ? "Save changes" : "Create product"}</button>
      {editing && status === "draft" && <button type="button" className="button button-outline" disabled={busy} onClick={() => send("publish")}>Publish</button>}
      {editing && status === "published" && <button type="button" className="button button-outline" disabled={busy} onClick={() => send("unpublish")}>Unpublish</button>}
      {editing && <button type="button" className="admin-product__delete" disabled={busy} onClick={() => send("delete")}>Delete</button>}
    </div>
  </form>;
}
