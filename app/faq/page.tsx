import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about choosing stone and architectural surfaces, estimating area, sharing specifications and requesting quotations.",
  alternates: { canonical: "/faq/" }
};

const groups = [
  {
    id: "choosing",
    eyebrow: "Choosing a material",
    title: "Start with the application.",
    items: [
      {
        q: "How do I choose between natural stone and an engineered surface?",
        a: "Begin with the application and the conditions: heat, moisture, foot traffic, sunlight and the finish you want. Natural stone offers variation and a specific geological character; engineered surfaces offer consistency and predictable formats. Both need the right product specification for the job, so compare the actual material rather than the general category.",
      },
      {
        q: "Can I use marble in a kitchen?",
        a: "Many marbles are used in kitchens, but they are sensitive to acids, stains and scratching. Some designs embrace that patina; others prefer a more resilient surface. Discuss the finish, sealing and daily maintenance routine before committing, and consider the stone's actual properties rather than its name.",
      },
      {
        q: "What should I check before specifying onyx?",
        a: "Onyx is decorative and often translucent, but it can be brittle and variable. Review the actual slab, its condition, reinforcement and any fills, and plan the lighting and fabrication with the installer. Onyx is generally best reserved for feature applications rather than heavy work surfaces.",
      },
      {
        q: "Is travertine suitable for bathrooms?",
        a: "Travertine can work well in bathrooms when the filling, finish and sealing are appropriate for the wet area. Confirm slip resistance for floors, maintenance expectations, and how the stone will be protected around showers and vanities.",
      },
    ],
  },
  {
    id: "quantity",
    eyebrow: "Area and quantity",
    title: "Make the numbers usable.",
    items: [
      {
        q: "How much material should I allow for wastage?",
        a: "A common starting allowance is around 10%, but the right figure depends on the layout, tile or slab format, cutting, matching and breakage risk. Complex patterns, bookmatching and small rooms usually need more. The requirement builder calculates an estimated order area from your measured area and allowance.",
      },
      {
        q: "Should I measure in square feet or square metres?",
        a: "Use whichever unit your drawings use. The requirement builder accepts both and shows the converted order area, so the team can compare the brief with supplier formats.",
      },
      {
        q: "What if I only know the number of pieces?",
        a: "That is enough to start. Share the piece count and approximate dimensions, or the countertop run, and the team can help calculate the slab or tile quantity needed.",
      },
      {
        q: "Do slab and tile dimensions affect the quotation?",
        a: "Yes. Format, thickness, finish and cutting plan all affect yield and fabrication. A larger slab may reduce joints but needs more handling; a standard tile may suit a simple floor better. Include the preferred format if you have one.",
      },
    ],
  },
  {
    id: "ordering",
    eyebrow: "Specification and ordering",
    title: "Confirm before you commit.",
    items: [
      {
        q: "Is the photography on this website the exact material I will receive?",
        a: "No. Catalogue and variety imagery is illustrative unless a specific lot photograph is supplied and approved. Natural stone varies between blocks and slabs; always confirm the actual lot, origin, finish and dimensions before ordering.",
      },
      {
        q: "How are availability and price confirmed?",
        a: "Availability is checked against the current lot for your requirement. Price depends on the material, format, finish, quantity, fabrication and delivery destination, so a quotation follows a review of the brief rather than a generic catalogue price.",
      },
      {
        q: "Can you deliver outside India?",
        a: "International enquiries are welcome. Share the delivery destination, timeline and any documentation needs, and the team will confirm what is possible for the specific material and quantity.",
      },
      {
        q: "What happens after I submit the requirement builder?",
        a: "You receive a reference number immediately. The team reviews the application, quantity, finish and location, checks the relevant material details with the supplier, and contacts you using the details provided. If something is missing, we will ask a focused question rather than restart the conversation.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <main className="faq-page">
      <section className="page-hero faq-hero">
        <div className="breadcrumb"><Link href="/">Home</Link> / FAQ</div>
        <p className="eyebrow">Helpful guidance</p>
        <h1>Questions, answered <em>clearly.</em></h1>
        <p>The practical questions that come up when choosing stone, estimating quantity and moving from a reference to a confirmed specification.</p>
        <div className="hero-actions">
          <Link className="button button-dark" href="/requirement-builder/">Build your requirement <span aria-hidden="true">↗</span></Link>
          <Link className="button button-outline" href="/contact-us/">Ask the team</Link>
        </div>
      </section>

      <section className="section faq-section">
        <div className="section-inner faq-layout">
          <aside className="faq-aside">
            <p className="eyebrow">On this page</p>
            <nav aria-label="FAQ sections">
              {groups.map((group) => <a href={`#${group.id}`} key={group.id}>{group.title}</a>)}
            </nav>
            <div className="faq-aside__note">
              <span>Still unsure?</span>
              <p>Share the application and approximate area. We will help narrow the material direction.</p>
              <Link className="text-link" href="/contact-us/">Contact Crystal Stones <span aria-hidden="true">↗</span></Link>
            </div>
          </aside>

          <div className="faq-content">
            {groups.map((group) => (
              <section className="faq-group" id={group.id} key={group.id}>
                <div className="faq-group__heading">
                  <p className="eyebrow">{group.eyebrow}</p>
                  <h2>{group.title}</h2>
                </div>
                <div className="faq-list">
                  {group.items.map((item) => (
                    <details className="faq-item" key={item.q}>
                      <summary>{item.q}</summary>
                      <p>{item.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
            <p className="note">This guidance is general. Material suitability, technical performance and availability are confirmed for each project and lot.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
