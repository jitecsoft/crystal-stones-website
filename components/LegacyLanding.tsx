import type { Metadata } from "next";
import Link from "next/link";

export type LandingConfig = {
  title: string;
  description: string;
  eyebrow?: string;
  intro?: string;
  family?: string;
  bullets?: string[];
};

export function landingMetadata(config: LandingConfig): Metadata {
  return {
    title: config.title,
    description: config.description,
    alternates: { canonical: `/${configPath(config.title)}/` },
  };
}

function configPath(title: string) {
  const known: Record<string, string> = {
    "Marble": "marble", "Onyx": "onyx", "Travertine": "travertine", "Sandstone": "sandstone",
    "Quartz surfaces": "all-materials/quartz", "Ceramic surfaces": "all-materials/ceramic",
    "Porcelain surfaces": "shop/porcelain", "Composite surfaces": "shop/composite",
    "Sintered stone": "shop/sintered-stone", "Caesarstone": "all-materials/quartz/caesarstone",
    "How it works": "how-it-works", "Projects": "projects", "FAQ": "faq", "Contact Crystal Stones": "contact-us", "Resources": "blog"
  };
  return known[title] ?? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function LegacyLanding({ config }: { config: LandingConfig }) {
  return <main className="legacy-page">
    <section className="page-hero">
      <div className="breadcrumb"><Link href="/">Home</Link> / {config.title}</div>
      <div className="eyebrow">{config.eyebrow ?? "Crystal Stones · Material library"}</div>
      <h1>{config.title}</h1>
      <p>{config.intro ?? config.description}</p>
      <div className="hero-actions"><Link className="button button-dark" href="/requirement-builder/">Build your requirement ↗</Link><Link className="button button-outline" href="/all-materials/">Explore materials</Link></div>
    </section>
    <section className="section"><div className="section-inner split-grid">
      <div><div className="eyebrow">Specify with confidence</div><h2>Start with the project, then confirm the material.</h2><p>Material suitability depends on application, finish, thickness, slab dimensions, fabrication and installation conditions. Share what you know; the final product and availability should be confirmed before purchase.</p></div>
      <div className="legacy-panel"><h3>Useful details to include</h3><ul className="feature-list">{(config.bullets ?? ["Application and project location", "Approximate area in square feet or square metres", "Preferred colour, finish and thickness", "Slab or tile dimensions and delivery timing"]).map((item) => <li key={item}>{item}</li>)}</ul></div>
    </div></section>
  </main>;
}
