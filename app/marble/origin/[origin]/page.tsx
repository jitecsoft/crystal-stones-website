import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImportedMarbleCatalogue } from "@/components/ImportedMarbleCatalogue";
import { JsonLd } from "@/components/JsonLd";
import { marbleOrigins, productsForOrigin, type MarbleOriginSlug } from "@/lib/imported-marble";
import { siteUrl } from "@/lib/site";

type Props = { params: Promise<{ origin: string }> };

export function generateStaticParams() {
  return marbleOrigins.map((origin) => ({ origin: origin.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { origin: slug } = await params;
  const origin = marbleOrigins.find((item) => item.slug === slug);
  if (!origin) return {};
  return {
    title: origin.name,
    description: `${origin.intro} Browse named varieties and confirm the specific lot before specification.`,
    alternates: { canonical: `/marble/origin/${origin.slug}/` },
  };
}

export default async function MarbleOriginPage({ params }: Props) {
  const { origin: slug } = await params;
  const origin = marbleOrigins.find((item) => item.slug === slug);
  if (!origin) notFound();
  const products = productsForOrigin(origin.slug as MarbleOriginSlug);

  return <main className="marble-page">
    <JsonLd data={{
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: origin.name,
      description: origin.intro,
      url: `${siteUrl}/marble/origin/${origin.slug}/`,
      isPartOf: { "@type": "CollectionPage", name: "Imported Natural Marble", url: `${siteUrl}/marble/` },
      mainEntity: { "@type": "ItemList", itemListElement: products.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, url: `${siteUrl}/marble/variety/${item.slug}/` })) },
    }} />
    <section className="origin-hero">
      <div className="breadcrumb"><Link href="/">Home</Link> / <Link href="/marble/">Imported natural marble</Link> / {origin.name}</div>
      <p className="eyebrow">Imported marble · Origin collection</p>
      <h1>{origin.name}<em> by variety.</em></h1>
      <p className="origin-hero__intro">{origin.intro}</p>
      <p className="origin-hero__notice">Country groupings are research references, not certification of an offered slab. Where a trade name has more than one possible origin, we show it as pending and ask for supplier documents before confirming the country or stone family.</p>
      <Link className="button button-outline" href="/marble/">Browse all imported marble <span aria-hidden="true">↗</span></Link>
    </section>
    <section className="marble-results-section"><div className="section-shell">
      <div className="section-intro"><div><p className="eyebrow">{products.length} starter entries</p><h2>Search this origin group.</h2></div><p>Variety-specific images and current slab information are not yet supplied; development imagery is clearly marked.</p></div>
      {products.length ? <ImportedMarbleCatalogue products={products} lockedOrigin={origin.name} /> : <div className="catalogue-empty"><p className="eyebrow">Origin collection in progress</p><h2>No varieties are published for this origin yet.</h2><p>We will add entries once the origin, stone family and commercial relevance are verified.</p><Link className="button button-dark" href="/requirement-builder/?material=Marble">Ask us to source a variety</Link></div>}
    </div></section>
  </main>;
}
