import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects",
  description: "A place for verified Crystal Stones project references, applications and material choices. Project photography and details are published only when accurate and approved.",
  alternates: { canonical: "/projects/" }
};

const projects = [
  {
    index: "01",
    type: "Residential · Kitchen",
    title: "A quiet, hard-working island.",
    copy: "A sintered or natural stone island with a matching splashback, considered for heat, staining and daily use rather than appearance alone.",
    materials: ["Neolith", "Quartzite", "Granite"],
    image: "/images/neolith-interior.webp",
    alt: "Illustrative contemporary kitchen with a stone island",
    application: "Kitchen countertop",
  },
  {
    index: "02",
    type: "Residential · Bathroom",
    title: "Warm stone, wet-area discipline.",
    copy: "Travertine or marble surfaces detailed around vanities and shower walls, with slip resistance, sealing and maintenance planned from the start.",
    materials: ["Travertine", "Marble"],
    image: "/images/home-hero.webp",
    alt: "Illustrative warm-toned interior with a full-height stone wall",
    application: "Bathroom / vanity",
  },
  {
    index: "03",
    type: "Commercial · Facade",
    title: "A surface that meets the street.",
    copy: "Large-format cladding selected for exposure, fixing, panel size and a consistent architectural reading across the elevation.",
    materials: ["Neolith", "Porcelain", "Sandstone"],
    image: "/images/uploads/neolith-facade-reference.webp",
    alt: "Illustrative architectural facade with large-format stone cladding",
    application: "Facade / exterior",
  },
  {
    index: "04",
    type: "Hospitality · Feature",
    title: "One expressive gesture.",
    copy: "A bookmatched or backlit feature wall where the stone is allowed to lead, with slab review and fabrication treated as part of the design.",
    materials: ["Marble", "Onyx"],
    image: "/images/catalogue/imported-marble/marble-feature-hero.webp",
    alt: "Illustrative bookmatched marble feature wall in a warm interior",
    application: "Wall cladding / feature wall",
  },
];

const principles = [
  ["Verified before published", "Project details, material choices and photography are published only when accurate and approved for use."],
  ["Application first", "A project is described by how the material performs and where it sits, not by a product name alone."],
  ["Illustrative, clearly labelled", "Development imagery on this page is a reference for direction and does not imply a completed Crystal Stones project."],
];

export default function ProjectsPage() {
  return (
    <main className="projects-page">
      <section className="page-hero projects-hero">
        <div className="breadcrumb"><Link href="/">Home</Link> / Projects</div>
        <p className="eyebrow">Projects & applications</p>
        <h1>Stone in the context of a <em>real space.</em></h1>
        <p>A working record of the applications and material directions Crystal Stones is set up to support. Verified project photography and details will be added as they are approved.</p>
        <div className="hero-actions">
          <Link className="button button-dark" href="/requirement-builder/">Start a project brief <span aria-hidden="true">↗</span></Link>
          <Link className="button button-outline" href="/all-materials/">Explore materials</Link>
        </div>
      </section>

      <section className="section projects-intro-section">
        <div className="section-shell projects-feature">
          <figure className="projects-feature__image">
            <Image src="/images/catalogue/imported-marble/marble-feature-hero.webp" alt="Illustrative bookmatched marble wall and island in a warm contemporary interior" fill sizes="(max-width: 900px) 100vw, 52vw" />
            <figcaption>Illustrative material study · Not a completed Crystal Stones project</figcaption>
          </figure>
          <div className="projects-feature__copy">
            <p className="eyebrow">A considered record</p>
            <h2>References that respect the project.</h2>
            <p>Material photography can inspire a direction, but it cannot confirm a slab, an origin or an installation detail. This page separates those ideas: it shows the applications we support, and publishes specific projects only when the information and image rights are verified.</p>
            <div className="projects-feature__notes">
              {principles.map(([title, copy]) => (
                <div key={title}>
                  <strong>{title}</strong>
                  <small>{copy}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section projects-grid-section">
        <div className="section-shell">
          <div className="section-intro">
            <div><p className="eyebrow">Application directions</p><h2>Where the material does the work.</h2></div>
            <p>Four common project contexts. Use them as a starting point for the requirement, not as a fixed package.</p>
          </div>
          <div className="projects-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.index}>
                <div className="project-card__media">
                  <Image src={project.image} alt={project.alt} fill sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 45vw" />
                  <span className="project-card__index">{project.index}</span>
                  <span className="project-card__type">{project.type}</span>
                </div>
                <div className="project-card__body">
                  <h3>{project.title}</h3>
                  <p>{project.copy}</p>
                  <div className="project-card__materials">
                    {project.materials.map((material) => <span key={material}>{material}</span>)}
                  </div>
                  <Link className="text-link" href={`/requirement-builder/?${new URLSearchParams({ application: project.application }).toString()}`}>
                    Build a {project.application.toLowerCase()} brief <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <p className="note">All imagery on this page is illustrative development material. Verified project references will be published with permission and accurate material details.</p>
        </div>
      </section>

      <section className="projects-share">
        <div className="section-shell projects-share__inner">
          <div>
            <p className="eyebrow">Have a project to discuss?</p>
            <h2>Tell us what the space has to do.</h2>
            <p>Share the application, approximate area, location and the material direction you are considering. The team will help with the next useful step — including an honest view of what needs to be verified.</p>
          </div>
          <div className="projects-share__actions">
            <Link className="button button-light" href="/requirement-builder/">Open the requirement builder <span aria-hidden="true">↗</span></Link>
            <Link className="home-text-link" href="/contact-us/">Contact Crystal Stones</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
