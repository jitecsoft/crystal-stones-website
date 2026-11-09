import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { materials } from "@/lib/materials";
import { MaterialCard } from "@/components/MaterialCard";

export type FamilyFact = { label: string; value: string };
export type FamilyNote = { number: string; title: string; copy: string };
export type FamilyApplication = { label: string; value: string };

export type FamilyLandingConfig = {
  family: string;
  shortName: string;
  eyebrow: string;
  title: ReactNode;
  intro: string;
  heroImage: string;
  heroAlt: string;
  heroCaption: string;
  facts: FamilyFact[];
  headline: string;
  sectionCopy: string;
  notes: FamilyNote[];
  applications: FamilyApplication[];
  quoteHref: string;
  related: { href: string; label: string }[];
};

export function FamilyLanding({ config }: { config: FamilyLandingConfig }) {
  const items = materials.filter((material) => material.family === config.family);
  return (
    <main className="family-page">
      <section className="family-hero">
        <div className="family-hero__copy">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <Link href="/all-materials/">Materials</Link> / {config.shortName}
          </div>
          <p className="eyebrow">{config.eyebrow}</p>
          <h1>{config.title}</h1>
          <p className="family-hero__intro">{config.intro}</p>
          <div className="hero-actions">
            <Link className="button button-dark" href={config.quoteHref}>Request a quotation <span aria-hidden="true">↗</span></Link>
            <Link className="button button-outline" href="/all-materials/">Explore all materials</Link>
          </div>
          <dl className="family-facts">
            {config.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure className="family-hero__image">
          <Image src={config.heroImage} alt={config.heroAlt} fill priority sizes="(max-width: 900px) 100vw, 48vw" />
          <figcaption>{config.heroCaption}</figcaption>
        </figure>
      </section>

      <section className="family-notes" aria-label="What to confirm">
        <div className="section-shell family-notes__grid">
          {config.notes.map((note) => (
            <article key={note.number}>
              <span>{note.number}</span>
              <h2>{note.title}</h2>
              <p>{note.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section family-library">
        <div className="section-shell">
          <div className="section-intro">
            <div><p className="eyebrow">Reference directions</p><h2>{config.headline}</h2></div>
            <p>{config.sectionCopy}</p>
          </div>
          {items.length > 0 ? (
            <div className="material-grid">
              {items.map((material) => <MaterialCard material={material} key={material.slug} />)}
            </div>
          ) : (
            <div className="catalogue-empty">
              <p className="eyebrow">Catalogue in progress</p>
              <h2>Selected references for this family are being prepared.</h2>
              <p>Photography and specifications are confirmed before a material is published. Share the application and look you have in mind and the team will shortlist suitable current options.</p>
              <div className="hero-actions">
                <Link className="button button-dark" href={config.quoteHref}>Request guidance <span aria-hidden="true">↗</span></Link>
                <Link className="button button-outline" href="/marble/">Browse imported marble</Link>
              </div>
            </div>
          )}
          <p className="note">Illustrative references only. Confirm lot identity, origin, technical suitability and availability before specification.</p>
        </div>
      </section>

      <section className="family-applications">
        <div className="section-shell">
          <div className="section-intro">
            <div><p className="eyebrow">Where it works</p><h2>Start with the application.</h2></div>
            <p>Suitability depends on format, finish, thickness and exposure. Share the intended use and we will confirm the right direction.</p>
          </div>
          <div className="family-application-links">
            {config.applications.map((application) => (
              <Link href={`/requirement-builder/?${new URLSearchParams({ material: config.family, application: application.value }).toString()}`} key={application.label}>
                <span aria-hidden="true">↗</span>
                <strong>{application.label}</strong>
                <b>Build a brief</b>
              </Link>
            ))}
          </div>
          <div className="family-related">
            <span>Related</span>
            {config.related.map((link) => <Link href={link.href} key={link.href}>{link.label} <span aria-hidden="true">↗</span></Link>)}
          </div>
        </div>
      </section>

      <section className="family-cta">
        <div className="section-shell family-cta__inner">
          <div>
            <p className="eyebrow">Bring it into the project</p>
            <h2>Share the space, area and finish you have in mind.</h2>
            <p>Origin, slab condition and current availability are confirmed for each requirement before a quotation is prepared.</p>
          </div>
          <div className="family-cta__actions">
            <Link className="button button-light" href={config.quoteHref}>Open the requirement builder <span aria-hidden="true">↗</span></Link>
            <Link className="home-text-link" href="/contact-us/">Contact Crystal Stones</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
