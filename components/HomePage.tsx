import Image from "next/image";
import Link from "next/link";
import { importedMarbleVarieties, type ImportedMarbleVariety } from "@/lib/imported-marble";

const applications = [
  { number: "01", group: "KITCHEN", title: "Countertops", value: "Kitchen countertop", blurb: "Work surfaces, islands and splashbacks." },
  { number: "02", group: "INTERIOR", title: "Floors & walls", value: "Flooring", blurb: "Continuous floors, walls and feature panels." },
  { number: "03", group: "BATHROOM", title: "Vanities", value: "Bathroom / vanity", blurb: "Vanity tops, wet areas and detailing." },
  { number: "04", group: "ARCHITECTURE", title: "Facades & details", value: "Facade / exterior", blurb: "Exterior cladding and architectural elements." },
];

const stoneFamilies = [
  {
    href: "/marble/",
    number: "01",
    name: "Imported marble",
    blurb: "Named varieties and origin references, selected for the project.",
    image: "/images/catalogue/imported-marble/marble-family-collection.webp",
    alt: "Illustrative arrangement of marble samples in white, beige, brown, pink and black",
    className: "family-card--marble",
  },
  {
    href: "/granite/",
    number: "02",
    name: "Granite",
    blurb: "Hard-wearing surfaces across colour and finish directions.",
    image: "/images/catalogue/natural-stone-families/granite-family-collection.webp",
    alt: "Illustrative arrangement of granite samples in silver, charcoal, black, beige and green",
    className: "",
  },
  {
    href: "/onyx/",
    number: "03",
    name: "Onyx",
    blurb: "Decorative, translucent stone for expressive interiors.",
    image: "/images/catalogue/natural-stone-families/onyx.webp",
    alt: "Illustrative warm orange onyx surface",
    className: "",
  },
  {
    href: "/travertine/",
    number: "04",
    name: "Travertine",
    blurb: "Warm, layered texture for floors, walls and quiet detail.",
    image: "/images/catalogue/natural-stone-families/travertine.webp",
    alt: "Illustrative close-up of a warm beige travertine surface",
    className: "",
  },
];

const featuredSlugs = ["statuario", "calacatta-gold", "bardiglio", "nero-marquina"];
const featuredVarieties = featuredSlugs
  .map((slug) => importedMarbleVarieties.find((item) => item.slug === slug))
  .filter((item): item is ImportedMarbleVariety => Boolean(item));

