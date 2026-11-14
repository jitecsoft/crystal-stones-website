"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent } from "react";

const ACCEPT = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES = 16 * 1024 * 1024;

function sizeLabel(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

function validate(file: File) {
  if (!ACCEPT.includes(file.type)) return `${file.name}: use a JPG, PNG, WebP or AVIF image.`;
  if (file.size > MAX_BYTES) return `${file.name}: file is larger than the 16 MB limit.`;
  return null;
}

/** Uploads one file into the media library and attaches it to the product.
 *  Resolves with the processing note (e.g. "cropped to the stone"). */
export async function uploadProductPhoto(file: File, slug: string, title: string): Promise<string> {
  const problem = validate(file);
  if (problem) throw new Error(problem);
  const data = new FormData();
  data.append("file", file);
  data.append("contentType", "product");
  data.append("entitySlug", slug);
  if (title) data.append("title", title);
  const response = await fetch("/api/admin/media/upload", { method: "POST", body: data });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || `Could not upload ${file.name}.`);
  return typeof result.note === "string" ? result.note : "";
}

/** New-product page: holds chosen files and attaches them right after the product is created. */
export function ProductPhotoStager({ files, onChange }: { files: File[]; onChange: (files: File[]) => void }) {
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function add(selected: FileList | null) {
    if (!selected?.length) return;
    const next = [...files, ...Array.from(selected)];
    const problems = next.map(validate).filter(Boolean) as string[];
    setError(problems[0] ?? "");
    onChange(problems.length ? files : next);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="admin-field-wide admin-upload">
      <div>
        <strong>Product photos</strong>
        <small>Attached to the product as soon as it is created. Every upload is auto-sized for the website (thumbnail, card and detail WebP versions).</small>
      </div>
      <input ref={inputRef} type="file" multiple accept={ACCEPT.join(",")} onChange={(event) => add(event.target.files)} />
      {error && <span className="admin-upload__problem" role="alert">{error}</span>}
      {files.length > 0 && (
        <ul className="admin-upload__list">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`}>
              <span>{file.name} <small>{sizeLabel(file.size)}</small></span>
              <button type="button" aria-label={`Remove ${file.name}`} onClick={() => onChange(files.filter((_, position) => position !== index))}>×</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Edit page: uploads straight into the library and attaches to this product. */
export function ProductPhotoUploader({ slug, name, coverUrl, galleryCount }: { slug: string; name: string; coverUrl?: string | null; galleryCount: number }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    if (inputRef.current) inputRef.current.value = "";
    if (!selected.length) return;
    const problems = selected.map(validate).filter(Boolean) as string[];
    if (problems.length) { setError(problems.join(" ")); return; }
    setBusy(true); setError(""); setDone("");
    const failures: string[] = [];
    const notes: string[] = [];
    for (const [index, file] of selected.entries()) {
      setProgress(selected.length > 1 ? `Uploading ${index + 1} of ${selected.length}…` : "Uploading — the stone area is detected and the image is cropped and enhanced…");
      try { notes.push(await uploadProductPhoto(file, slug, name)); }
      catch (cause) { failures.push(cause instanceof Error ? cause.message : `Could not upload ${file.name}.`); }
    }
    setBusy(false); setProgress("");
    if (failures.length) setError(failures.join(" "));
    const uniqueNotes = [...new Set(notes.filter(Boolean))];
    if (uniqueNotes.length) setDone(uniqueNotes.join(" · "));
    router.refresh();
  }

  return (
    <div className="admin-field-wide admin-upload">
      <div>
        <strong>Product photos</strong>
        <small>Uploads go through the same processing as the library: three auto-sized WebP versions are generated and the image is attached to this product.</small>
      </div>
      {coverUrl && (
        <div className="admin-upload__preview">
          <Image src={coverUrl} alt="" width={72} height={72} unoptimized style={{ objectFit: "cover" }} />
          <span>{galleryCount} photo{galleryCount === 1 ? "" : "s"} attached{galleryCount > 0 ? " · first photo is the cover" : ""}</span>
        </div>
      )}
      {!coverUrl && <span>{galleryCount} photo{galleryCount === 1 ? "" : "s"} attached</span>}
      <input ref={inputRef} type="file" multiple accept={ACCEPT.join(",")} onChange={handleFiles} disabled={busy} />
      {busy && <span className="admin-upload__busy">{progress}</span>}
      {done && <span className="admin-upload__busy">{done}</span>}
      {error && <span className="admin-upload__problem" role="alert">{error}</span>}
    </div>
  );
}
