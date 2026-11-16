/**
 * Generates a "stone applied in interior" render using OpenAI's gpt-image-1
 * image-edit endpoint, from a variety's reference surface image.
 *
 * Usage:
 *   node scripts/generate-render-openai.mjs --surface <image path> --room "<room description>" --out <output path> [--quality low|medium|high]
 *
 * Requires OPENAI_API_KEY in .env.local. Uses existing credits on that key.
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
const quality = arg("quality") ?? "medium";

if (!surfacePath || !room || !outPath) {
  console.error("Usage: node scripts/generate-render-openai.mjs --surface <img> --room \"<room>\" --out <out>");
  process.exit(1);
}

const envFile = fs.readFileSync(".env.local", "utf8");
const key = envFile.match(/^OPENAI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!key) {
  console.error("OPENAI_API_KEY not found in .env.local");
  process.exit(1);
}

// The edits endpoint requires PNG input, so convert via sharp (already a project dependency).
const { default: sharp } = await import("sharp");
const surfacePng = await sharp(surfacePath).png().toBuffer();

const prompt = [
  `Create a photorealistic interior photograph of ${room}.`,
  `The stone surfaces in this room (feature wall, floor, or countertop as appropriate) must be finished in EXACTLY the stone surface shown in the attached reference image — match its colour, veining and pattern faithfully across the applied areas.`,
  `Do not invent a different stone; do not change the reference material's character.`,
  `Realistic lighting, professional interior-photography composition, no people, no text, no watermarks, no logos.`,
].join(" ");

const form = new FormData();
form.append("model", "gpt-image-1");
form.append("prompt", prompt);
form.append("quality", quality);
form.append("n", "1");
form.append("image", new Blob([surfacePng], { type: "image/png" }), "surface.png");

const response = await fetch("https://api.openai.com/v1/images/edits", {
  method: "POST",
  headers: { Authorization: `Bearer ${key}` },
  body: form,
});

if (!response.ok) {
  const text = await response.text();
  console.error(`API error ${response.status}: ${text.slice(0, 400)}`);
  process.exit(1);
}

const data = await response.json();
const b64 = data.data?.[0]?.b64_json;
if (!b64) {
  console.error(`No image in response: ${JSON.stringify(data).slice(0, 400)}`);
  process.exit(1);
}

// Save as WebP (q80) to keep catalogue sizes consistent.
const png = Buffer.from(b64, "base64");
const webp = await sharp(png).webp({ quality: 80 }).toBuffer();
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, webp);
console.log(`saved ${outPath} (${webp.length} bytes webp)`);
