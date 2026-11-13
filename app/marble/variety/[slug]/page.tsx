import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PublishedMediaGallery } from "@/components/PublishedMediaGallery";
import { getMarbleVariety, importedMarbleVarieties, varietyApplicationImage } from "@/lib/imported-marble";
import { siteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return importedMarbleVarieties.map((item) => ({ slug: item.slug }));
}

function enquiryHref(name: string, notes?: string) {
  const query = new URLSearchParams({ material: "Marble", stone: name });
  if (notes) query.set("notes", notes);
  return `/requirement-builder/?${query.toString()}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getMarbleVariety(slug);
  if (!item) return {};
  return {
    title: { absolute: item.seoTitle },
    description: item.seoDescription,
    alternates: { canonical: `/marble/variety/${item.slug}/` },
    openGraph: { title: item.seoTitle, description: item.seoDescription, images: [{ url: item.image.src, alt: item.image.alt }] },
  };
}

export default async function MarbleVarietyPage({ params }: Props) {
  const { slug } = await params;
  const item = getMarbleVariety(slug);
  if (!item) notFound();
  const originLabel = item.origin.country ? [item.origin.country, item.origin.region].filter(Boolean).join(" · ") : "Confirm origin for the requested lot";
  const familyLabel = item.familyVerified ? item.stoneFamily.charAt(0).toUpperCase() + item.stoneFamily.slice(1) : "Confirm stone family for the requested lot";
  const related = importedMarbleVarieties.filter((other) => other.slug !== item.slug && other.origin.suggestedCountries.some((country) => item.origin.suggestedCountries.includes(country))).slice(0, 3);
  const applicationImage = varietyApplicationImage(item);

  return <main className="marble-page">
    <JsonLd data={{
      "@context": "https://schema.org",
      "@type": "Product",
      name: item.name,
      description: item.description,
      image: new URL(item.image.src, siteUrl).toString(),
      category: "Imported natural stone",
      ...(item.familyVerified ? { material: familyLabel } : {}),
      ...(item.origin.country ? { additionalProperty: [{ "@type": "PropertyValue", name: "Country of origin reference", value: item.origin.country }] } : {}),
      url: `${siteUrl}/marble/variety/${item.slug}/`,
    }} />
    <section className="variety-detail">
      <div className="breadcrumb"><Link href="/">Home</Link> / <Link href="/marble/">Imported natural marble</Link> / {item.name}</div>
      <div className="variety-detail__grid">
        <PublishedMediaGallery contentType="marble_variety" slug={item.slug} fallbackSrc={item.image.src} fallbackAlt={item.image.alt} fallbackNote={item.image.usage} className="variety-detail__visual" />
        <div className="variety-detail__copy">
          <p className="eyebrow">Imported marble · Variety reference</p>
          <h1>{item.name}</h1>
          <p className="variety-detail__intro">{item.description}</p>
          <div className="variety-status"><span className={item.origin.status === "reference-verified" ? "status-mark status-mark--reference" : "status-mark"}>{item.origin.status === "reference-verified" ? "Origin reference found" : "Origin requires verification"}</span><p>{item.origin.note}</p></div>
          <div className="spec-list variety-specs">
            <div className="spec-row"><span>Country / region</span><b>{originLabel}</b></div>
            <div className="spec-row"><span>Stone family</span><b>{familyLabel}</b></div>
            <div className="spec-row"><span>Colour direction</span><b>{item.colours.join(", ") || "Confirm from current slab"}</b></div>
            <div className="spec-row"><span>Visual pattern</span><b>{item.patterns.join(", ") || "Confirm from current slab"}</b></div>
            <div className="spec-row"><span>Available finishes</span><b>{item.finishes.join(", ") || "Confirm for requested lot"}</b></div>
            <div className="spec-row"><span>Typical applications</span><b>{item.applications.join(", ") || "Confirm for product and project"}</b></div>
            <div className="spec-row"><span>Availability</span><b>Request price &amp; availability</b></div>
          </div>
          {item.familyNote && <p className="variety-detail__note">{item.familyNote}</p>}
          <div className="variety-detail__actions">
            <Link className="button button-dark" href={enquiryHref(item.name)}>Request price &amp; availability <span aria-hidden="true">↗</span></Link>
            <Link className="button button-outline" href={enquiryHref(item.name, `Please send current slab photographs and advise on a slab-selection appointment for ${item.name}.`)}>Request slab photos or appointment <span aria-hidden="true">↗</span></Link>
          </div>
          <p className="catalogue-disclosure">No stock or price is represented here. Availability is enquiry-based and must be checked for each lot.</p>
        </div>
      </div>
      <section className="application-showcase">
        <div className="application-showcase__intro"><p className="eyebrow">Seen in a space</p><h2>Applied in an interior.</h2><p>Typical settings for {item.applications.length ? item.applications.join(", ").toLowerCase() : "this family"} — request slab photographs to confirm the actual stone.</p></div>
        <figure><div className="application-showcase__media"><Image src={applicationImage.src} alt={applicationImage.alt} fill sizes="(max-width: 900px) 92vw, 1040px" /></div><figcaption>Illustrative interior · Shown to demonstrate the setting, not this specific variety.</figcaption></figure>
      </section>
      <div className="variety-detail__support">
        <section><p className="eyebrow">Care &amp; specification</p><h2>Confirm the material before specifying.</h2><p>{item.careNotes}</p><p>Technical documents: {item.technicalDocuments.length ? item.technicalDocuments.map((doc) => <a className="text-link" key={doc.href} href={doc.href}>{doc.label}</a>) : "No verified technical documents have been supplied for this starter entry."}</p></section>
        <section className="variety-detail__research"><p className="eyebrow">Data status</p><h2>Research reference, not a stock claim.</h2><p>Origin reference last reviewed: {item.origin.verifiedAt ?? "Pending"}. Current availability last verified: {item.availabilityVerifiedAt ?? "Not confirmed"}.</p>{item.origin.sourceUrls.length > 0 && <details><summary>View origin research references</summary><ul>{item.origin.sourceUrls.map((url) => <li key={url}><a href={url} target="_blank" rel="noreferrer">Open reference source <span aria-hidden="true">↗</span></a></li>)}</ul></details>}</section>
      </div>
      {related.length > 0 && <section className="variety-related"><p className="eyebrow">Continue exploring</p><h2>Related variety references</h2><div>{related.map((other) => <Link href={`/marble/variety/${other.slug}/`} key={other.slug}>{other.name}<span aria-hidden="true">↗</span></Link>)}</div></section>}
      <div className="variety-back"><Link className="text-link" href="/marble/">← Back to imported marble catalogue</Link></div>
    </section>
  </main>;
}
