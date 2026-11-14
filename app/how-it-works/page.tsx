import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How it works",
  description: "A straightforward path from material discovery to a usable requirement and a quotation conversation.",
  alternates: { canonical: "/how-it-works/" }
};

const steps = [
  {
    stage: "Step 01 · Explore",
    title: "Find a material direction.",
    copy: "Start with the stone family, a named variety or an application. Use the catalogue and project references to build a visual shortlist, keeping in mind that catalogue imagery is illustrative until a lot is confirmed.",
    points: ["Browse by stone family or application", "Compare finishes, formats and colour direction", "Save the references worth discussing"],
  },
  {
    stage: "Step 02 · Describe",
    title: "Put the project into words.",
    copy: "Tell us what the surface needs to do, where it will be installed and roughly how much area is involved. A measured area, piece count or simple sketch is enough to begin; the answer can be refined later.",
    points: ["Application and project location", "Approximate area or piece quantity", "Preferred finish, thickness and timing"],
  },
  {
    stage: "Step 03 · Verify",
    title: "Confirm the actual material.",
    copy: "The team checks the relevant product family, origin, finish and current lot with the supplier. This is where placeholder references become a specific material conversation, with documentation and availability treated honestly.",
    points: ["Origin, grade and technical information", "Slab or batch photography and dimensions", "Suitability for the intended application"],
  },
  {
    stage: "Step 04 · Quote",
    title: "Receive a project-led response.",
    copy: "With the brief and material direction aligned, the team responds with the relevant next step: a quotation direction, a request for missing detail, or an alternative material that fits the project better.",
    points: ["Quantity and format basis confirmed", "Delivery destination and timeline reviewed", "A reference number for follow-up"],
  },
];

const readiness = [
  "The application — floor, wall, countertop, vanity, facade or furniture",
  "An approximate area in square feet or square metres, or a piece count",
  "The project location and required timing",
  "Any preferred material, colour, finish or reference image",
  "Who is involved — architect, designer, fabricator or contractor",
];

const audiences = [
  { number: "01", title: "Architects & designers", copy: "Bring a material direction and a project context. We will help narrow the options and confirm what needs to be checked before specification." },
  { number: "02", title: "Fabricators & contractors", copy: "Share the format, quantity and fabrication constraints. The conversation can focus on yield, slab availability and delivery rather than generalities." },
  { number: "03", title: "Homeowners", copy: "You do not need a full specification. A room, a rough measurement and the look you like are enough to start a useful conversation." },
];

export default function HowItWorksPage() {
  return (
    <main className="hiw-page">
      <section className="page-hero hiw-hero">
        <div className="breadcrumb"><Link href="/">Home</Link> / How it works</div>
        <p className="eyebrow">The process</p>
        <h1>From first reference to a <em>clearer quotation.</em></h1>
        <p>A project-led route that keeps discovery, verification and quotation in the right order. No generic price lists and no pretending an illustrative image is current stock.</p>
        <div className="hero-actions">
          <Link className="button button-dark" href="/requirement-builder/">Start your requirement <span aria-hidden="true">↗</span></Link>
          <Link className="button button-outline" href="/all-materials/">Explore materials</Link>
        </div>
      </section>

      <section className="hiw-route">
        <div className="section-shell">
          <div className="section-intro">
            <div><p className="eyebrow">Four steps</p><h2>A straightforward path.</h2></div>
            <p>Each step narrows the brief. You can move at your own pace, and the requirement builder keeps the details together.</p>
          </div>
          <ol className="hiw-steps">
            {steps.map((step, index) => (
              <li className="hiw-step" key={step.stage}>
                <div className="hiw-step__index">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <i aria-hidden="true" />
                </div>
                <div className="hiw-step__body">
                  <p className="eyebrow">{step.stage}</p>
                  <h2>{step.title}</h2>
                  <p>{step.copy}</p>
                  <ul>{step.points.map((point) => <li key={point}>{point}</li>)}</ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="split-section">
        <div className="section-inner hiw-prep">
          <div>
            <p className="eyebrow">What to have ready</p>
            <h2>Helpful, not mandatory.</h2>
            <p>You can begin with very little. The more of these details you have, the more specific the first response can be.</p>
            <ul className="feature-list">{readiness.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="hiw-prep__panel">
            <span>Typical first step</span>
            <h3>Build the brief in about five minutes.</h3>
            <p>The requirement builder turns what you know into a reference number and a summary the team can review. You can submit a partial brief and refine it later.</p>
            <Link className="button button-dark" href="/requirement-builder/">Open the requirement builder <span aria-hidden="true">↗</span></Link>
            <Link className="text-link" href="/contact-us/">Or simply contact the team</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-shell">
          <div className="section-intro">
            <div><p className="eyebrow">Who it is for</p><h2>One route, different starting points.</h2></div>
            <p>Trade and private clients use the same process, with the level of detail adjusted to the project.</p>
          </div>
          <div className="hiw-audiences">
            {audiences.map((audience) => (
              <article key={audience.number}>
                <span>{audience.number}</span>
                <h3>{audience.title}</h3>
                <p>{audience.copy}</p>
                <Link className="text-link" href="/requirement-builder/">Build a brief <span aria-hidden="true">↗</span></Link>
              </article>
            ))}
          </div>
          <p className="note">Crystal Stones is an online stone sourcing business. Material suitability, availability and delivery are confirmed for each project before purchase.</p>
        </div>
      </section>
    </main>
  );
}
