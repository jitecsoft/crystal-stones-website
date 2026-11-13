"use client";

import { useState, type FormEvent } from "react";
import { materials } from "@/lib/materials";
import { importedMarbleVarieties } from "@/lib/imported-marble";
import { architecturalBrands } from "@/lib/architectural-brands";

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
    <label>SEO title<input value={values.seoTitle} onChange={(event) => set("seoTitle", event.target.value)} maxLength={180} /></label>
    <label className="admin-field-wide">Description<textarea value={values.description} onChange={(event) => set("description", event.target.value)} maxLength={3000} rows={3} /></label>
    <label className="admin-field-wide">SEO description<textarea value={values.seoDescription} onChange={(event) => set("seoDescription", event.target.value)} maxLength={320} rows={2} /></label>
    <label>Attribution<input value={values.attribution} onChange={(event) => set("attribution", event.target.value)} maxLength={500} /></label>
    <label>Usage rights<input value={values.usageRights} onChange={(event) => set("usageRights", event.target.value)} maxLength={1000} /></label>
    <label className="admin-field-wide">Source URL<input type="url" value={values.sourceUrl} onChange={(event) => set("sourceUrl", event.target.value)} maxLength={1000} /></label>
    <label className="admin-field-wide">Catalogue association<select value={values.association} onChange={(event) => set("association", event.target.value)}><option value="">No product association</option><optgroup label="Materials">{materials.map((item) => <option key={`material:${item.slug}`} value={`material:${item.slug}`}>{item.name}</option>)}</optgroup><optgroup label="Imported marble varieties">{importedMarbleVarieties.map((item) => <option key={`marble_variety:${item.slug}`} value={`marble_variety:${item.slug}`}>{item.name}</option>)}</optgroup><optgroup label="Architectural brands">{architecturalBrands.map((item) => <option key={`brand:${item.slug}`} value={`brand:${item.slug}`}>{item.name}</option>)}</optgroup>{products.length > 0 && <optgroup label="Products">{products.map((item) => <option key={`product:${item.slug}`} value={`product:${item.slug}`}>{item.name}</option>)}</optgroup>}</select></label>
    {error && <p className="admin-error admin-field-wide" role="alert">{error}</p>}<div className="admin-edit-actions admin-field-wide"><button className="button button-outline" disabled={busy}>{busy ? "Saving…" : "Save corrections"}</button></div>
  </form></details>;
}
