'use client';

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ImportedMarbleVariety, MarbleOrigin } from "@/lib/imported-marble";

type Filters = { query: string; origin: string; colour: string; pattern: string; finish: string; application: string };
const emptyFilters: Filters = { query: "", origin: "", colour: "", pattern: "", finish: "", application: "" };
const origins: MarbleOrigin[] = ["Italy", "Turkey", "Spain", "Greece", "Portugal"];
const filterLabels: Record<keyof Filters, string> = {
  query: "Search",
  origin: "Origin",
  colour: "Colour",
  pattern: "Pattern",
  finish: "Finish",
  application: "Application",
};

function enquiryHref(item: ImportedMarbleVariety, requestPhotos = false) {
  const params = new URLSearchParams({ material: "Marble", stone: item.name });
  if (requestPhotos) params.set("notes", `Please share current slab photographs and options for a slab-selection appointment for ${item.name}.`);
  return `/requirement-builder/?${params.toString()}`;
}

function familyLabel(item: ImportedMarbleVariety) {
  if (!item.familyVerified) return "Stone family to confirm";
  if (item.stoneFamily === "limestone") return "Limestone · marble trade";
  return item.stoneFamily.charAt(0).toUpperCase() + item.stoneFamily.slice(1);
}

export function ImportedMarbleCatalogue({ products, lockedOrigin, initialFilters }: { products: ImportedMarbleVariety[]; lockedOrigin?: string; initialFilters?: Partial<Filters> }) {
  const [filters, setFilters] = useState<Filters>({ ...emptyFilters, ...initialFilters });
  const [selected, setSelected] = useState<string[]>([]);
  const [limitMessage, setLimitMessage] = useState("");

  const filteredProducts = useMemo(() => products.filter((item) => {
    const haystack = `${item.name} ${item.aliases.join(" ")}`.toLocaleLowerCase();
    return (!filters.query || haystack.includes(filters.query.trim().toLocaleLowerCase()))
      && (!filters.origin || item.origin.country === filters.origin)
      && (!filters.colour || item.colours.includes(filters.colour))
      && (!filters.pattern || item.patterns.includes(filters.pattern))
      && (!filters.finish || item.finishes.includes(filters.finish))
      && (!filters.application || item.applications.includes(filters.application));
  }), [filters, products]);

  const compared = selected.map((slug) => products.find((item) => item.slug === slug)).filter((item): item is ImportedMarbleVariety => Boolean(item));
  const colourOptions = [...new Set(products.flatMap((item) => item.attributesVerified ? item.colours : []))].sort();
  const patternOptions = [...new Set(products.flatMap((item) => item.attributesVerified ? item.patterns : []))].sort();
  const finishOptions = [...new Set(products.flatMap((item) => item.attributesVerified ? item.finishes : []))].sort();
  const applicationOptions = [...new Set(products.flatMap((item) => item.attributesVerified ? item.applications : []))].sort();

  const update = (key: keyof Filters, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  const activeFilters = (Object.keys(filters) as (keyof Filters)[]).filter((key) => Boolean(filters[key]));
  const clearAll = () => setFilters((current) => ({ ...emptyFilters, ...(lockedOrigin ? { origin: current.origin } : {}) }));
  const toggleCompare = (slug: string) => {
    setLimitMessage("");
    if (selected.includes(slug)) setSelected((current) => current.filter((item) => item !== slug));
    else if (selected.length >= 3) setLimitMessage("Compare up to three varieties at a time.");
    else setSelected((current) => [...current, slug]);
  };

  return (
    <div className="marble-catalogue">
      <div className="marble-filters" aria-label="Filter imported marble varieties">
        <div className="field marble-filters__search">
          <label htmlFor="marble-search">Search varieties</label>
          <input id="marble-search" type="search" value={filters.query} onChange={(event) => update("query", event.target.value)} placeholder="Search a variety or trade name" />
        </div>
        {!lockedOrigin && <div className="field"><label htmlFor="marble-origin">Verified origin</label><select id="marble-origin" value={filters.origin} onChange={(event) => update("origin", event.target.value)}><option value="">All origins</option>{origins.map((origin) => <option key={origin}>{origin}</option>)}</select></div>}
        {colourOptions.length > 0 && <div className="field"><label htmlFor="marble-colour">Colour</label><select id="marble-colour" value={filters.colour} onChange={(event) => update("colour", event.target.value)}><option value="">All colours</option>{colourOptions.map((value) => <option key={value}>{value}</option>)}</select></div>}
        {patternOptions.length > 0 && <div className="field"><label htmlFor="marble-pattern">Pattern</label><select id="marble-pattern" value={filters.pattern} onChange={(event) => update("pattern", event.target.value)}><option value="">All patterns</option>{patternOptions.map((value) => <option key={value}>{value}</option>)}</select></div>}
        {finishOptions.length > 0 && <div className="field"><label htmlFor="marble-finish">Finish</label><select id="marble-finish" value={filters.finish} onChange={(event) => update("finish", event.target.value)}><option value="">All finishes</option>{finishOptions.map((value) => <option key={value}>{value}</option>)}</select></div>}
        {applicationOptions.length > 0 && <div className="field"><label htmlFor="marble-application">Application</label><select id="marble-application" value={filters.application} onChange={(event) => update("application", event.target.value)}><option value="">All applications</option>{applicationOptions.map((value) => <option key={value}>{value}</option>)}</select></div>}
      </div>

      {!lockedOrigin && <p className="marble-catalogue__filter-note">Filters use attributes referenced in the starter research. Unverified attributes remain blank until confirmed for a named variety.</p>}

      {activeFilters.length > 0 && <div className="active-filters" aria-label="Active filters">
        {activeFilters.map((key) => <span className="filter-chip" key={key}>{filterLabels[key]}: {filters[key]}<button type="button" aria-label={`Remove ${filterLabels[key]} filter`} onClick={() => update(key, "")}>×</button></span>)}
        <button className="active-filters__clear" type="button" onClick={clearAll}>Clear all</button>
      </div>}

      {compared.length > 0 && <section className="marble-compare" id="compare" aria-labelledby="compare-title">
        <div className="marble-compare__heading"><div><p className="eyebrow">Compare shortlist</p><h2 id="compare-title">A side-by-side starting point</h2></div><button className="text-button" type="button" onClick={() => setSelected([])}>Clear shortlist</button></div>
        <div className="marble-compare__scroll"><table><thead><tr><th scope="col">Attribute</th>{compared.map((item) => <th scope="col" key={item.slug}>{item.name}</th>)}</tr></thead><tbody>
          <tr><th scope="row">Origin</th>{compared.map((item) => <td key={item.slug}>{item.origin.country ?? "Confirm for lot"}</td>)}</tr>
          <tr><th scope="row">Stone family</th>{compared.map((item) => <td key={item.slug}>{familyLabel(item)}</td>)}</tr>
          <tr><th scope="row">Colour direction</th>{compared.map((item) => <td key={item.slug}>{item.colours.join(", ") || "Confirm from slab"}</td>)}</tr>
          <tr><th scope="row">Pattern</th>{compared.map((item) => <td key={item.slug}>{item.patterns.join(", ") || "Confirm from slab"}</td>)}</tr>
          <tr><th scope="row">Finishes</th>{compared.map((item) => <td key={item.slug}>{item.finishes.join(", ") || "Confirm for lot"}</td>)}</tr>
          <tr><th scope="row">Availability</th>{compared.map((item) => <td key={item.slug}>Request price &amp; availability</td>)}</tr>
          <tr><th scope="row">Next step</th>{compared.map((item) => <td key={item.slug}><Link className="text-link" href={enquiryHref(item)}>Enquire about {item.name}</Link></td>)}</tr>
        </tbody></table></div>
      </section>}

      <div className="marble-catalogue__results" aria-live="polite"><span>{filteredProducts.length} {filteredProducts.length === 1 ? "variety" : "varieties"}</span>{limitMessage && <span role="status">{limitMessage}</span>}</div>
      {filteredProducts.length > 0 ? <div className="marble-grid">
        {filteredProducts.map((item) => <article className="marble-card" key={item.slug}>
          <Link href={`/marble/variety/${item.slug}/`} className="marble-card__media">
            <Image src={item.image.src} alt={item.image.alt} fill sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 33vw" />
            {item.image.illustrative && <span className="image-label">Illustrative</span>}
          </Link>
          <div className="marble-card__body">
            <div className="marble-card__meta"><span>{item.origin.country ?? "Origin to confirm"}</span><span>{familyLabel(item)}</span></div>
            <h2><Link href={`/marble/variety/${item.slug}/`}>{item.name}</Link></h2>
            <p>{item.description}</p>
            <div className="marble-card__tags">{item.colours.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}{item.patterns.slice(0, 1).map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="marble-card__actions"><Link className="text-link" href={`/marble/variety/${item.slug}/`}>View variety</Link><button type="button" className={`compare-toggle ${selected.includes(item.slug) ? "is-selected" : ""}`} aria-pressed={selected.includes(item.slug)} onClick={() => toggleCompare(item.slug)}>{selected.includes(item.slug) ? "Shortlisted" : "Add to compare"}</button></div>
            <p className="availability-line">Request price &amp; availability</p>
          </div>
        </article>)}
      </div> : <div className="catalogue-empty"><p className="eyebrow">No exact matches</p><h2>Try another search or ask us to source a direction.</h2><p>Some trade names and attributes are still being verified. Share your preferred look and project brief for a current sourcing response.</p><div className="hero-actions"><button className="button button-dark" type="button" onClick={clearAll}>Clear filters</button><Link className="button button-outline" href="/requirement-builder/?material=Marble">Start a sourcing enquiry</Link></div></div>}
      <p className="catalogue-disclosure">This starter catalogue is for discovery, not a stock list. Origin, stone family, finish, technical suitability and availability must be confirmed for each offered lot. Imagery is illustrative and not variety-specific.</p>

      {selected.length > 0 && <div className="compare-dock" role="region" aria-label="Compare shortlist">
        <div><strong>{selected.length}</strong> {selected.length === 1 ? "variety" : "varieties"} shortlisted <span>{compared.map((item) => item.name).join(" · ")}</span></div>
        <div className="compare-dock__actions"><a className="compare-dock__compare" href="#compare">Compare now</a><button type="button" onClick={() => setSelected([])}>Clear</button></div>
      </div>}
    </div>
  );
}
