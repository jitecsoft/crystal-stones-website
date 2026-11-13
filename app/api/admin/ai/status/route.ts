import { NextResponse } from "next/server";
import { getMediaMember } from "@/lib/media/auth";
import { canReviewMedia } from "@/lib/media/domain";
import { aiBaseUrl, aiConfigured, aiModel } from "@/lib/ai/ai-fill";

export const runtime = "nodejs";

/** Team-only diagnostic: reports which assistant environment variables the
 *  running server process can actually see. No secret values are returned. */
export async function GET() {
  const member = await getMediaMember();
  if (!member) return NextResponse.json({ error: "An active media team account is required." }, { status: 401 });
  if (!canReviewMedia(member.role)) return NextResponse.json({ error: "Only editors and administrators can view this status." }, { status: 403 });

  return NextResponse.json({
    configured: aiConfigured(),
    apiKeyPresent: Boolean(process.env.AI_API_KEY),
    baseUrl: aiBaseUrl(),
    baseUrlIsDefault: !process.env.AI_BASE_URL,
    model: aiModel(),
    modelIsDefault: !process.env.AI_MODEL,
    fallbacks: (process.env.AI_MODEL_FALLBACKS || "").trim() || null
  });
}
