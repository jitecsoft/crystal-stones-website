import { NextResponse, type NextRequest } from "next/server";
import { getMediaMember } from "@/lib/media/auth";
import { canReviewMedia } from "@/lib/media/domain";
import { productSaveSchema, slugConflictMessage } from "@/lib/products/validate";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const member = await getMediaMember();
  if (!member) return NextResponse.json({ error: "An active media team account is required." }, { status: 401 });
  if (!canReviewMedia(member.role)) return NextResponse.json({ error: "Only editors and administrators can create products." }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  const parsed = productSaveSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Please check the product fields." }, { status: 400 });
  const values = parsed.data;
  const conflict = slugConflictMessage(values.slug);
  if (conflict) return NextResponse.json({ error: conflict }, { status: 400 });

  const { data: existing } = await member.supabase.from("catalogue_products").select("id").eq("slug", values.slug).maybeSingle();
  if (existing) return NextResponse.json({ error: "A product with this slug already exists. Choose another." }, { status: 400 });

  const { data: created, error } = await member.supabase.from("catalogue_products").insert({ ...values, created_by: member.userId }).select("id,slug").single();
  if (error) return NextResponse.json({ error: `Could not create the product: ${error.message}` }, { status: 400 });
  return NextResponse.json({ ok: true, id: created.id, slug: created.slug, status: "draft" });
}
