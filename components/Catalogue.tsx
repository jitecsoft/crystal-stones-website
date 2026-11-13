'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Material } from "@/lib/materials";
import { MaterialCard } from "@/components/MaterialCard";

type Sort = "featured" | "az" | "family";

export function Catalogue({ materials, families, colours }: { materials: Material[]; families: string[]; colours: string[] }) {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("All materials");
  const [colour, setColour] = useState("Any colour");
  const [sort, setSort] = useState<Sort>("featured");

  const filtered = useMemo(() => materials.filter((m) => {
    const q = query.toLowerCase().trim();
    return (!q || `${m.name} ${m.family} ${m.colour} ${m.summary} ${m.applications.join(" ")}`.toLowerCase().includes(q))
      && (family === "All materials" || m.family === family)
      && (colour === "Any colour" || m.colour.includes(colour));
  }), [materials, query, family, colour]);

  const visible = useMemo(() => {
    const items = [...filtered];
    if (sort === "az") items.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "family") items.sort((a, b) => a.family.localeCompare(b.family) || a.name.localeCompare(b.name));
    return items;
  }, [filtered, sort]);

  const activeFilters = [
    query.trim() ? { key: "query" as const, label: `“${query.trim()}”` } : null,
    family !== "All materials" ? { key: "family" as const, label: family } : null,
    colour !== "Any colour" ? { key: "colour" as const, label: colour } : null,
  ].filter((item): item is { key: "query" | "family" | "colour"; label: string } => Boolean(item));

  const clearFilter = (key: "query" | "family" | "colour") => {
    if (key === "query") setQuery("");
    if (key === "family") setFamily("All materials");
    if (key === "colour") setColour("Any colour");
  };

  const clearAll = () => {
    setQuery("");
    setFamily("All materials");
    setColour("Any colour");
  };

  return (
    <section className="catalogue-section" aria-labelledby="material-results-title">
      <div className="filters" aria-label="Filter materials">
        <div className="field">
          <label htmlFor="material-search">Search materials</label>
          <input id="material-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try marble, grey, countertops…" />
        </div>
        <div className="field">
          <label htmlFor="family-filter">Material family</label>
          <select id="family-filter" value={family} onChange={(e) => setFamily(e.target.value)}>
            <option>All materials</option>
            {families.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="colour-filter">Colour preference</label>
          <select id="colour-filter" value={colour} onChange={(e) => setColour(e.target.value)}>
            <option>Any colour</option>
            {colours.filter((c) => c !== "Any / recommend options").map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="results-toolbar">
        <div className="results-count" aria-live="polite"><strong>{visible.length}</strong> material {visible.length === 1 ? "reference" : "references"} <span>· Demonstration catalogue</span></div>
        <div className="results-controls">
          <label htmlFor="material-sort">Sort</label>
          <select id="material-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="featured">Featured</option>
            <option value="az">A–Z</option>
            <option value="family">By family</option>
          </select>
        </div>
      </div>

      {activeFilters.length > 0 && <div className="active-filters">
        {activeFilters.map((item) => <span className="filter-chip" key={item.key}>{item.label}<button type="button" aria-label={`Remove ${item.label} filter`} onClick={() => clearFilter(item.key)}>×</button></span>)}
        <button className="active-filters__clear" type="button" onClick={clearAll}>Clear all</button>
      </div>}

      <h2 className="visually-hidden" id="material-results-title">Material results</h2>
      {visible.length > 0 ? <div className="material-grid">
        {visible.map((m) => <MaterialCard material={m} key={m.slug} />)}
      </div> : <div className="catalogue-empty">
        <p className="eyebrow">No exact matches</p>
        <h2>Try a broader search or ask us to recommend a material.</h2>
        <p>Some material families and finishes are still being verified. Share the application, look and approximate quantity for a project-led recommendation.</p>
        <div className="hero-actions"><button className="button button-dark" type="button" onClick={clearAll}>Clear filters</button><Link className="button button-outline" href="/requirement-builder/">Request guidance</Link></div>
      </div>}
      <p className="note">These initial entries are illustrative placeholders, not confirmed stock. Replace with verified Crystal Stones materials, photography and specifications before launch.</p>
    </section>
  );
}
