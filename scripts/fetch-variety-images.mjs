/**
 * Sources a distinct Pexels surface image per marble variety:
 * search → first unused photo → download → sharp WebP q80.
 *
 * Usage: node scripts/fetch-variety-images.mjs [--force]
 * Writes to public/images/catalogue/imported-marble/pexels-<slug>-marble.webp
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const { default: sharp } = await import("sharp");

const outDir = "public/images/catalogue/imported-marble";
const force = process.argv.includes("--force");

/** Per-variety search queries, most specific first. */
const targets = [
  { slug: "statuario", queries: ["statuary marble", "white marble dramatic grey veins"] },
  { slug: "calacatta-gold", queries: ["calacatta gold marble"] },
  { slug: "carrara", queries: ["carrara marble"] },
  { slug: "arabescato", queries: ["arabescato marble", "white marble swirl"] },
  { slug: "lasa-white", queries: ["white marble texture"] },
  { slug: "botticino", queries: ["botticino marble", "beige marble"] },
  { slug: "perlato-sicilia", queries: ["beige marble texture"] },
  { slug: "calacatta-viola", queries: ["violet marble", "purple marble texture"] },
  { slug: "portoro", queries: ["black gold marble"] },
  { slug: "rosso-levanto", queries: ["red marble"] },
  { slug: "giallo-siena", queries: ["yellow marble texture"] },
  { slug: "bardiglio", queries: ["blue grey marble"] },
  { slug: "grigio-orobico", queries: ["grey brown marble", "brown marble gold"] },
];

const used = new Set();
const results = [];
const failures = [];

function pexelsSearch(query) {
  const url = `https://www.pexels.com/search/${encodeURIComponent(query)}/`;
  const tmp = path.join(os.tmpdir(), `pexels-${Date.now()}.html`);
  execFileSync("curl.exe", [
    "-sL", "-o", tmp, "-w", "%{http_code}",
    "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "-H", "Accept: text/html,application/xhtml+xml",
    "-H", "Accept-Language: en-US,en;q=0.9",
    "--compressed", url,
  ], { timeout: 45000 });
  const html = fs.readFileSync(tmp, "utf8");
  fs.unlinkSync(tmp);
  const ids = [...html.matchAll(/images\.pexels\.com\/photos\/(\d+)\//g)].map((m) => m[1]);
  return [...new Set(ids)];
}

function downloadImage(id) {
  const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;
  const tmp = path.join(os.tmpdir(), `pexels-img-${id}.jpg`);
  execFileSync("curl.exe", ["-sL", "-o", tmp, url], { timeout: 90000 });
  const buf = fs.readFileSync(tmp);
  fs.unlinkSync(tmp);
  if (buf.length < 10_000) throw new Error(`image too small (${buf.length} B)`);
  return sharp(buf).webp({ quality: 80 }).toBuffer();
}

for (const target of targets) {
  const outPath = path.join(outDir, `pexels-${target.slug}-marble.webp`);
  if (!force && fs.existsSync(outPath)) {
    results.push(`SKIP ${target.slug} (exists)`);
    continue;
  }
  let done = false;
  for (const query of target.queries) {
    try {
      const ids = pexelsSearch(query).filter((id) => !used.has(id));
      if (!ids.length) continue;
      for (const id of ids.slice(0, 4)) {
        try {
          const webp = await downloadImage(id);
          used.add(id);
          fs.mkdirSync(outDir, { recursive: true });
          fs.writeFileSync(outPath, webp);
          results.push(`OK ${target.slug} ← photo ${id} (query: "${query}") ${(webp.length / 1024).toFixed(0)} KB`);
          done = true;
          break;
        } catch { /* try next id */ }
      }
      if (done) break;
    } catch (cause) {
      failures.push(`${target.slug} query "${query}": ${cause.message.slice(0, 120)}`);
    }
  }
  if (!done) failures.push(`${target.slug}: no usable photo found`);
}

console.log(results.join("\n"));
if (failures.length) { console.error("\nFAILURES:\n" + failures.join("\n")); process.exitCode = 1; }
