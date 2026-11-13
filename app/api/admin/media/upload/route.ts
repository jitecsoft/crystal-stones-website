import { createHash } from "node:crypto";
import sharp, { type Metadata } from "sharp";
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMediaMember } from "@/lib/media/auth";
import { validateMediaUpload } from "@/lib/media/domain";
import { createResponsiveWebpVariants } from "@/lib/media/image-processing";
import { isValidMediaAssociation } from "@/lib/media/catalogue";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const member = await getMediaMember();
  if (!member) return NextResponse.json({ error: "An active media team account is required." }, { status: 401 });
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 16 * 1024 * 1024) return NextResponse.json({ error: "Upload request exceeds the 16 MB limit." }, { status: 413 });

  let form: FormData;
  try { form = await request.formData(); } catch { return NextResponse.json({ error: "Choose a valid image file." }, { status: 400 }); }
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose a valid image file." }, { status: 400 });
  const fileError = validateMediaUpload(file);
  if (fileError) return NextResponse.json({ error: fileError }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const sha256 = createHash("sha256").update(buffer).digest("hex");
  let metadata: Metadata;
  try { metadata = await sharp(buffer, { failOn: "error", limitInputPixels: 100_000_000 }).metadata(); }
  catch { return NextResponse.json({ error: "This image could not be decoded safely." }, { status: 415 }); }
  const actualType = ({ jpeg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif" } as Record<string, string>)[metadata.format || ""];
  if (!actualType || actualType !== file.type) return NextResponse.json({ error: "The file content does not match its declared image type." }, { status: 415 });
  const contentType = String(form.get("contentType") || "");
  const entitySlug = String(form.get("entitySlug") || "");
  if ((contentType || entitySlug) && !(await isValidMediaAssociation(contentType, entitySlug))) return NextResponse.json({ error: "Choose a valid existing product or brand association." }, { status: 400 });

  const supabase = await createSupabaseServerClient();
  const id = crypto.randomUUID();
  const extension = ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" } as Record<string, string>)[file.type];
  const originalPath = `${member.userId}/${id}/original.${extension}`;
  const text = (name: string, max: number) => String(form.get(name) || "").trim().slice(0, max);
  const { error: insertError } = await supabase.from("media_assets").insert({
    id, original_path: originalPath, sha256, original_mime: file.type, original_bytes: file.size,
    width: metadata.width || null, height: metadata.height || null, title: text("title", 180),
    alt_text: text("altText", 240), caption: text("caption", 500), description: text("description", 3000),
    seo_title: text("seoTitle", 180), seo_description: text("seoDescription", 320),
    attribution: text("attribution", 500), usage_rights: text("usageRights", 1000), source_url: text("sourceUrl", 1000),
    created_by: member.userId, assigned_to: member.userId,
  });
  if (insertError) return NextResponse.json({ error: insertError.code === "23505" ? "This image appears to be a duplicate. Check the library before uploading again." : `Could not register the image: ${insertError.message}` }, { status: insertError.code === "23505" ? 409 : 400 });

  const fail = async (message: string) => {
    await supabase.rpc("transition_media_asset", { p_asset_id: id, p_status: "failed", p_error: message.slice(0, 500) });
    return NextResponse.json({ error: message, assetId: id }, { status: 500 });
  };
  const { error: stateError } = await supabase.rpc("transition_media_asset", { p_asset_id: id, p_status: "processing", p_error: null });
  if (stateError) return NextResponse.json({ error: `Could not start image processing: ${stateError.message}`, assetId: id }, { status: 500 });

  const { error: originalError } = await supabase.storage.from("crystal-stones-private").upload(originalPath, buffer, { contentType: file.type, upsert: false });
  if (originalError) return fail(`Could not store the private original: ${originalError.message}`);

  try {
    const generated = await Promise.all((await createResponsiveWebpVariants(buffer)).map(async ({ variant, data, width, height, size }) => {
      const path = `${member.userId}/${id}/${variant}.webp`;
      const { error } = await supabase.storage.from("crystal-stones-private").upload(path, data, { contentType: "image/webp", upsert: false });
      if (error) throw new Error(`Could not store ${variant} image: ${error.message}`);
      return { asset_id: id, variant, private_path: path, mime_type: "image/webp", byte_size: size, width, height };
    }));
    const { error: variantsError } = await supabase.from("media_variants").insert(generated);
    if (variantsError) throw new Error(`Could not save image variants: ${variantsError.message}`);
    if (contentType && entitySlug) {
      const { error: associationError } = await supabase.from("media_associations").insert({ asset_id: id, content_type: contentType, entity_slug: entitySlug, placement: "gallery" });
      if (associationError) throw new Error(`Image is processed but its catalogue association could not be saved: ${associationError.message}`);
    }
    const { error: finishError } = await supabase.rpc("transition_media_asset", { p_asset_id: id, p_status: "review_needed", p_error: null });
    if (finishError) throw new Error(`Could not complete image processing: ${finishError.message}`);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Image processing failed.");
  }
  return NextResponse.json({ ok: true, id, status: "review_needed" }, { status: 201 });
}
