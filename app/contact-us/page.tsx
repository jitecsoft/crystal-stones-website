import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Crystal Stones",
  description: "Tell us about your project, material preference, approximate area and delivery location so the team can review the requirement.",
  alternates: { canonical: "/contact-us/" }
};

const whatsappUrl = "https://wa.me/917093111580?text=Hello%20Crystal%20Stones%2C%20I%E2%80%99d%20like%20help%20sourcing%20a%20stone%20for%20my%20project.";

const helps = [
  "Application and project type",
  "Approximate area or piece quantity",
  "Material direction, colour and finish",
  "Project location and required timing",
];

export default function ContactPage() {
  return (
    <main className="contact-page">
      <section className="page-hero contact-hero">
        <div className="breadcrumb"><Link href="/">Home</Link> / Contact</div>
        <p className="eyebrow">Start a conversation</p>
        <h1>Tell us what the <em>space needs.</em></h1>
        <p>Share the application, approximate area and the direction you have in mind. The team will help refine the material choice and the next step — without treating an illustrative reference as available stock.</p>
        <div className="hero-actions">
          <Link className="button button-dark" href="/requirement-builder/">Open the requirement builder <span aria-hidden="true">↗</span></Link>
          <a className="button button-outline" href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp the team <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="section contact-channels">
        <div className="section-shell">
          <div className="contact-grid">
            <div className="contact-card contact-card--dark">
              <p className="eyebrow">Direct contact</p>
              <h2>Talk to the team.</h2>
              <p>For a quick question, an introduction or an active project, reach us directly. We operate online across India with international enquiry support.</p>
              <div className="contact-card__methods">
                <a href="tel:+917093111580"><span>+91 70931 11580</span><small>Call</small></a>
                <a href="mailto:info@crystalstones.co.in"><span>info@crystalstones.co.in</span><small>Email</small></a>
                <a href={whatsappUrl} target="_blank" rel="noreferrer"><span>WhatsApp the team</span><small>Message</small></a>
              </div>
            </div>
            <div className="contact-card">
              <p className="eyebrow">A structured brief</p>
              <h2>Use the requirement builder.</h2>
              <p>If you already know the application, area, finish and timing, the builder captures the details in one pass and gives the team a usable brief.</p>
              <ul className="feature-list">
                <li>Material, colour and application in one place</li>
                <li>Area, wastage and order quantity calculated</li>
                <li>Reference number for follow-up</li>
              </ul>
              <Link className="button button-dark" href="/requirement-builder/">Build your requirement <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-form-section">
        <div className="section-shell contact-form-grid">
          <div className="contact-form-intro">
            <p className="eyebrow">Send a message</p>
            <h2>A short note is enough to begin.</h2>
            <p>Use the form for general enquiries, material questions, collaborations or press. If you have drawings or a specification, mention them in the message and we will ask for the files.</p>
            <div className="contact-form-intro__note">
              <span>Response</span>
              <p>Messages are reviewed by the Crystal Stones team. Sharing an approximate area, location and timing helps us respond with something useful.</p>
            </div>
            <div className="contact-form-intro__links">
              <Link className="text-link" href="/faq/">Read the FAQ <span aria-hidden="true">↗</span></Link>
              <Link className="text-link" href="/how-it-works/">See how it works <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="section contact-inside-section">
        <div className="section-inner contact-inside">
          <div>
            <p className="eyebrow">Before you write</p>
            <h2>What helps us respond well.</h2>
            <p>You do not need a finished specification. A clear application and a rough sense of scale are enough to start a useful conversation.</p>
            <p>For trade and commercial projects, tell us who is involved — architect, fabricator, contractor — so the right information reaches the right person.</p>
          </div>
          <div className="contact-inside__panel">
            <h3>A useful first message</h3>
            <ul>{helps.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </section>
    </main>
  );
}
