import { NextResponse, type NextRequest } from "next/server";
import { getMediaMember } from "@/lib/media/auth";
import { canReviewMedia } from "@/lib/media/domain";
import { aiConfigured, aiFill, gatherWebContext } from "@/lib/ai/ai-fill";

export const runtime = "nodejs";

type Body = {
  assetId?: string;
  imageUrl?: string;
  name?: string;
  description?: string;
  hint?: string;
  mode?: "media" | "product";
};

async function toDataUrl(url: string, mime: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) return null;
  const type = response.headers.get("content-type") || mime;
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length > 8_000_000) return null;
  return `data:${type};base64,${buffer.toString("base64")}`;
}

export async function POST(request: NextRequest) {
  const member = await getMediaMember();
  if (!member) return NextResponse.json({ error: "An active media team account is required." }, { status: 401 });
  if (!canReviewMedia(member.role)) return NextResponse.json({ error: "Only editors and administrators can use AI fill." }, { status: 403 });
  if (!aiConfigured()) {
    return NextResponse.json({
      error: "AI is not configured on this deployment yet. Add AI_API_KEY (and optionally AI_BASE_URL and AI_MODEL) to the environment variables."
    }, { status: 503 });
  }

  let body: Body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  const name = (body.name ?? "").trim().slice(0, 180);
  const description = (body.description ?? "").trim().slice(0, 2000);
  const hint = (body.hint ?? "").trim().slice(0, 600);
  const mode = body.mode === "product" ? "product" : "media";
  if (!body.assetId && !body.imageUrl && !name && !hint) {
    return NextResponse.json({ error: "Give an image, a name or a short description so the assistant has something to work from." }, { status: 400 });
  }

  let imageDataUrl: string | null = null;
  if (body.assetId && /^[0-9a-f-]{36}$/i.test(body.assetId)) {
    const { data: asset } = await member.supabase
      .from("media_assets")
      .select("id,original_path,original_mime")
      .eq("id", body.assetId)
      .maybeSingle();
    if (asset?.original_path) {
      const { data: file, error } = await member.supabase.storage.from("crystal-stones-private").download(asset.original_path);
      if (!error && file) {
        imageDataUrl = `data:${asset.original_mime || "image/webp"};base64,${Buffer.from(await file.arrayBuffer()).toString("base64")}`;
      }
    }
  } else if (body.imageUrl && /^https?:\/\//i.test(body.imageUrl)) {
    imageDataUrl = await toDataUrl(body.imageUrl, "image/jpeg").catch(() => null);
  } else if (body.imageUrl && /^data:image\/(jpeg|png|webp|avif);base64,/i.test(body.imageUrl)) {
    // Base64 of a client-selected file that has not been uploaded yet (bulk
    // upload batch fill). Capped so requests stay within model payload limits.
    if (body.imageUrl.length <= 12_000_000) imageDataUrl = body.imageUrl;
  }

  const query = [name, hint].filter(Boolean).join(" ").trim();
  const context = query ? await gatherWebContext(query) : { text: "", sources: [] };

  try {
    const result = await aiFill({
      imageDataUrl,
      name: name || undefined,
      description: description || undefined,
      hint: hint || undefined,
      contextText: context.text,
      sources: context.sources,
      mode
    });
    return NextResponse.json(result);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "The assistant could not complete the request.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
