"use client";

import { useMemo, useState, type ChangeEvent, type DragEvent } from "react";
import { ALLOWED_MEDIA_TYPES, MAX_MEDIA_BYTES, canReviewMedia } from "@/lib/media/domain";
import { materials } from "@/lib/materials";
import { importedMarbleVarieties } from "@/lib/imported-marble";
import { architecturalBrands } from "@/lib/architectural-brands";
import Image from "next/image";
import { MediaMetadataEditor, type EditableMediaAsset } from "./MediaMetadataEditor";

type Asset = EditableMediaAsset & { status: string; error_message: string | null; created_at: string; original_mime: string; original_bytes: number; width: number | null; height: number | null; created_by: string; assigned_to: string | null; previewUrl?: string };

export function MediaLibrary({ assets: initial, role }: { assets: Asset[]; role: string }) {
  const [assets, setAssets] = useState(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [association, setAssociation] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState({ title: "", altText: "", caption: "", description: "", seoTitle: "", seoDescription: "", attribution: "", usageRights: "", sourceUrl: "" });
  const editor = canReviewMedia(role);
  const filtered = useMemo(() => assets.filter((asset) => (statusFilter === "all" || asset.status === statusFilter) && `${asset.title} ${asset.alt_text}`.toLowerCase().includes(search.toLowerCase())), [assets, search, statusFilter]);

  function choose(event: ChangeEvent<HTMLInputElement>) { setFiles((current) => [...current, ...Array.from(event.target.files ?? [])]); event.target.value = ""; }
  function drop(event: DragEvent<HTMLLabelElement>) { event.preventDefault(); setFiles((current) => [...current, ...Array.from(event.dataTransfer.files)]); }
  function update(name: keyof typeof form, value: string) { setForm((current) => ({ ...current, [name]: value })); }

  async function upload() {
    const invalid = files.find((file) => !ALLOWED_MEDIA_TYPES.has(file.type) || file.size > MAX_MEDIA_BYTES || file.size === 0);
    if (invalid) { setError(`${invalid.name}: use JPEG, PNG, WebP or AVIF up to 15 MB.`); return; }
    setBusy(true); setError(""); setMessage("");
    let completed = 0;
    for (const file of files) {
      const body = new FormData(); body.set("file", file);
      for (const [key, value] of Object.entries(form)) body.set(key, value);
      if (association) { body.set("contentType", association.split(":")[0]); body.set("entitySlug", association.split(":")[1]); }
      let response: Response;
      try { response = await fetch("/api/admin/media/upload", { method: "POST", body }); }
      catch { setError(`${file.name}: Network error. Check your connection and retry the remaining image batch.`); break; }
      const result = await response.json().catch(() => ({}));
      if (!response.ok) { setError(`${file.name}: ${result.error || "Upload failed."}`); break; }
      completed += 1;
      setMessage(`Processed ${completed} of ${files.length} image${files.length === 1 ? "" : "s"}…`);
    }
    const remaining = files.slice(completed);
    setFiles(remaining); setBusy(false);
    if (completed && remaining.length === 0) { setMessage(`${completed} image${completed === 1 ? "" : "s"} sent to editorial review.`); window.location.reload(); }
    else if (completed) setMessage(`${completed} image${completed === 1 ? " was" : "s were"} processed. ${remaining.length} remain selected; correct the issue above and retry.`);
  }

  async function action(asset: Asset, action: "approve" | "publish" | "retry") {
    setError(""); setBusy(true);
    try {
      const response = await fetch(`/api/admin/media/${asset.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Action failed.");
      setAssets((current) => current.map((item) => item.id === asset.id ? { ...item, status: result.status, error_message: null } : item));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Action failed."); }
    finally { setBusy(false); }
  }

  async function saveMetadata(asset: Asset, values: { title: string; altText: string; caption: string; description: string; seoTitle: string; seoDescription: string; attribution: string; usageRights: string; sourceUrl: string; association: string }) {
    const [contentType = "", entitySlug = ""] = values.association.split(":");
    const response = await fetch(`/api/admin/media/${asset.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "save", ...values, contentType, entitySlug }) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Metadata could not be saved.");
    const association = contentType && entitySlug ? [{ content_type: contentType, entity_slug: entitySlug, placement: "gallery" }] : [];
    setAssets((current) => current.map((item) => item.id === asset.id ? { ...item, title: values.title, alt_text: values.altText, caption: values.caption, description: values.description, seo_title: values.seoTitle, seo_description: values.seoDescription, attribution: values.attribution, usage_rights: values.usageRights, source_url: values.sourceUrl, media_associations: association } : item));
  }

  return <>
    <section className="admin-upload"><div className="admin-section-heading"><div><h2>Bulk upload</h2><p>Files are checked, retained privately and converted to responsive WebP previews.</p></div><span>15 MB per file</span></div>
      <label className="admin-dropzone" onDragOver={(event) => event.preventDefault()} onDrop={drop}><span className="admin-dropzone-icon">＋</span><strong>Drop images here or browse</strong><span>JPEG, PNG, WebP or AVIF · maximum 15 MB each</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={choose} /></label>
      {!!files.length && <div className="admin-filelist"><strong>{files.length} selected</strong>{files.map((file, i) => <div key={`${file.name}-${i}`}><span>{file.name}</span><span>{(file.size / 1024 / 1024).toFixed(1)} MB</span><button aria-label={`Remove ${file.name}`} onClick={() => setFiles((current) => current.filter((_, index) => index !== i))}>Remove</button></div>)}</div>}
      <div className="admin-metadata"><p className="eyebrow">Shared metadata for this batch</p><div className="admin-field-grid"><label>Image title<input value={form.title} onChange={(e) => update("title", e.target.value)} maxLength={180} /></label><label>Alt text<input value={form.altText} onChange={(e) => update("altText", e.target.value)} maxLength={240} /></label><label>Caption<input value={form.caption} onChange={(e) => update("caption", e.target.value)} maxLength={500} /></label><label>SEO title<input value={form.seoTitle} onChange={(e) => update("seoTitle", e.target.value)} maxLength={180} /></label><label className="admin-field-wide">Description<textarea value={form.description} onChange={(e) => update("description", e.target.value)} maxLength={3000} rows={3} /></label><label className="admin-field-wide">SEO description<textarea value={form.seoDescription} onChange={(e) => update("seoDescription", e.target.value)} maxLength={320} rows={2} /></label><label>Image attribution<input value={form.attribution} onChange={(e) => update("attribution", e.target.value)} maxLength={500} /></label><label>Usage rights<input value={form.usageRights} onChange={(e) => update("usageRights", e.target.value)} maxLength={1000} /></label><label className="admin-field-wide">Source URL<input type="url" value={form.sourceUrl} onChange={(e) => update("sourceUrl", e.target.value)} maxLength={1000} /></label><label className="admin-field-wide">Associate with catalogue item<select value={association} onChange={(e) => setAssociation(e.target.value)}><option value="">No product association</option><optgroup label="Materials">{materials.map((item) => <option key={`material:${item.slug}`} value={`material:${item.slug}`}>{item.name}</option>)}</optgroup><optgroup label="Imported marble varieties">{importedMarbleVarieties.map((item) => <option key={`marble_variety:${item.slug}`} value={`marble_variety:${item.slug}`}>{item.name}</option>)}</optgroup><optgroup label="Architectural brands">{architecturalBrands.map((item) => <option key={`brand:${item.slug}`} value={`brand:${item.slug}`}>{item.name}</option>)}</optgroup></select></label></div><p className="admin-help">Metadata stays editable and unpublished until review. AI suggestions are not configured; enter and verify content manually.</p>{!editor && <p className="admin-help">Your uploader role can add files. An editor will associate and publish content.</p>}<button className="button button-dark" disabled={busy || !files.length} onClick={upload}>{busy ? "Working…" : `Upload ${files.length || "selected"} image${files.length === 1 ? "" : "s"}`}</button></div>
    </section>
    {error && <p className="admin-error" role="alert">{error}</p>}{message && <p className="admin-success" role="status">{message}</p>}
    <section className="admin-library"><div className="admin-section-heading"><div><h2>Recent media</h2><p>Private uploads remain inaccessible on the public site until an editor publishes them.</p></div></div><div className="admin-filters"><label>Search<input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Title or alt text" /></label><label>Status<select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="all">All statuses</option>{["uploaded", "processing", "review_needed", "approved", "published", "failed"].map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}</select></label></div>
    {!filtered.length ? <div className="admin-empty">{assets.length ? "No media matches these filters." : "Your library is ready for its first image batch."}</div> : <div className="admin-assets">{filtered.map((asset) => <article className="admin-asset" key={asset.id}><div className="admin-asset-image">{asset.previewUrl ? <Image src={asset.previewUrl} alt="" width={320} height={240} unoptimized /> : <span>Private image</span>}</div><div className="admin-asset-content"><div className="admin-asset-title"><h3>{asset.title || "Untitled image"}</h3><span className={`admin-status admin-status--${asset.status}`}>{asset.status.replace("_", " ")}</span></div><p>{asset.alt_text || "Alt text not added"}</p><small>{asset.width && asset.height ? `${asset.width} × ${asset.height} · ` : ""}{(asset.original_bytes / 1024 / 1024).toFixed(1)} MB · {new Date(asset.created_at).toLocaleDateString()}</small>{asset.error_message && <p className="admin-asset-error">{asset.error_message}</p>}<div className="admin-asset-actions">{editor && asset.status === "review_needed" && <button className="button button-outline" disabled={busy} onClick={() => action(asset, "approve")}>Approve</button>}{editor && asset.status === "approved" && <button className="button button-dark" disabled={busy} onClick={() => action(asset, "publish")}>Publish</button>}{asset.status === "failed" && (editor || role === "uploader") && <button className="button button-outline" disabled={busy} onClick={() => action(asset, "retry")}>Retry processing</button>}</div>{editor && <MediaMetadataEditor asset={asset} onSave={(values) => saveMetadata(asset, values)} />}</div></article>)}</div>}</section>
  </>;
}
