import Image from "next/image";
import Link from "next/link";
import { architecturalBrands, type ArchitecturalBrand } from "@/lib/architectural-brands";
import { JsonLd } from "@/components/JsonLd";
import { siteUrl } from "@/lib/site";

function brandEnquiry(brand: ArchitecturalBrand, application?: string) {
  const params = new URLSearchParams({ material: "Porcelain / sintered stone", stone: brand.name });
  if (application) params.set("application", application);
  params.set("notes", `Please confirm the current ${brand.name} product range, project suitability, technical information and regional availability.`);
  return `/requirement-builder/?${params.toString()}`;
}

export function ArchitecturalSurfacesPage() {
  return <main className="architectural-page">
    <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Architectural Surface Brands", description: "Explore manufacturer brand references for architectural surfaces. Current Crystal Stones supply relationship and product availability are confirmed on enquiry.", url: `${siteUrl}/shop/sintered-stone/`, mainEntity: { "@type": "ItemList", itemListElement: architecturalBrands.map((brand, index) => ({ "@type": "ListItem", position: index + 1, name: brand.name, url: `${siteUrl}${brand.href}` })) } }} />
    <section className="page-hero architectural-hero">
      <div className="breadcrumb"><Link href="/">Home</Link> / Architectural surfaces</div>
      <p className="eyebrow">A considered brand library</p>
      <h1>Architectural surfaces, <em>by manufacturer.</em></h1>
      <p>Explore distinct brand and material directions alongside natural stone. Confirm the current collection, specification, supply relationship and availability before you make a project decision.</p>
      <div className="hero-actions"><Link className="button button-dark" href="/neolith/">Explore Neolith <span aria-hidden="true">↗</span></Link><Link className="button button-outline" href="/marble/">Discover imported marble <span aria-hidden="true">↗</span></Link></div>
    </section>

    <section className="brand-library" aria-labelledby="brand-library-title">
      <div className="section-shell">
        <div className="section-intro"><div><p className="eyebrow">Manufacturer references</p><h2 id="brand-library-title">Find a brand direction.</h2></div><p>Brand names identify the manufacturer or range. They do not imply Crystal Stones authorization, current stock or a particular product specification.</p></div>
        <div className="brand-grid">{architecturalBrands.map((brand, index) => <article className="brand-card" key={brand.slug}>
          <Link className="brand-card__media" href={brand.href} aria-label={`Explore ${brand.name}`}>
            <Image src={brand.image.src} alt={brand.image.alt} fill sizes="(max-width: 900px) 100vw, 50vw" />
            <span className="brand-card__badge">{brand.name}</span>
          </Link>
          <div className="brand-card__content">
            <div className="brand-card__top"><span>0{index + 1} / SURFACE BRAND</span><span>{brand.producer}</span></div>
            <h3>{brand.name}</h3>
            <p className="brand-card__category">{brand.category}</p>
            <p>{brand.summary}</p>
            <div className="brand-card__applications">{brand.applications.slice(0, 3).map((application) => <span key={application}>{application}</span>)}</div>
            <Link className="text-link" href={brand.href}>Explore {brand.name} <span aria-hidden="true">↗</span></Link>
          </div>
        </article>)}</div>
        <p className="catalogue-disclosure">No brand stock list or prices are shown. Product availability, color, finish, formats and technical details are confirmed for each requested range and location.</p>
      </div>
    </section>

    <section className="brand-next-steps"><div className="section-shell brand-next-steps__inner"><div><p className="eyebrow">Bring the material into context</p><h2>Start with the space and the specification.</h2><p>Share your application, approximate quantity, location and preferred finish. The product range and its suitability can then be checked against current manufacturer information.</p></div><Link className="button button-light" href="/requirement-builder/">Build a project brief <span aria-hidden="true">↗</span></Link></div></section>
  </main>;
}

export function ArchitecturalBrandPage({ brand }: { brand: ArchitecturalBrand }) {
  return <main className="architectural-page">
    <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: `${brand.name} architectural surfaces`, description: `${brand.summary} Product range and availability are confirmed on enquiry.`, url: `${siteUrl}${brand.href}` }} />
    <section className="brand-detail-hero">
      <div className="breadcrumb"><Link href="/">Home</Link> / <Link href="/shop/sintered-stone/">Architectural surfaces</Link> / {brand.name}</div>
      <div className="brand-detail-hero__grid"><div>
        <p className="eyebrow">Architectural surfaces · {brand.producer}</p>
        <h1>{brand.name}<em> for the project.</em></h1>
        <p className="brand-detail-hero__intro">{brand.summary}</p>
        <p className="brand-detail-hero__category"><span>Material category</span><strong>{brand.category}</strong></p>
        <div className="hero-actions"><Link className="button button-dark" href={brandEnquiry(brand)}>Request range &amp; availability <span aria-hidden="true">↗</span></Link></div>
      </div><div className="brand-detail-hero__aside"><figure className="brand-detail-hero__image"><Image src={brand.image.src} alt={brand.image.alt} fill sizes="(max-width: 900px) 100vw, 45vw" /></figure></div></div>
    </section>
    {brand.collections && brand.collections.length > 0 && (() => {
      const ranges = brand.collections.filter((collection) => collection.colours && collection.colours.length > 0);
      const singles = brand.collections.filter((collection) => !(collection.colours && collection.colours.length > 0));
      return <section className="brand-collections" aria-label={`${brand.name} collections`}>
        <div className="section-shell">
          <div className="section-intro"><div><p className="eyebrow">Catalogue reference</p><h2>The collection, colour by colour.</h2></div><p>Collection and colourway names as listed in the manufacturer’s current general catalogue. Colour, finish, format and availability are confirmed per project enquiry.</p></div>
          {ranges.length > 0 && <div className="brand-collection-ranges">{ranges.map((collection) => (
            <article key={collection.name} className="brand-collection-card brand-collection-card--range">
              {collection.image && <div className="brand-collection-card__media"><Image src={collection.image} alt={`${brand.name} ${collection.name} collection`} fill sizes="(max-width: 760px) 90vw, 420px" /></div>}
              <div className="brand-collection-card__body"><h3>{collection.name}</h3>{collection.colours && <p>{collection.colours.join(" · ")}</p>}</div>
            </article>
          ))}</div>}
          <div className="brand-collection-grid">{singles.map((collection) => (
            <article key={collection.name} className="brand-collection-card">
              {collection.image && <div className="brand-collection-card__media"><Image src={collection.image} alt={`${brand.name} ${collection.name} collection surface`} fill sizes="(max-width: 760px) 30vw, 190px" /></div>}
              <h3>{collection.name}</h3>
            </article>
          ))}</div>
        </div>
      </section>;
    })()}
    <section className="brand-applications"><div className="section-shell"><div className="section-intro"><div><p className="eyebrow">A project-led enquiry</p><h2>What will the surface do?</h2></div><p>Application choices are enquiry prompts, not a guarantee of suitability. Check each product’s manufacturer documentation and fabrication requirements.</p></div><div className="brand-application-links">{brand.applications.map((application, index) => <Link key={application} href={brandEnquiry(brand, application)}><span>0{index + 1}</span><strong>{application}</strong><b aria-hidden="true">↗</b></Link>)}</div></div></section>
    <p className="catalogue-disclosure brand-detail-disclosure">Brand names are used for identification and discovery. This page does not claim authorization, current stock, pricing or supply terms from the manufacturer.</p>
  </main>;
}