const lookbook = ["Statuario", "Calacatta Gold", "Bardiglio", "Nero Marquina", "Rosso Levanto", "Crema Marfil"];

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
          <div className="home-hero__meta">
            <div><span>Established</span><strong>1991</strong></div>
            <div><span>Material focus</span><strong>Natural &amp; engineered stone</strong></div>
            <div><span>Sourcing</span><strong>India &amp; international</strong></div>
          </div>
        </div>
        <figure className="home-hero__image">
          <Image src="/images/home-hero.webp" alt="Illustrative warm-toned residence with a marble island and full-height stone wall" fill priority sizes="(max-width: 800px) 100vw, 53vw" />
          <div className="home-hero__plate">
            <span className="home-hero__plate-label">Signature direction</span>
            <strong>Neolith <i>·</i> Sintered stone</strong>
            <Link href="/neolith/">Explore the material <span aria-hidden="true">↗</span></Link>
          </div>
          <figcaption><span>Development imagery</span><span>Architectural surfaces · Material studies</span></figcaption>
        </figure>
        <span className="home-hero__index" aria-hidden="true">01 — 03</span>
      </section>

      <div className="material-marquee" aria-hidden="true">
        <div className="material-marquee__track">
          {[...lookbook, ...lookbook].map((item, index) => (
            <span key={`${item}-${index}`}>{item}<i>✦</i></span>
          ))}
        </div>
      </div>

      <section className="home-families" aria-labelledby="families-title">
        <div className="section-shell">
          <div className="section-intro">
            <div><p className="eyebrow">The material library</p><h2 id="families-title">Explore by stone family.</h2></div>
            <p>Start with the material direction, then refine the shortlist or share a project brief. Every reference is confirmed before specification.</p>
          </div>
          <div className="family-grid">
            {stoneFamilies.map((family) => (
              <Link className={`family-card ${family.className}`} href={family.href} key={family.href}>
                <Image src={family.image} alt={family.alt} fill sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 45vw" />
                <span className="family-card__shade" aria-hidden="true" />
                <span className="family-card__content">
                  <span className="family-card__number">{family.number}</span>
                  <span className="family-card__name">{family.name}</span>
                  <span className="family-card__blurb">{family.blurb}</span>
                  <span className="family-card__link">Explore family <span aria-hidden="true">↗</span></span>
                </span>
              </Link>
            ))}
          </div>
          <Link className="family-banner" href="/shop/sintered-stone/">
            <span className="family-banner__index">05 / ENGINEERED SURFACES</span>
            <span className="family-banner__copy"><strong>Architectural surface brands</strong><small>Neolith · Dekton · Laminam · Stonelam</small></span>
            <span className="family-banner__arrow" aria-hidden="true">↗</span>
          </Link>
          <p className="catalogue-disclosure">Images are illustrative references, not representations of current stock. Confirm lot identity, origin, image rights and availability before specification.</p>
        </div>
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
          <span className="image-corner-label">Neolith direction</span>
          <figcaption>Illustrative surface and setting · Not product photography</figcaption>
        </figure>
      </section>

      <section className="home-feature home-feature--marble" aria-labelledby="marble-feature-title">
        <figure className="home-feature__image">
          <Image src="/images/catalogue/imported-marble/marble-feature-hero.webp" alt="Illustrative bookmatched marble wall and island in a warm contemporary interior" fill sizes="(max-width: 800px) 100vw, 50vw" />
          <span className="image-corner-label">Bookmatched study</span>
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

      <section className="home-varieties" aria-labelledby="varieties-title">
        <div className="section-shell">
          <div className="section-intro">
            <div><p className="eyebrow">Signature varieties</p><h2 id="varieties-title">A few directions to begin with.</h2></div>
            <p>Recognised marble names, presented as a starting point. Confirm the quarry, current lot and slab photography before selection.</p>
          </div>
          <div className="variety-strip">
            {featuredVarieties.map((variety) => (
              <Link className="variety-card" href={`/marble/variety/${variety.slug}/`} key={variety.slug}>
                <span className="variety-card__media">
                  <Image src={variety.image.src} alt={variety.image.alt} fill sizes="(max-width: 760px) 82vw, (max-width: 1100px) 40vw, 24vw" />
                  <span className="variety-card__label">Illustrative</span>
                </span>
                <span className="variety-card__meta">{variety.origin.country ?? "Origin to confirm"} <i>·</i> {variety.familyVerified ? variety.stoneFamily : "Family to confirm"}</span>
                <span className="variety-card__name">{variety.name}</span>
                <span className="variety-card__link">View variety <span aria-hidden="true">↗</span></span>
              </Link>
            ))}
          </div>
          <div className="variety-strip__footer">
            <Link className="text-link" href="/marble/">Explore the full marble catalogue <span aria-hidden="true">↗</span></Link>
            <span>Origin and attributes are confirmed for each offered lot.</span>
          </div>
        </div>
      </section>

      <section className="home-applications" id="applications" aria-labelledby="applications-title">
        <div className="section-shell">
          <div className="section-intro">
            <div><p className="eyebrow">Begin with the space</p><h2 id="applications-title">Browse by application.</h2></div>
            <p>The right shortlist starts with how the surface will be used. Share the details you have; product suitability is confirmed against the selected material.</p>
          </div>
          <div className="application-cards">
            {applications.map((item) => (
              <Link className="application-card" href={projectLink(item.value)} key={item.number}>
                <span className="application-card__number">{item.number}</span>
                <span className="application-card__group">{item.group}</span>
                <span className="application-card__title">{item.title}</span>
                <span className="application-card__blurb">{item.blurb}</span>
                <span className="application-card__arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
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
            <article><span className="process-grid__number">01</span><h3>Share the space</h3><p>Tell us the application, approximate area, location and the people involved in the decision.</p></article>
            <article><span className="process-grid__number">02</span><h3>Explore directions</h3><p>Compare materials and visual references without treating a placeholder as an available product.</p></article>
            <article><span className="process-grid__number">03</span><h3>Confirm the details</h3><p>Check origin, product family, finish, technical information and current lot with the supplier.</p></article>
            <article><span className="process-grid__number">04</span><h3>Request a quotation</h3><p>Send a complete brief so the team can respond to the actual project requirement.</p></article>
          </div>
          <div className="audience-note"><span>For</span> Architects &amp; interior designers <i>·</i> Fabricators &amp; builders <i>·</i> Premium homeowners</div>
        </div>
      </section>
    </main>
  );
}
