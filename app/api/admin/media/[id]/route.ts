import { NextResponse, type NextRequest } from "next/server";
import { getMediaMember } from "@/lib/media/auth";
import { canManageOwnMedia, canReviewMedia } from "@/lib/media/domain";
import { createResponsiveWebpVariants } from "@/lib/media/image-processing";
import { isValidMediaAssociation } from "@/lib/media/catalogue";
import { z } from "zod";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const member = await getMediaMember();
  if (!member) return NextResponse.json({ error: "An active media team account is required." }, { status: 401 });
  const { id } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Invalid media ID." }, { status: 400 });
  let body: { action?: unknown; [key: string]: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const action = body.action;
  const { data: asset, error: assetError } = await member.supabase.from("media_assets").select("id,status,created_by,assigned_to,original_path").eq("id", id).maybeSingle();
  if (assetError || !asset) return NextResponse.json({ error: "Media item was not found." }, { status: 404 });

  if (action === "save") {
    if (!canReviewMedia(member.role)) return NextResponse.json({ error: "Only editors can correct media metadata." }, { status: 403 });
    const schema = z.object({
      title: z.string().trim().max(180), altText: z.string().trim().max(240), caption: z.string().trim().max(500),
      description: z.string().trim().max(3000), seoTitle: z.string().trim().max(180), seoDescription: z.string().trim().max(320),
      attribution: z.string().trim().max(500), usageRights: z.string().trim().max(1000), sourceUrl: z.string().trim().max(1000),
      contentType: z.string().max(40), entitySlug: z.string().max(120),
    });
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Please check the metadata." }, { status: 400 });
    const values = parsed.data;
    if ((values.contentType || values.entitySlug) && !(await isValidMediaAssociation(values.contentType, values.entitySlug))) return NextResponse.json({ error: "Choose a valid catalogue association." }, { status: 400 });
    if (values.sourceUrl && !/^https?:\/\//i.test(values.sourceUrl)) return NextResponse.json({ error: "Source URL must begin with http:// or https://." }, { status: 400 });
    const { error: updateError } = await member.supabase.from("media_assets").update({
      title: values.title, alt_text: values.altText, caption: values.caption, description: values.description,
      seo_title: values.seoTitle, seo_description: values.seoDescription, attribution: values.attribution,
      usage_rights: values.usageRights, source_url: values.sourceUrl,
    }).eq("id", id);
    if (updateError) return NextResponse.json({ error: `Could not save metadata: ${updateError.message}` }, { status: 400 });
    const { data: existing } = await member.supabase.from("media_associations").select("id,content_type,entity_slug,placement").eq("asset_id", id);
    const currentMatch = existing?.find((entry) => entry.content_type === values.contentType && entry.entity_slug === values.entitySlug && entry.placement === "gallery");
    let keepId = currentMatch?.id;
    if (values.contentType && values.entitySlug && !currentMatch) {
      const { data: created, error: associationError } = await member.supabase.from("media_associations").insert({ asset_id: id, content_type: values.contentType, entity_slug: values.entitySlug, placement: "gallery" }).select("id").single();
      if (associationError) return NextResponse.json({ error: `Metadata saved, but catalogue association needs review: ${associationError.message}` }, { status: 400 });
      keepId = created.id;
    }
    const removeIds = (existing ?? []).filter((entry) => entry.id !== keepId).map((entry) => entry.id);
    if (removeIds.length) {
      const { error: removeError } = await member.supabase.from("media_associations").delete().in("id", removeIds);
      if (removeError) return NextResponse.json({ error: `Metadata saved, but the previous association could not be removed: ${removeError.message}` }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "retry") {
    if (!canManageOwnMedia(member.role, member.userId, asset)) return NextResponse.json({ error: "You cannot retry this media item." }, { status: 403 });
    if (asset.status !== "failed") return NextResponse.json({ error: "Only failed items can be retried." }, { status: 409 });
    const { data: original, error: originalError } = await member.supabase.storage.from("crystal-stones-private").download(asset.original_path);
    if (originalError || !original) return NextResponse.json({ error: "The private original is missing. Re-upload this image to retry processing." }, { status: 409 });
    const { data: oldVariants } = await member.supabase.from("media_variants").select("id,private_path").eq("asset_id", id);
    if (oldVariants?.length) {
      const { error: removeObjectsError } = await member.supabase.storage.from("crystal-stones-private").remove(oldVariants.map((variant) => variant.private_path));
      if (removeObjectsError) return NextResponse.json({ error: `Could not clear failed derivatives: ${removeObjectsError.message}` }, { status: 500 });
      const { error: removeRowsError } = await member.supabase.from("media_variants").delete().eq("asset_id", id);
      if (removeRowsError) return NextResponse.json({ error: `Could not reset failed derivatives: ${removeRowsError.message}` }, { status: 500 });
    }
    const { error: startError } = await member.supabase.rpc("transition_media_asset", { p_asset_id: id, p_status: "processing", p_error: null });
    if (startError) return NextResponse.json({ error: startError.message }, { status: 400 });
    try {
      const generated = await Promise.all((await createResponsiveWebpVariants(Buffer.from(await original.arrayBuffer()))).map(async ({ variant, data, width, height, size }) => {
        const path = `${member.userId}/${id}/${variant}.webp`;
        const { error } = await member.supabase.storage.from("crystal-stones-private").upload(path, data, { contentType: "image/webp", upsert: false });
        if (error) throw new Error(`Could not store ${variant} image: ${error.message}`);
        return { asset_id: id, variant, private_path: path, mime_type: "image/webp", byte_size: size, width, height };
      }));
      const { error: insertError } = await member.supabase.from("media_variants").insert(generated);
      if (insertError) throw new Error(insertError.message);
      const { error: finishError } = await member.supabase.rpc("transition_media_asset", { p_asset_id: id, p_status: "review_needed", p_error: null });
      if (finishError) throw new Error(finishError.message);
      return NextResponse.json({ ok: true, status: "review_needed" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Image processing failed.";
      await member.supabase.rpc("transition_media_asset", { p_asset_id: id, p_status: "failed", p_error: message.slice(0, 500) });
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  if (!canReviewMedia(member.role)) return NextResponse.json({ error: "Only editors can review or publish media." }, { status: 403 });

  if (action === "approve" && asset.status === "review_needed") {
    const { error } = await member.supabase.rpc("transition_media_asset", { p_asset_id: id, p_status: "approved", p_error: null });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, status: "approved" });
  }

  if (action === "publish" && asset.status === "approved") {
    const { data: variants, error: variantsError } = await member.supabase.from("media_variants").select("id,variant,private_path").eq("asset_id", id);
    if (variantsError || !variants?.length) return NextResponse.json({ error: "Approved image variants are missing." }, { status: 400 });
    const publishedPaths: string[] = [];
    for (const variant of variants) {
      const { data: downloaded, error: downloadError } = await member.supabase.storage.from("crystal-stones-private").download(variant.private_path);
      if (downloadError || !downloaded) {
        if (publishedPaths.length) await member.supabase.storage.from("crystal-stones-published").remove(publishedPaths);
        return NextResponse.json({ error: "Could not read a private image derivative for publication." }, { status: 500 });
      }
      const publicPath = `assets/${id}/${variant.variant}.webp`;
      const { error: uploadError } = await member.supabase.storage.from("crystal-stones-published").upload(publicPath, downloaded, { contentType: "image/webp", upsert: true });
      if (uploadError) {
        if (publishedPaths.length) await member.supabase.storage.from("crystal-stones-published").remove(publishedPaths);
        return NextResponse.json({ error: `Could not publish images: ${uploadError.message}` }, { status: 500 });
      }
      publishedPaths.push(publicPath);
      const { error: updateError } = await member.supabase.from("media_variants").update({ public_path: publicPath }).eq("id", variant.id);
      if (updateError) return NextResponse.json({ error: `Images copied but media metadata needs repair: ${updateError.message}` }, { status: 500 });
    }
    const { error } = await member.supabase.rpc("transition_media_asset", { p_asset_id: id, p_status: "published", p_error: null });
    if (error) return NextResponse.json({ error: `Images copied but publication status needs repair: ${error.message}` }, { status: 500 });
    return NextResponse.json({ ok: true, status: "published" });
  }
  return NextResponse.json({ error: "This action is not available for the current media status." }, { status: 409 });
}
