import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const enquirySchema = z.object({
  audience: z.string().min(1).max(100),
  material: z.string().min(1).max(120),
  stoneName: z.string().max(180).optional().default(""),
  colour: z.string().min(1).max(100),
  application: z.string().min(1).max(120),
  area: z.string().max(40).optional(),
  unit: z.enum(["sqft", "sqm"]),
  waste: z.number().min(0).max(20),
  supplyFormat: z.string().min(1).max(100),
  thickness: z.string().min(1).max(80),
  resinTreatment: z.string().min(1).max(120),
  resinProcess: z.string().max(120).optional(),
  finish: z.string().min(1).max(100),
  sizePreset: z.string().min(1).max(120),
  customLength: z.string().max(30).optional(),
  customWidth: z.string().max(30).optional(),
  pieceQuantity: z.string().max(100).optional(),
  destination: z.string().min(1).max(100),
  timeline: z.string().max(100).optional(),
  name: z.string().trim().min(1).max(120),
  company: z.string().max(180).optional(),
  phone: z.string().max(60).optional(),
  email: z.string().trim().email().max(254).optional().or(z.literal("")),
  projectLocation: z.string().max(180).optional(),
  notes: z.string().max(3000).optional(),
  measuredArea: z.number().positive().max(1_000_000_000).nullable().optional(),
  measuredUnit: z.enum(["sqft", "sqm"]).optional(),
  measuredAreaSqft: z.number().positive().max(1_000_000_000).nullable().optional(),
  wastagePercent: z.number().min(0).max(20).optional(),
  estimatedOrderAreaSqft: z.number().positive().max(1_000_000_000).nullable().optional(),
  estimatedOrderAreaSqm: z.number().positive().max(1_000_000_000).nullable().optional(),
  summary: z.record(z.string(), z.string()).optional(),
  sourcePath: z.string().max(300).optional()
}).refine((data) => Boolean(data.email?.trim() || data.phone?.trim()), {
  message: "Please provide an email address or phone number."
});

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
  if (length > 30_000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Please submit a valid requirement." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Please check the requirement details." }, { status: 400 });
  }

  const { RESEND_API_KEY, ENQUIRY_TO_EMAIL, ENQUIRY_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !ENQUIRY_TO_EMAIL || !ENQUIRY_FROM_EMAIL) {
    return NextResponse.json({
      error: "Enquiry submission is not connected yet. Please contact the site administrator to configure the enquiry email service before launch."
    }, { status: 503 });
  }

  const data = parsed.data;
  const reference = `CS-${new Date().getUTCFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const summary = [
    `Reference: ${reference}`,
    `Name: ${data.name}`,
    `Company: ${data.company || "Not provided"}`,
    `Email: ${data.email || "Not provided"}`,
    `Phone: ${data.phone || "Not provided"}`,
    `Audience: ${data.audience}`,
    `Material: ${data.material}`,
    `Stone: ${data.stoneName || "Open to recommendations"}`,
    `Colour: ${data.colour}`,
    `Application: ${data.application}`,
    `Measured area: ${data.measuredArea ?? data.area ?? "Not provided"} ${data.measuredUnit ?? data.unit}`,
    `Estimated order area: ${data.estimatedOrderAreaSqft ?? "Not calculated"} sq ft`,
    `Allowance: ${data.wastagePercent ?? data.waste}%`,
    `Format: ${data.supplyFormat}`,
    `Thickness: ${data.thickness}`,
    `Resin treatment: ${data.resinTreatment}`,
    `Resin process: ${data.resinProcess || "Not specified"}`,
    `Finish: ${data.finish}`,
    `Dimensions: ${data.sizePreset} ${data.customLength || ""} ${data.customWidth || ""}`,
    `Piece quantity: ${data.pieceQuantity || "Not provided"}`,
    `Destination: ${data.destination}`,
    `Timeline: ${data.timeline || "Not provided"}`,
    `Project location: ${data.projectLocation || "Not provided"}`,
    `Source path: ${data.sourcePath || "Not provided"}`,
    `Notes: ${data.notes || "None"}`
  ].join("\n");

  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: ENQUIRY_FROM_EMAIL,
      to: [ENQUIRY_TO_EMAIL],
      subject: `New Crystal Stones requirement ${reference}`,
      text: summary,
      reply_to: data.email || undefined
    })
  });

  if (!result.ok) {
    return NextResponse.json({ error: "We could not send your requirement right now. Please try again or contact us directly." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, reference }, { status: 201 });
}
