/**
 * Generates a "stone applied in interior" render from a variety's reference
 * surface image, using the Gemini image model.
 *
 * Usage:
 *   node scripts/generate-render.mjs --surface <image path> --room "<room description>" --out <output path> [--model gemini-2.5-flash-image] [--notes "<extra prompt detail>"]
 *
 * The reference surface stays untouched in the prompt; the model is asked to
 * retexture the interior's stone surfaces with it, never to invent a stone.
 */
import fs from "node:fs";
import path from "node:path";

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const surfacePath = arg("surface");
const room = arg("room");
const outPath = arg("out");
const model = arg("model") ?? "gemini-2.5-flash-image";
const notes = arg("notes") ?? "";

if (!surfacePath || !room || !outPath) {
  console.error("Usage: node scripts/generate-render.mjs --surface <img> --room \"<room>\" --out <out>");
  process.exit(1);
}

const envFile = fs.readFileSync(".env.local", "utf8");
const key = envFile.match(/^AI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!key) {
  console.error("AI_API_KEY not found in .env.local");
  process.exit(1);
}

const surface = fs.readFileSync(surfacePath);
const ext = path.extname(surfacePath).slice(1).toLowerCase();
const mime = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" }[ext] ?? "image/png";

const prompt = [
  `Create a photorealistic interior photograph of ${room}.`,
  `The stone surfaces in this room (feature wall, floor, or countertop as appropriate) must be finished in EXACTLY the stone surface shown in the attached reference image — match its colour, veining and pattern faithfully across the applied areas.`,
  `Do not invent a different stone; do not change the reference material's character.`,
  `Realistic lighting, professional interior-photography composition, no people, no text, no watermarks, no logos.`,
  notes,
].filter(Boolean).join(" ");

const body = {
  contents: [{
    parts: [
      { text: prompt },
      { inline_data: { mime_type: mime, data: surface.toString("base64") } },
    ],
  }],
  generationConfig: { responseModalities: ["IMAGE"] },
};

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
  { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
);

if (!response.ok) {
  const text = await response.text();
  console.error(`API error ${response.status}: ${text.slice(0, 400)}`);
  process.exit(1);
}

const data = await response.json();
const parts = data.candidates?.[0]?.content?.parts ?? [];
const imagePart = parts.find((p) => p.inlineData || p.inline_data);
if (!imagePart) {
  console.error(`No image in response. Parts: ${JSON.stringify(parts).slice(0, 500)}`);
  process.exit(1);
}
const b64 = imagePart.inlineData?.data ?? imagePart.inline_data?.data;
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, Buffer.from(b64, "base64"));
console.log(`saved ${outPath} (${Buffer.from(b64, "base64").length} bytes)`);
