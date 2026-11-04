'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Material } from "@/lib/materials";

export function Catalogue({ materials, families, colours }: { materials: Material[]; families: string[]; colours: string[] }) {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("All materials");
  const [colour, setColour] = useState("Any colour");
  const visible = useMemo(() => materials.filter((m) => {
    const q = query.toLowerCase().trim();
    return (!q || `${m.name} ${m.family} ${m.colour} ${m.applications.join(" ")}`.toLowerCase().includes(q))
      && (family === "All materials" || m.family === family)
      && (colour === "Any colour" || m.colour === colour);
  }), [materials, query, family, colour]);
  return <section className="catalogue-section">
    <div className="filters">
      <div className="field"><label htmlFor="material-search">Search materials</label><input id="material-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try marble, grey, countertops…" /></div>
      <div className="field"><label htmlFor="family-filter">Material family</label><select id="family-filter" value={family} onChange={(e) => setFamily(e.target.value)}><option>All materials</option>{families.map((f) => <option key={f}>{f}</option>)}</select></div>
      <div className="field"><label htmlFor="colour-filter">Colour preference</label><select id="colour-filter" value={colour} onChange={(e) => setColour(e.target.value)}><option>Any colour</option>{colours.filter((c) => c !== "Any / recommend options").map((c) => <option key={c}>{c}</option>)}</select></div>
    </div>
    <div className="catalogue-count">{visible.length} material references · Demonstration catalogue</div>
    <div className="material-grid">{visible.map((m) => <article className="material-card" key={m.slug}><Link href={`/material/${m.slug}/`}><div className="material-image"><Image src={m.image} alt={`${m.name} inspiration`} fill sizes="(max-width: 650px) 50vw, (max-width: 1000px) 33vw, 30vw" /></div><h3>{m.name}</h3><p>{m.family} · {m.colour}</p><span className="card-link">View material details ↗</span></Link></article>)}</div>
    {visible.length === 0 && <div className="not-found"><h2>No exact matches</h2><p className="muted">Try a broader search or ask us to recommend a material.</p><Link className="button button-dark" href="/requirement-builder/">Request guidance</Link></div>}
    <p className="note">These initial entries are illustrative placeholders, not confirmed stock. Replace with verified Crystal Stones materials, photography and specifications before launch.</p>
  </section>;
}
