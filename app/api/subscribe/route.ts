import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig, hasSupabaseConfig } from "@/lib/supabase/config";

export const runtime = "nodejs";

const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  source: z.string().trim().max(60).optional().default("footer")
});

/** Captures footer newsletter subscriptions in the `newsletter_subscribers` table.
 *  The publishable key is used with row-level security: visitors may insert their
 *  own row but can never read the subscriber list. */
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL;
  if (origin && siteOrigin) {
    try {
      if (new URL(origin).origin !== new URL(siteOrigin).origin) {
        return NextResponse.json({ error: "Request origin could not be verified." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Site configuration is invalid." }, { status: 500 });
    }
  }

  const length = Number(request.headers.get("content-length") || "0");
  if (length > 2_000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Please submit a valid subscription." }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (!hasSupabaseConfig()) {
    return NextResponse.json({ error: "Subscription is not connected yet. Please try again later." }, { status: 503 });
  }

  const { url, key } = getSupabaseConfig();
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

  const { error } = await supabase.from("newsletter_subscribers").insert({
    email: parsed.data.email,
    source: parsed.data.source
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, alreadySubscribed: true }, { status: 200 });
    }
    return NextResponse.json({ error: "Subscription is not available right now. Please try again later." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
