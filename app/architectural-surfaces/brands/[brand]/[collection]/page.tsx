import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { architecturalBrands, brandCollectionSlug, getArchitecturalBrand, getBrandCollection, getBrandCollections, type ArchitecturalBrand } from "@/lib/architectural-brands";
import { siteUrl } from "@/lib/site";

export const dynamicParams = true;

export function generateStaticParams() {
  return architecturalBrands.flatMap((brand) =>
    getBrandCollections(brand).map((collection) => ({ brand: brand.slug, collection: brandCollectionSlug(collection.name) }))
  );
}

function collectionIntro(brand: ArchitecturalBrand, collectionName: string, colours?: string[]) {
  const colourNote = colours && colours.length ? ` The catalogue shows this range in ${colours.length} colourways — ${colours.join(", ")}.` : "";
  return `${collectionName} is listed in the ${brand.name} catalogue (${brand.producer}) under ${brand.category.toLowerCase()}.${colourNote} The exact surface, current lot, finish, thickness and available formats are confirmed for your project on enquiry.`;
}

/** Interior image used to show how the surface family is used. Always labelled illustrative. */
function interiorImage(brand: ArchitecturalBrand) {
  const category = brand.category.toLowerCase();
  if (category.includes("porcelain") || category.includes("ceramic")) {
    return { src: "/images/catalogue/materials/pexels-porcelain-application.webp", alt: "Illustrative interior with large-format porcelain surfaces on walls and floors" };
  }
  return { src: "/images/neolith-interior.webp", alt: "Illustrative kitchen interior with a stone island and worktops" };
}

function collectionEnquiry(brand: ArchitecturalBrand, collectionName: string, application?: string) {
  const params = new URLSearchParams({ material: brand.category, stone: `${brand.name} ${collectionName}` });
  if (application) params.set("application", application);
  params.set("notes", `Please confirm the current ${brand.name} ${collectionName} range, finish, technical documents, formats and regional availability.`);
  return `/requirement-builder/?${params.toString()}`;
}

export async function generateMetadata({ params }: { params: Promise<{ brand: string; collection: string }> }): Promise<Metadata> {
  const { brand: brandSlug, collection: collectionSlug } = await params;
  const brand = getArchitecturalBrand(brandSlug);
  if (!brand) return { title: "Collection not found" };
  const collection = getBrandCollection(brand, collectionSlug);
  if (!collection) return { title: "Collection not found" };
  const image = collection.image ?? brand.image.src;
  const description = `${collection.name} from the ${brand.name} range (${brand.producer}). ${collection.colours?.length ? `Colourways: ${collection.colours.join(", ")}. ` : ""}Availability, finish, formats and technical details are confirmed on enquiry.`;
  return {
    title: `${collection.name} — ${brand.name}`,
    description,
    alternates: { canonical: `/architectural-surfaces/brands/${brand.slug}/${collectionSlug}/` },
    openGraph: { title: `${collection.name} — ${brand.name}`, description, images: [{ url: image, alt: `${brand.name} ${collection.name} collection` }] }
  };
}

export default async function BrandCollectionPage({ params }: { params: Promise<{ brand: string; collection: string }> }) {
  const { brand: brandSlug, collection: collectionSlug } = await params;
  const brand = getArchitecturalBrand(brandSlug);
  if (!brand) notFound();
  const collection = getBrandCollection(brand, collectionSlug);
  if (!collection) notFound();

  const hero = collection.image ?? brand.image.src;
  const interior = interiorImage(brand);
  const intro = collectionIntro(brand, collection.name, collection.colours);
  const specs: [string, string][] = [
    ["Brand", brand.name],
    ["Producer", brand.producer],
    ["Material type", brand.category],
    ["Colourways", collection.colours?.length ? collection.colours.join(" · ") : "Confirm on enquiry"],
    ["Thickness & formats", "Confirm against the current catalogue"],
    ["Finish", "Confirm on enquiry"],
    ["Typical applications", brand.applications.join(", ")],
    ["Availability", "Request price & availability"]
  ];

  return <main className="collection-page">
    <JsonLd data={{
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${brand.name} ${collection.name}`,
      category: brand.category,
      description: intro,
      image: `${siteUrl}${hero}`,
      brand: { "@type": "Brand", name: brand.name },
      manufacturer: { "@type": "Organization", name: brand.producer },
      url: `${siteUrl}/architectural-surfaces/brands/${brand.slug}/${collectionSlug}/`
    }} />

    <section className="collection-hero">
      <div className="section-shell collection-hero__grid">
        <div>
          <div className="breadcrumb"><Link href="/">Home</Link> / <Link href="/shop/sintered-stone/">Architectural surfaces</Link> / <Link href={brand.href}>{brand.name}</Link> / {collection.name}</div>
          <p className="eyebrow">{brand.name} · {brand.category}</p>
          <h1>{collection.name}</h1>
          <p className="collection-hero__intro">{intro}</p>
          {collection.colours && collection.colours.length > 0 && <p className="collection-hero__colours"><span>Colourways</span><strong>{collection.colours.join(" · ")}</strong></p>}
          <div className="hero-actions">
            <Link className="button button-dark" href={collectionEnquiry(brand, collection.name)}>Request this collection <span aria-hidden="true">↗</span></Link>
            <Link className="button button-outline" href={brand.href}>See the {brand.name} range <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <figure className="collection-hero__media">
          <Image src={hero} alt={`${brand.name} ${collection.name} collection`} fill priority sizes="(max-width: 900px) 100vw, 48vw" />
          <figcaption>{collection.image ? `Catalogue image of the ${collection.name} collection.` : `Illustrative image for the ${brand.name} range.`}</figcaption>
        </figure>
      </div>
    </section>

    <section className="collection-specs">
      <div className="section-shell collection-specs__grid">
        <div>
          <p className="eyebrow">Specification</p>
          <h2>What we confirm before you order.</h2>
        </div>
        <div className="spec-list">
          {specs.map(([label, value]) => <div className="spec-row" key={label}><span>{label}</span><b>{value}</b></div>)}
        </div>
      </div>
    </section>

    <section className="application-showcase">
      <div className="section-shell">
        <div className="application-showcase__intro">
          <p className="eyebrow">Seen in a space</p>
          <h2>Applied in an interior.</h2>
          <p>Typical settings for {brand.category.toLowerCase()} — {brand.applications.slice(0, 3).join(", ").toLowerCase()}. Request material photographs to confirm the actual stone for your project.</p>
        </div>
        <figure>
          <div className="application-showcase__media"><Image src={interior.src} alt={interior.alt} fill sizes="(max-width: 900px) 92vw, 1040px" /></div>
          <figcaption>Illustrative interior · Shown to demonstrate the setting, not this specific collection.</figcaption>
        </figure>
      </div>
    </section>

    <section className="collection-applications">
      <div className="section-shell">
        <div className="section-intro">
          <div><p className="eyebrow">Where it goes</p><h2>Applications for {collection.name}.</h2></div>
          <p>Application choices are enquiry prompts, not a guarantee of suitability. Check the product&rsquo;s manufacturer documentation and fabrication requirements.</p>
        </div>
        <div className="brand-application-links">
          {brand.applications.map((application, index) => (
            <Link key={application} href={collectionEnquiry(brand, collection.name, application)}>
              <span>0{index + 1}</span><strong>{application}</strong><b aria-hidden="true">↗</b>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <p className="catalogue-disclosure brand-detail-disclosure">Brand and collection names are used for identification and discovery. This page does not claim authorization, current stock, pricing or supply terms from the manufacturer.</p>
  </main>;
}
