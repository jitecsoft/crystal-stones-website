import { NextResponse, type NextRequest } from "next/server";
import { getMediaMember } from "@/lib/media/auth";
import { canReviewMedia } from "@/lib/media/domain";
import { productSaveSchema, slugConflictMessage } from "@/lib/products/validate";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const member = await getMediaMember();
  if (!member) return NextResponse.json({ error: "An active media team account is required." }, { status: 401 });
  if (!canReviewMedia(member.role)) return NextResponse.json({ error: "Only editors and administrators can edit products." }, { status: 403 });
  const { id } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Invalid product ID." }, { status: 400 });
  let body: { action?: unknown; [key: string]: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  const action = body.action ?? "save";

  const { data: product } = await member.supabase.from("catalogue_products").select("id,slug,status").eq("id", id).maybeSingle();
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

  if (action === "publish" || action === "unpublish") {
    const status = action === "publish" ? "published" : "draft";
    const { error } = await member.supabase.from("catalogue_products").update({
      status,
      published_by: action === "publish" ? member.userId : null,
      published_at: action === "publish" ? new Date().toISOString() : null,
    }).eq("id", id);
    if (error) return NextResponse.json({ error: `Could not update the product: ${error.message}` }, { status: 400 });
    return NextResponse.json({ ok: true, status });
  }

  if (action === "save") {
    const parsed = productSaveSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Please check the product fields." }, { status: 400 });
    const values = parsed.data;
    if (values.slug !== product.slug) {
      const conflict = slugConflictMessage(values.slug);
      if (conflict) return NextResponse.json({ error: conflict }, { status: 400 });
      const { data: taken } = await member.supabase.from("catalogue_products").select("id").eq("slug", values.slug).neq("id", id).maybeSingle();
      if (taken) return NextResponse.json({ error: "A product with this slug already exists. Choose another." }, { status: 400 });
    }
    const { error } = await member.supabase.from("catalogue_products").update(values).eq("id", id);
    if (error) return NextResponse.json({ error: `Could not save the product: ${error.message}` }, { status: 400 });
    return NextResponse.json({ ok: true, status: product.status });
  }

  return NextResponse.json({ error: "This action is not available." }, { status: 400 });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const member = await getMediaMember();
  if (!member) return NextResponse.json({ error: "An active media team account is required." }, { status: 401 });
  if (!canReviewMedia(member.role)) return NextResponse.json({ error: "Only editors and administrators can delete products." }, { status: 403 });
  const { id } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Invalid product ID." }, { status: 400 });
  const { data: product } = await member.supabase.from("catalogue_products").select("id,slug").eq("id", id).maybeSingle();
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  // Keep the photos, but detach them from this product.
  const { error: associationError } = await member.supabase.from("media_associations").delete().eq("content_type", "product").eq("entity_slug", product.slug);
  if (associationError) return NextResponse.json({ error: `Product kept, but its photo links could not be removed: ${associationError.message}` }, { status: 500 });
  const { error } = await member.supabase.from("catalogue_products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: `Could not delete the product: ${error.message}` }, { status: 400 });
  return NextResponse.json({ ok: true });
}
