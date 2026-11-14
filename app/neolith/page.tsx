import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Neolith Architectural Surfaces",
  description: "Explore Neolith as a flagship architectural surface offering. Request current collection information, product-specific technical documentation and a project quotation.",
  alternates: { canonical: "/neolith/" },
};

const applications = ["Kitchen countertop", "Wall cladding / feature wall", "Flooring", "Bathroom / vanity", "Facade / exterior"];
const briefLink = (application?: string) => {
  const params = new URLSearchParams({ material: "Porcelain / sintered stone", stone: "Neolith" });
  if (application) params.set("application", application);
  return `/requirement-builder/?${params.toString()}`;
};

export default function NeolithPage() {
  return <main className="neolith-page">
    <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Neolith Architectural Surfaces", description: "Project enquiries for the Neolith flagship architectural surface offering. Product range, colour, finish, technical data and availability are confirmed against current product information.", url: `${siteUrl}/neolith/` }} />
    <section className="neolith-hero">
      <div className="breadcrumb"><Link href="/">Home</Link> / Neolith</div>
      <div className="neolith-hero__grid">
        <div className="neolith-hero__copy"><p className="eyebrow">Flagship brand offering · Neolith</p><h1>Surface choices, <em>made for the project.</em></h1><p>Begin with the space, the application and the design direction. We’ll help route your enquiry to current Neolith collection information and the product-specific details needed for a confident specification.</p><div className="neolith-hero__actions"><Link className="button button-dark" href={briefLink()}>Request a Neolith project quote <span aria-hidden="true">↗</span></Link><Link className="button button-outline" href="#collection-data">Explore collection information</Link></div></div>
        <figure className="neolith-hero__image"><Image src="/images/neolith-interior.webp" alt="Illustrative kitchen interior with a large matte architectural surface" fill priority sizes="(max-width: 800px) 100vw, 54vw" /><figcaption>Illustrative development imagery · Not a Neolith product photograph</figcaption></figure>
      </div>
    </section>

    <section className="neolith-collection" id="collection-data">
      <div className="section-shell neolith-collection__inner">
        <div><p className="eyebrow">Collection discovery</p><h2>Start with a design direction.<br /><em>Confirm the exact surface.</em></h2><p>This project does not yet include an approved Neolith product catalogue. Product names, colours, finishes, formats and technical documents will be added after the current brand data is supplied and verified.</p></div>
        <div className="neolith-collection__status"><span className="status-mark">Catalogue data pending</span><h3>What can be confirmed for your brief</h3><ul><li>Current collection and exact product reference</li><li>Available colour, finish, format and thickness</li><li>Product-specific technical documents and intended application</li><li>Current lot, lead time and quotation</li></ul><Link className="text-link" href={briefLink()}>Request the current collection information <span aria-hidden="true">↗</span></Link></div>
      </div>
    </section>

    <section className="neolith-applications" aria-labelledby="neolith-applications-title">
      <div className="section-shell">
        <div className="section-intro"><div><p className="eyebrow">Application first</p><h2 id="neolith-applications-title">Where are you considering it?</h2></div><p>Product suitability varies by collection and application. Share your intended use so the relevant technical information can be checked.</p></div>
        <div className="neolith-application-links">{applications.map((application, i) => <Link href={briefLink(application)} key={application}><span>0{i + 1}</span><strong>{application}</strong><b aria-hidden="true">↗</b></Link>)}</div>
      </div>
    </section>

    <p className="catalogue-disclosure neolith-disclosure">Neolith is the named brand direction supplied for this project. This page does not represent a complete brand catalogue or confirm any specific product, stock level or technical property.</p>
  </main>;
}
