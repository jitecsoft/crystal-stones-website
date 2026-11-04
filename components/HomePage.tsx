import Image from "next/image";
import Link from "next/link";

const applications = [
  { number: "01", group: "KITCHEN", title: "Countertops", value: "Kitchen countertop" },
  { number: "02", group: "INTERIOR", title: "Floors & walls", value: "Flooring" },
  { number: "03", group: "BATHROOM", title: "Vanities", value: "Bathroom / vanity" },
  { number: "04", group: "ARCHITECTURE", title: "Facades & details", value: "Facade / exterior" },
];

function projectLink(application: string) {
  return `/requirement-builder/?${new URLSearchParams({ application }).toString()}`;
}

const neolithBrief = `/requirement-builder/?${new URLSearchParams({ material: "Porcelain / sintered stone", stone: "Neolith" }).toString()}`;
const marbleBrief = `/requirement-builder/?${new URLSearchParams({ material: "Marble", notes: "I would like to discuss imported marble sourcing." }).toString()}`;

export function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__copy">
          <p className="eyebrow">Crystal Stones <span aria-hidden="true">/</span> Natural stone &amp; architectural surfaces</p>
          <h1 id="home-title">A material choice can shape <em>everything.</em></h1>
          <p className="home-hero__intro">Explore Neolith architectural surfaces and imported natural marble, with other material families close at hand.</p>
          <div className="home-hero__actions">
            <Link className="button button-dark" href="/neolith/">Explore Neolith <span aria-hidden="true">↗</span></Link>
            <Link className="button button-outline" href="/marble/">Discover imported marble <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="home-hero__aside"><span className="home-hero__rule" />A clearer path from first reference to project brief.</div>
        </div>
        <figure className="home-hero__image">
          <Image src="/images/home-hero.webp" alt="Illustrative warm-toned residence with a marble island and full-height stone wall" fill priority sizes="(max-width: 800px) 100vw, 53vw" />
          <figcaption><span>Development imagery</span><span>Architectural surfaces · Material studies</span></figcaption>
        </figure>
        <span className="home-hero__index" aria-hidden="true">01 — 03</span>
      </section>

      <section className="home-feature home-feature--neolith" aria-labelledby="neolith-feature-title">
        <div className="home-feature__copy">
          <p className="eyebrow">Flagship architectural surface</p>
          <h2 id="neolith-feature-title">Neolith, considered for the way you live.</h2>
          <p>Start with the application, then explore the right collection direction with the Crystal Stones team. Exact colours, finishes, specifications and availability need confirmation against current Neolith product information.</p>
          <ul className="home-feature__list">
            <li>Explore the Neolith collection</li>
            <li>Discuss application and technical documentation</li>
            <li>Request a project quotation</li>
          </ul>
          <div className="home-feature__actions">
            <Link className="button button-light" href="/neolith/">Discover Neolith <span aria-hidden="true">↗</span></Link>
            <Link className="home-text-link" href={neolithBrief}>Start a Neolith project brief</Link>
          </div>
        </div>
        <figure className="home-feature__image">
          <Image src="/images/neolith-interior.webp" alt="Illustrative kitchen interior with a matte architectural surface island" fill sizes="(max-width: 800px) 100vw, 50vw" />
          <figcaption>Illustrative surface and setting · Not product photography</figcaption>
        </figure>
      </section>

      <section className="home-feature home-feature--marble" aria-labelledby="marble-feature-title">
        <figure className="home-feature__image">
          <Image src="/images/marble-sourcing.webp" alt="Illustrative sequence of marble slabs in a materials library" fill sizes="(max-width: 800px) 100vw, 50vw" />
          <figcaption>Illustrative image · No stock or exact variety implied</figcaption>
        </figure>
        <div className="home-feature__copy">
          <p className="eyebrow">Imported natural marble</p>
          <h2 id="marble-feature-title">A considered search for a particular stone.</h2>
          <p>Explore named varieties and origin references, then share the look, quantity and application you have in mind. Marble is sourced against the project; current lot origin and availability are confirmed on request.</p>
          <div className="origin-links" aria-label="Browse imported marble by origin">
            <Link href="/marble/origin/italy/">Italian marble <span aria-hidden="true">↗</span></Link>
            <Link href="/marble/origin/turkey/">Turkish marble <span aria-hidden="true">↗</span></Link>
            <Link href="/marble/origin/spain/">Spanish marble <span aria-hidden="true">↗</span></Link>
            <Link href="/marble/origin/greece/">Greek marble <span aria-hidden="true">↗</span></Link>
            <Link href="/marble/origin/portugal/">Portuguese marble <span aria-hidden="true">↗</span></Link>
            <Link href="/marble/origin/other/">Other origins <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="home-feature__actions">
            <Link className="button button-dark" href="/marble/">Browse all imported marble <span aria-hidden="true">↗</span></Link>
            <Link className="home-text-link" href={marbleBrief}>Start a sourcing brief</Link>
          </div>
          <p className="image-disclosure">Catalogue imagery is illustrative until approved, variety-specific slab photography is supplied.</p>
        </div>
      </section>

      <section className="home-applications" id="applications" aria-labelledby="applications-title">
        <div className="section-shell">
          <div className="section-intro">
            <div><p className="eyebrow">Begin with the space</p><h2 id="applications-title">Browse by application.</h2></div>
            <p>The right shortlist starts with how the surface will be used. Share the details you have; product suitability is confirmed against the selected material.</p>
          </div>
          <div className="application-cards">
            {applications.map((item) => <Link className="application-card" href={projectLink(item.value)} key={item.number}>
              <span className="application-card__number">{item.number}</span>
              <span className="application-card__group">{item.group}</span>
              <span className="application-card__title">{item.title}</span>
              <span className="application-card__arrow" aria-hidden="true">↗</span>
            </Link>)}
          </div>
        </div>
      </section>

      <section className="home-wider-catalogue" aria-labelledby="wider-title">
        <div className="section-shell home-wider-catalogue__inner">
          <div><p className="eyebrow">The wider collection</p><h2 id="wider-title">More surfaces.<br /><em>One considered brief.</em></h2></div>
          <div className="home-wider-catalogue__copy">
            <p>Explore natural stone and multi-brand architectural surface categories without losing sight of the specific material you came to find.</p>
            <div className="catalogue-links">
              <Link href="/all-materials/">All materials <span aria-hidden="true">↗</span></Link>
              <Link href="/granite/">Granite</Link>
              <Link href="/onyx/">Onyx</Link>
              <Link href="/travertine/">Travertine</Link>
              <Link href="/shop/sintered-stone/">Architectural surfaces</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-process" id="projects" aria-labelledby="process-title">
        <div className="section-shell">
          <div className="section-intro section-intro--process">
            <div><p className="eyebrow">From reference to requirement</p><h2 id="process-title">Make the next step clear.</h2></div>
            <p>A project-led route that keeps selection, verification and quotation in the right order.</p>
          </div>
          <div className="process-grid">
            <article><span>01</span><h3>Share the space</h3><p>Tell us the application, approximate area, location and the people involved in the decision.</p></article>
            <article><span>02</span><h3>Explore directions</h3><p>Compare materials and visual references without treating a placeholder as an available product.</p></article>
            <article><span>03</span><h3>Confirm the details</h3><p>Check origin, product family, finish, technical information and current lot with the supplier.</p></article>
            <article><span>04</span><h3>Request a quotation</h3><p>Send a complete brief so the team can respond to the actual project requirement.</p></article>
          </div>
          <div className="audience-note"><span>For</span> Architects &amp; interior designers <i>·</i> Fabricators &amp; builders <i>·</i> Premium homeowners</div>
        </div>
      </section>

      <section className="home-builder-cta" aria-labelledby="builder-title">
        <div className="home-builder-cta__inner">
          <div><p className="eyebrow">Bring the details together</p><h2 id="builder-title">Start with what you know.</h2><p>Build a brief with your preferred material, application, approximate quantity, location and finish direction.</p></div>
          <div className="home-builder-cta__actions"><Link className="button button-dark" href="/requirement-builder/">Open the requirement builder <span aria-hidden="true">↗</span></Link><Link className="home-text-link" href="/contact-us/">Contact Crystal Stones</Link></div>
        </div>
      </section>
    </main>
  );
}
