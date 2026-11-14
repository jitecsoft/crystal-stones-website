import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Crystal Stones",
  description: "Learn about Crystal Stones and begin a material requirement for your next architectural or interior project.",
  alternates: { canonical: "/about/" }
};

const stats = [
  ["1991", "Trading since"],
  ["30+", "Years of stone experience"],
  ["2", "Catalogue directions — natural & engineered"],
  ["India", "Sourcing reach, with international enquiry"],
];

const pillars = [
  { number: "01", title: "Natural stone", copy: "Imported marble, granite, onyx and travertine references, selected with origin and lot-level detail in view." },
  { number: "02", title: "Architectural surfaces", copy: "Neolith and a multi-brand surface library for projects that need a consistent, engineered material direction." },
  { number: "03", title: "A usable brief", copy: "Application, area, finish and delivery captured early, so the quotation conversation starts in the right place." },
];

export default function AboutPage() {
  return <main className="about-page">
    <section className="about-hero">
      <div>
        <div className="breadcrumb"><Link href="/">Home</Link> / About</div>
        <p className="eyebrow">About Crystal Stones</p>
        <h1>Material choices deserve <em>clarity.</em></h1>
        <p className="about-hero__intro">Crystal Stones helps clients explore stone and surface possibilities for homes, interiors and commercial projects. The aim of this website is to make material discovery, requirement definition and quotation requests simpler.</p>
        <div className="hero-actions"><Link className="button button-dark" href="/requirement-builder/">Build your requirement <span aria-hidden="true">↗</span></Link><Link className="button button-outline" href="/all-materials/">Explore materials</Link></div>
      </div>
      <figure className="about-hero__image">
        <Image src="/images/marble-sourcing.webp" alt="Illustrative marble slabs arranged in a materials library" fill priority sizes="(max-width: 900px) 100vw, 46vw" />
        <figcaption className="about-hero__caption">Illustrative stone library · Not a representation of current stock</figcaption>
      </figure>
    </section>

    <section className="section" style={{ paddingTop: 0 }}>
      <div className="section-shell">
        <div className="about-stats">{stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
      </div>
    </section>

    <section className="section split-section">
      <div className="section-inner about-story">
        <div>
          <p className="eyebrow">Our approach</p>
          <h2>From a visual idea to a usable brief.</h2>
          <p>Material selection involves more than colour. Format, finish, thickness, application, cutting requirements and delivery destination all affect the final recommendation.</p>
          <p>This website is structured to capture those details earlier, so the conversation can start with a clearer project brief rather than a series of open questions.</p>
          <Link className="button button-dark" href="/requirement-builder/">Build your requirement <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="about-story__list">
          <div><span>01</span><div><strong>Material discovery for trade and private buyers</strong><small>Explore stone families, varieties and architectural surface directions without treating placeholder imagery as stock.</small></div></div>
          <div><span>02</span><div><strong>Area-based requirement capture</strong><small>Share measured area, wastage allowance, dimensions and finish so the quantity conversation is grounded.</small></div></div>
          <div><span>03</span><div><strong>India and international enquiry paths</strong><small>Tell us the delivery destination and timeline; availability and logistics are confirmed for the project.</small></div></div>
          <div><span>04</span><div><strong>Specifications confirmed before quotation</strong><small>Origin, product family, technical information and current lot are checked with the supplier.</small></div></div>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="section-shell">
        <div className="section-intro"><div><p className="eyebrow">What we bring together</p><h2>A project-led material library.</h2></div><p>Two complementary directions, connected by the same requirement-led approach.</p></div>
        <div className="process-grid">{pillars.map((pillar) => <article key={pillar.number}><span className="process-grid__number">{pillar.number}</span><h3>{pillar.title}</h3><p>{pillar.copy}</p></article>)}</div>
      </div>
    </section>
  </main>;
}
