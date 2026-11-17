/**
 * Sources per-variety marble imagery from Wikimedia Commons (real named-stone
 * photographs) for varieties Pexels cannot serve honestly.
 *
 * Usage:
 *   node scripts/fetch-commons-variety-images.mjs            # download direct files + search candidates
 *   node scripts/fetch-commons-variety-images.mjs --pick slug=title.jpg
 *       # download a picked candidate (title = Commons file title) at full width
 */
import fs from "node:fs";
import path from "node:path";

const { default: sharp } = await import("sharp");

const UA = "CrystalStonesWebsiteBot/1.0 (https://crystalstones.co.in; site maintenance)";
const outDir = "public/images/catalogue/imported-marble";
const candDir = "temp/commons-candidates";
fs.mkdirSync(candDir, { recursive: true });

/** Directly chosen Commons files (visually verified variety photographs). */
const direct = [
  { slug: "portoro", title: "File:Portor marble.jpg" },
  { slug: "rosso-levanto", title: "File:Rosso Levanto Marble.jpg" },
  { slug: "giallo-siena", title: "File:Giallo di Siena.jpg" },
  { slug: "bardiglio", title: "File:BARDIGLIO.jpg" },
];

/** Targets still needing a photo: search Commons for candidates. */
const searches = [
  { slug: "statuario", queries: ["Statuario Venato", "statuary marble slab", "marmo statuario blocco", "Carrara statuario"] },
  { slug: "calacatta-viola", queries: ["Calacatta Viola", "marmo viola", "purple breccia marble", "violet marble Italy"] },
  { slug: "grigio-orobico", queries: ["Grigio Orobico", "marmo grigio Orobico", "grey marble slab Lombardia", "Orobico marble"] },
];

const api = "https://commons.wikimedia.org/w/api.php";

async function apiCall(params) {
  const url = `${api}?${new URLSearchParams({ format: "json", origin: "*", ...params })}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  const text = await res.text();
  try { return JSON.parse(text); } catch { throw new Error(`non-JSON (${res.status}): ${text.slice(0, 60)}`); }
}

async function imageInfo(titles, width = 1600) {
  const j = await apiCall({
    action: "query", titles: titles.join("|"), prop: "imageinfo",
    iiprop: "url|extmetadata|size", iiurlwidth: String(width),
  });
  const pages = j?.query?.pages ? Object.values(j.query.pages) : [];
  return pages.map((p) => ({ title: p.title, info: p.imageinfo?.[0] ?? null }));
}

async function downloadTo(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 10_000) throw new Error(`too small (${buf.length} B)`);
  fs.writeFileSync(dest, buf);
  return buf;
}

function attribution(info) {
  const meta = info?.extmetadata ?? {};
  const strip = (html) => (html ?? "").replace(/<[^>]+>/g, "").trim();
  return {
    artist: strip(meta.Artist?.value).slice(0, 80) || "unknown",
    license: strip(meta.LicenseShortName?.value) || "see Commons",
    page: info?.descriptionurl ?? "",
  };
}

const picked = process.argv.includes("--pick")
  ? Object.fromEntries(process.argv[process.argv.indexOf("--pick") + 1].split(",").map((p) => { const [slug, ...rest] = p.split("="); return [slug, rest.join("=")]; }))
  : null;

if (picked) {
  for (const [slug, title] of Object.entries(picked)) {
    const [info] = await imageInfo([decodeURIComponent(title)], 1600);
    if (!info?.info) { console.error(`no imageinfo for ${title}`); process.exitCode = 1; continue; }
    const buf = await downloadTo(info.info.thumburl, path.join(candDir, `${slug}-picked.img`));
    const webp = await sharp(buf).webp({ quality: 80 }).toBuffer();
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, `commons-${slug}-marble.webp`), webp);
    console.log(`OK ${slug} ← ${info.title}\n   ${JSON.stringify(attribution(info.info))} (${(webp.length / 1024).toFixed(0)} KB)`);
  }
} else {
  // 1. Direct downloads
  for (const t of direct) {
    try {
      const [info] = await imageInfo([t.title], 1600);
      if (!info?.info) throw new Error("no imageinfo");
      const buf = await downloadTo(info.info.thumburl, path.join(candDir, `${t.slug}-direct.img`));
      const webp = await sharp(buf).webp({ quality: 80 }).toBuffer();
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, `commons-${t.slug}-marble.webp`), webp);
      console.log(`OK ${t.slug} ← ${info.title} | ${JSON.stringify(attribution(info.info))} (${(webp.length / 1024).toFixed(0)} KB)`);
    } catch (e) { console.error(`FAIL ${t.slug}: ${e.message}`); }
  }

  // 2. Candidate searches
  for (const t of searches) {
    let n = 0;
    const seen = new Set();
    for (const q of t.queries) {
      if (n >= 4) break;
      let j;
      try {
        j = await apiCall({ action: "query", generator: "search", gsrsearch: q, gsrnamespace: "6", gsrlimit: "8", prop: "imageinfo", iiprop: "url|extmetadata|size", iiurlwidth: "800" });
      } catch (e) { console.error(`search "${q}" (${t.slug}): ${e.message}`); continue; }
      const pages = j?.query?.pages ? Object.values(j.query.pages) : [];
      for (const p of pages) {
        if (n >= 4) break;
        const info = p.imageinfo?.[0];
        if (!info?.thumburl || seen.has(p.title)) continue;
        if (/\.(svg|pdf|tif)$/i.test(info.thumburl.split("?")[0]) && !info.thumburl.includes("thumb")) continue;
        try {
          const dest = path.join(candDir, `${t.slug}-${n}.jpg`);
          await downloadTo(info.thumburl, dest);
          const a = attribution(info);
          console.log(`CAND ${t.slug}-${n}: ${p.title} | ${a.artist} | ${a.license}`);
          seen.add(p.title); n += 1;
        } catch { /* skip */ }
      }
    }
    if (!n) console.log(`CAND ${t.slug}: none found`);
  }
}

