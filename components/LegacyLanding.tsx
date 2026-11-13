import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductCardStrip } from "@/components/ProductCardStrip";
import { CategoryMediaStrip } from "@/components/CategoryMediaStrip";
import { categoryForFamily, getPublishedProductsByCategory } from "@/lib/products/db";

export type LandingConfig = {
  title: string;
  description: string;
  eyebrow?: string;
  intro?: string;
  family?: string;
  bullets?: string[];
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
  related?: { href: string; label: string }[];
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

const defaultRelated = [
  { href: "/all-materials/", label: "All materials" },
  { href: "/shop/sintered-stone/", label: "Architectural surfaces" },
  { href: "/requirement-builder/", label: "Requirement builder" },
];

export async function LegacyLanding({ config }: { config: LandingConfig }) {
  const category = config.family ? categoryForFamily(config.family) : null;
  const products = category ? await getPublishedProductsByCategory(category) : [];
  return (
    <main className="legacy-page">
      <section className="legacy-hero">
        <div className="legacy-hero__copy">
          <div className="breadcrumb"><Link href="/">Home</Link> / {config.title}</div>
          <p className="eyebrow">{config.eyebrow ?? "Crystal Stones · Material library"}</p>
          <h1>{config.title}</h1>
          <p className="legacy-hero__intro">{config.intro ?? config.description}</p>
          <div className="hero-actions">
            <Link className="button button-dark" href="/requirement-builder/">Build your requirement <span aria-hidden="true">↗</span></Link>
            <Link className="button button-outline" href="/all-materials/">Explore materials</Link>
          </div>
        </div>
        <figure className="legacy-hero__image">
          <Image
            src={config.image ?? "/images/marble-sourcing.webp"}
            alt={config.imageAlt ?? "Illustrative stone material study"}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 46vw"
          />
          <figcaption>{config.imageCaption ?? "Illustrative material reference · Not a representation of current stock"}</figcaption>
        </figure>
      </section>

      <section className="section">
        <div className="section-inner legacy-grid">
          <div>
            <p className="eyebrow">Specify with confidence</p>
            <h2>Start with the project, then confirm the material.</h2>
            <p>Material suitability depends on application, finish, thickness, slab dimensions, fabrication and installation conditions. Share what you know; the final product and availability are confirmed before purchase.</p>
            <p>This page is a starting point, not a stock list. Use it to identify the questions worth asking, then let the team verify the material for your project.</p>
            <div className="hero-actions">
              <Link className="button button-dark" href="/requirement-builder/">Build your requirement <span aria-hidden="true">↗</span></Link>
              <Link className="text-link" href="/contact-us/">Ask a question</Link>
            </div>
          </div>
          <div className="legacy-panel">
            <h3>Useful details to include</h3>
            <ul className="feature-list">
              {(config.bullets ?? ["Application and project location", "Approximate area in square feet or square metres", "Preferred colour, finish and thickness", "Slab or tile dimensions and delivery timing"]).map((item) => <li key={item}>{item}</li>)}
            </ul>
            <Link className="text-link" href="/how-it-works/">See how the process works <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      {products.length > 0 && <ProductCardStrip products={products} heading={`${config.title} products from the team.`} copy="Latest catalogue entries added by the Crystal Stones team. Product specification and availability are confirmed on enquiry." />}

      {category && <CategoryMediaStrip category={category} heading={`${config.title}, photographed by the team.`} copy="Real photographs of this surface category published by Crystal Stones. Product specification and availability are confirmed on enquiry." />}

      <section className="legacy-next">
        <div className="section-shell">
          <p className="eyebrow">Keep exploring</p>
          <div className="legacy-next__grid">
            {(config.related ?? defaultRelated).map((link) => (
              <Link href={link.href} key={link.href}>
                <span>{link.label}</span>
                <b aria-hidden="true">↗</b>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
