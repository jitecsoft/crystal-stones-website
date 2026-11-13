import type { Metadata } from "next";
import Link from "next/link";
import { ImportedMarbleCatalogue } from "@/components/ImportedMarbleCatalogue";
import { JsonLd } from "@/components/JsonLd";
import { ProductCardStrip } from "@/components/ProductCardStrip";
import { getPublishedProductsByCategory } from "@/lib/products/db";
import { importedMarbleVarieties, marbleOrigins } from "@/lib/imported-marble";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Imported Natural Marble",
  description: "Browse imported natural marble varieties by origin, colour, pattern, finish and application. Origin, lot photographs and current availability are confirmed on request.",
  alternates: { canonical: "/marble/" },
};

type MarbleSearchParams = Record<string, string | string[] | undefined>;
const single = (value: string | string[] | undefined) => typeof value === "string" ? value : "";
const catalogueLink = (filters: Record<string, string>) => `/marble/?${new URLSearchParams(filters).toString()}`;
const bookmatchedBrief = `/requirement-builder/?${new URLSearchParams({ material: "Marble", notes: "I am interested in bookmatched marble slabs. Please confirm current options." }).toString()}`;

export default async function MarblePage({ searchParams }: { searchParams: Promise<MarbleSearchParams> }) {
  const params = await searchParams;
  const initialFilters = {
    query: single(params.q),
    origin: single(params.origin),
    colour: single(params.colour),
    pattern: single(params.pattern),
    finish: single(params.finish),
    application: single(params.application),
  };
  const filterKey = new URLSearchParams(Object.entries(initialFilters).filter(([, value]) => value)).toString();
  const teamProducts = await getPublishedProductsByCategory("marble");

  return <main className="marble-page">
    <JsonLd data={{
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Imported Natural Marble",
      description: "A research starter catalogue of imported natural marble and related trade names. Origin, stone family and availability must be verified for the offered lot.",
      url: `${siteUrl}/marble/`,
      mainEntity: { "@type": "ItemList", itemListElement: importedMarbleVarieties.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, url: `${siteUrl}/marble/variety/${item.slug}/` })) },
    }} />
    <section className="marble-hero">
      <div className="breadcrumb"><Link href="/">Home</Link> / Imported natural marble</div>
      <p className="eyebrow">Sourced to the project</p>
      <h1>Imported natural marble, <em>considered by origin.</em></h1>
      <p className="marble-hero__intro">Browse recognized variety names and reference attributes, then ask us to confirm the quarry, stone family, current lot, finish and suitability for your project.</p>
      <div className="marble-hero__actions">
        <Link className="button button-dark" href="#varieties">Browse all imported marble <span aria-hidden="true">↓</span></Link>
        <Link className="button button-outline" href="/requirement-builder/?material=Marble">Build a sourcing brief <span aria-hidden="true">↗</span></Link>
      </div>
      <p className="catalogue-disclosure">This is a researched starter catalogue, not a stock list. Country names and descriptive attributes are references; verify the specific block or slab before specification.</p>
    </section>

    <nav className="origin-nav" aria-label="Imported marble origin collections">
      <div className="origin-nav__inner">
        <span>Browse by origin</span>
        {marbleOrigins.map((origin) => <Link href={`/marble/origin/${origin.slug}/`} key={origin.slug}>{origin.name}<span aria-hidden="true">↗</span></Link>)}
        <Link href="#varieties">Browse all varieties <span aria-hidden="true">↓</span></Link>
      </div>
    </nav>

    <section className="marble-curations" aria-labelledby="curations-title">
      <div className="section-shell">
        <div className="section-intro"><div><p className="eyebrow">A few useful starting points</p><h2 id="curations-title">Follow the visual direction.</h2></div><p>These are discovery paths across the starter data, not claims about a matching slab or current availability.</p></div>
        <div className="curation-links">
          <Link href={catalogueLink({ origin: "Italy", colour: "White" })}>Italian white marble <span>↗</span></Link>
          <Link href="/marble/origin/turkey/">Turkish white &amp; beige <span>↗</span></Link>
          <Link href={catalogueLink({ pattern: "Veined" })}>Dramatic veined marble <span>↗</span></Link>
          <Link href={catalogueLink({ colour: "Beige" })}>Warm beige marble <span>↗</span></Link>
          <Link href={catalogueLink({ colour: "Grey" })}>Grey marble <span>↗</span></Link>
          <Link href={bookmatchedBrief}>Bookmatched marble <span>↗</span></Link>
        </div>
      </div>
    </section>

    <ProductCardStrip products={teamProducts} heading="New in the marble catalogue." copy="Latest marble products added by the team. Request photographs and current availability for each one." />

    <section className="marble-results-section" id="varieties" aria-labelledby="varieties-title">
      <div className="section-shell">
        <div className="section-intro"><div><p className="eyebrow">Imported marble catalogue</p><h2 id="varieties-title">Search across origins.</h2></div><p>Origin and attributes appear only when supported by a reference. Lot-level availability remains enquiry-based.</p></div>
        <ImportedMarbleCatalogue key={filterKey} products={importedMarbleVarieties} initialFilters={initialFilters} />
      </div>
    </section>

    <section className="marble-bottom-cta">
      <div className="section-shell marble-bottom-cta__inner"><div><p className="eyebrow">Looking for a particular block?</p><h2>Build your marble shortlist with us.</h2><p>Share a reference, approximate quantity, location and preferred finish. Ask for current slab photographs or a selection appointment.</p></div><Link className="button button-dark" href="/requirement-builder/?material=Marble">Request price &amp; availability <span aria-hidden="true">↗</span></Link></div>
    </section>
  </main>;
}
