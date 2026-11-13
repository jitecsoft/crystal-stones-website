'use client';

import Link from "next/link";
import { useState } from "react";

const interests = [
  "Marble",
  "Granite",
  "Onyx",
  "Travertine / limestone",
  "Sandstone",
  "Porcelain / sintered stone",
  "Not sure / need guidance",
];

type ContactState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectLocation: string;
  interest: string;
  notes: string;
};

const initial: ContactState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  projectLocation: "",
  interest: "Marble",
  notes: "",
};

export function ContactForm() {
  const [form, setForm] = useState<ContactState>(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState("");

  const update = <K extends keyof ContactState>(key: K, value: ContactState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Please enter your name.");
    if (!form.email.trim() && !form.phone.trim()) return setError("Please provide an email address or phone number.");
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError("Enter a valid email address, or leave email blank and provide a phone number.");

    setBusy(true);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience: "General enquiry",
          material: form.interest,
          stoneName: "",
          colour: "Any / recommend options",
          application: "Other",
          area: "",
          unit: "sqft",
          waste: 0,
          supplyFormat: "To be advised",
          thickness: "To be advised",
          finish: "To be advised",
          sizePreset: "To be advised",
          destination: "To be confirmed",
          timeline: "",
          name: form.name,
          company: form.company,
          phone: form.phone,
          email: form.email,
          projectLocation: form.projectLocation,
          notes: form.notes,
          sourcePath: window.location.pathname,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "We could not send your message. Please try again.");
      setReference(data.reference);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again or email info@crystalstones.co.in.");
    } finally {
      setBusy(false);
    }
  };

  if (reference) {
    return (
      <div className="form-success contact-form__success">
        <p className="eyebrow">Message received</p>
        <h2>Thank you — your message is with the team.</h2>
        <p>Reference: <strong>{reference}</strong></p>
        <p>We will reply using the contact details provided. If your enquiry is urgent, call <a className="text-link" href="tel:+917093111580">+91 70931 11580</a>.</p>
        <div className="builder-success__actions">
          <Link className="button button-dark" href="/all-materials/">Explore the material library <span aria-hidden="true">↗</span></Link>
          <Link className="text-link" href="/requirement-builder/">Build a detailed requirement</Link>
        </div>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="contact-form__grid">
        <div className="field">
          <label htmlFor="contact-name">Name *</label>
          <input id="contact-name" name="name" autoComplete="name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="contact-company">Company / studio</label>
          <input id="contact-company" name="company" autoComplete="organization" value={form.company} onChange={(e) => update("company", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" name="email" type="email" autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="contact-phone">Phone / WhatsApp</label>
          <input id="contact-phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="contact-location">Project location</label>
          <input id="contact-location" name="projectLocation" autoComplete="address-level2" value={form.projectLocation} onChange={(e) => update("projectLocation", e.target.value)} placeholder="City or region" />
        </div>
        <div className="field">
          <label htmlFor="contact-interest">Material interest</label>
          <select id="contact-interest" name="interest" value={form.interest} onChange={(e) => update("interest", e.target.value)}>
            {interests.map((interest) => <option key={interest}>{interest}</option>)}
          </select>
        </div>
        <div className="field full">
          <label htmlFor="contact-notes">What are you working on?</label>
          <textarea id="contact-notes" name="notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Application, approximate area, preferred look, timing — whatever you know so far." />
        </div>
      </div>
      {error && <div className="form-error" role="alert">{error}</div>}
      <div className="contact-form__footer">
        <button className="button button-dark" type="submit" disabled={busy}>{busy ? "Sending…" : "Send message"} <span aria-hidden="true">↗</span></button>
        <p>Prefer a structured brief? <Link className="text-link" href="/requirement-builder/">Use the requirement builder</Link>.</p>
      </div>
    </form>
  );
}
