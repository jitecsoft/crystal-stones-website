/** One-off: download Pexels candidates for two missing varieties for visual review. */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const { default: sharp } = await import("sharp");
const candDir = "temp/pexels-candidates";
fs.mkdirSync(candDir, { recursive: true });

const targets = [
  { slug: "calacatta-viola", queries: ["purple marble slab", "violet stone texture", "purple marble stone"] },
  { slug: "grigio-orobico", queries: ["grey marble slab", "grey stone slab texture", "gray marble texture"] },
];

function search(query) {
  const url = `https://www.pexels.com/search/${encodeURIComponent(query)}/`;
  const tmp = path.join(os.tmpdir(), `px-${Date.now()}.html`);
  execFileSync("curl.exe", ["-sL", "-o", tmp, "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36", "-H", "Accept: text/html", "--compressed", url], { timeout: 45000 });
  const html = fs.readFileSync(tmp, "utf8");
  fs.unlinkSync(tmp);
  return [...new Set([...html.matchAll(/images\.pexels\.com\/photos\/(\d+)\//g)].map((m) => m[1]))];
}

const used = new Set();
for (const t of targets) {
  let n = 0;
  for (const q of t.queries) {
    if (n >= 4) break;
    let ids = [];
    try { ids = search(q).filter((id) => !used.has(id)); } catch (e) { console.error(`${t.slug} search "${q}": ${e.message}`); continue; }
    for (const id of ids) {
      if (n >= 4) break;
      try {
        const tmp = path.join(os.tmpdir(), `pxi-${id}.jpg`);
        execFileSync("curl.exe", ["-sL", "-o", tmp, `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900`], { timeout: 60000 });
        const buf = fs.readFileSync(tmp);
        fs.unlinkSync(tmp);
        if (buf.length < 10_000) continue;
        fs.writeFileSync(path.join(candDir, `${t.slug}-${n}.jpg`), await sharp(buf).resize(900, null, { withoutEnlargement: true }).jpeg({ quality: 85 }).toBuffer());
        console.log(`CAND ${t.slug}-${n}: photo ${id} ("${q}")`);
        used.add(id); n += 1;
      } catch { /* next */ }
    }
  }
  if (n < 4) console.log(`CAND ${t.slug}: only ${n} candidates`);
}
