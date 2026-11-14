"use client";

import { useState, type FormEvent } from "react";
import { materials } from "@/lib/materials";
import { importedMarbleVarieties } from "@/lib/imported-marble";
import { architecturalBrands } from "@/lib/architectural-brands";
import { categorySubfamilies, productCategories } from "@/lib/products/categories";

export type EditableMediaAsset = {
  id: string;
  title: string;
  alt_text: string;
  caption: string;
  description: string;
  seo_title: string;
  seo_description: string;
  attribution: string;
  usage_rights: string;
  source_url: string;
  media_associations: { content_type: string; entity_slug: string; placement: string }[];
};

type Values = { title: string; altText: string; caption: string; description: string; seoTitle: string; seoDescription: string; attribution: string; usageRights: string; sourceUrl: string; association: string };

/**
 * Image-level metadata only. Product-level details (description, SEO copy)
 * live on the product form, so the stored values are carried through the
 * save request untouched rather than being edited in two places.
 */
export function MediaMetadataEditor({ asset, products = [], onSave }: { asset: EditableMediaAsset; products?: { slug: string; name: string }[]; onSave: (values: Values) => Promise<void> }) {
  const currentAssociation = asset.media_associations[0];
  const [values, setValues] = useState<Values>({
    title: asset.title, altText: asset.alt_text, caption: asset.caption, description: asset.description,
    seoTitle: asset.seo_title, seoDescription: asset.seo_description, attribution: asset.attribution,
    usageRights: asset.usage_rights, sourceUrl: asset.source_url,
    association: currentAssociation ? `${currentAssociation.content_type}:${currentAssociation.entity_slug}` : "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (key: keyof Values, value: string) => setValues((current) => ({ ...current, [key]: value }));
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try { await onSave(values); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Metadata could not be saved."); }
    finally { setBusy(false); }
  }
  return <details className="admin-edit-details"><summary>Edit metadata &amp; association</summary><form className="admin-field-grid admin-edit-form" onSubmit={submit}>
    <label>Image title<input value={values.title} onChange={(event) => set("title", event.target.value)} maxLength={180} /></label>
    <label>Alt text<input value={values.altText} onChange={(event) => set("altText", event.target.value)} maxLength={240} /></label>
    <label>Caption<input value={values.caption} onChange={(event) => set("caption", event.target.value)} maxLength={500} /></label>
    <label>Attribution<input value={values.attribution} onChange={(event) => set("attribution", event.target.value)} maxLength={500} /></label>
    <label>Usage rights<input value={values.usageRights} onChange={(event) => set("usageRights", event.target.value)} maxLength={1000} /></label>
    <label className="admin-field-wide">Source URL<input type="url" value={values.sourceUrl} onChange={(event) => set("sourceUrl", event.target.value)} maxLength={1000} /></label>
    <label className="admin-field-wide">Catalogue association<select value={values.association} onChange={(event) => set("association", event.target.value)}><option value="">No catalogue association</option><optgroup label="Stone categories">{productCategories.map((item) => <option key={`family:${item.slug}`} value={`family:${item.slug}`}>{item.label} (category)</option>)}</optgroup><optgroup label="Colour families">{Object.values(categorySubfamilies).flat().map((item) => <option key={`subfamily:${item.slug}`} value={`subfamily:${item.slug}`}>{item.label}</option>)}</optgroup><optgroup label="Materials">{materials.map((item) => <option key={`material:${item.slug}`} value={`material:${item.slug}`}>{item.name}</option>)}</optgroup><optgroup label="Imported marble varieties">{importedMarbleVarieties.map((item) => <option key={`marble_variety:${item.slug}`} value={`marble_variety:${item.slug}`}>{item.name}</option>)}</optgroup><optgroup label="Architectural brands">{architecturalBrands.map((item) => <option key={`brand:${item.slug}`} value={`brand:${item.slug}`}>{item.name}</option>)}</optgroup>{products.length > 0 && <optgroup label="Products">{products.map((item) => <option key={`product:${item.slug}`} value={`product:${item.slug}`}>{item.name}</option>)}</optgroup>}</select></label>
    {error && <p className="admin-error admin-field-wide" role="alert">{error}</p>}<div className="admin-edit-actions admin-field-wide"><button className="button button-outline" disabled={busy}>{busy ? "Saving…" : "Save corrections"}</button></div>
  </form></details>;
}
