'use client';

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { colours, families } from "@/lib/materials";

type FormState = {
  audience: string; material: string; stoneName: string; colour: string; application: string;
  area: string; unit: "sqft" | "sqm"; waste: number; supplyFormat: string; thickness: string;
  finish: string; sizePreset: string; customLength: string; customWidth: string; pieceQuantity: string;
  destination: string; timeline: string; name: string; company: string; phone: string; email: string;
  projectLocation: string; notes: string;
};
const initial: FormState = {
  audience: "Trade / commercial project", material: "Marble", stoneName: "", colour: "White",
  application: "Flooring", area: "", unit: "sqft", waste: 10, supplyFormat: "Cut-to-size",
  thickness: "18 mm", finish: "Polished", sizePreset: "Custom / not sure", customLength: "", customWidth: "",
  pieceQuantity: "", destination: "India", timeline: "Within 1–3 months", name: "", company: "",
  phone: "", email: "", projectLocation: "", notes: ""
};

const stepLabels = ["Material", "Quantity & finish", "Project & contact"];
const applications = ["Flooring", "Wall cladding / feature wall", "Kitchen countertop", "Bathroom / vanity", "Staircase", "Facade / exterior", "Furniture / bespoke work", "Multiple applications", "Other"];
const finishes = ["Polished", "Honed / matte", "Leathered / textured", "Brushed / other", "Not decided"];
const audiences = ["Trade / commercial project", "Home / renovation", "Stone dealer / bulk purchase"];

export function RequirementBuilder() {
  const [form, setForm] = useState<FormState>(initial);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState<{ reference: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const material = params.get("material");
    const colour = params.get("colour");
    const stone = params.get("stone");
    const application = params.get("application");
    const finish = params.get("finish");
    const notes = params.get("notes");
    if (material || colour || stone || application || finish || notes) setForm((f) => ({
      ...f,
      ...(material && families.includes(material) ? { material } : {}),
      ...(colour && colours.includes(colour) ? { colour } : {}),
      ...(stone ? { stoneName: stone } : {}),
      ...(application && applications.includes(application) ? { application } : {}),
      ...(finish && finishes.includes(finish) ? { finish } : {}),
      ...(notes ? { notes } : {}),
    }));
  }, []);

  useEffect(() => {
    if (!success) stepHeadingRef.current?.focus();
  }, [step, success]);

  const measuredArea = Math.max(0, Number(form.area) || 0);
  const areaSqft = form.unit === "sqm" ? measuredArea * 10.7639104167 : measuredArea;
  const orderSqft = areaSqft * (1 + form.waste / 100);
  const orderSqm = orderSqft / 10.7639104167;
  const areaValid = form.area.trim() !== "" && Number.isFinite(Number(form.area)) && Number(form.area) > 0;
  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));
  const summary = useMemo(() => [
    ["Buyer", form.audience], ["Material", form.material], ["Preferred stone", form.stoneName || "Open to recommendations"],
    ["Colour", form.colour], ["Application", form.application],
    ["Measured area", areaValid ? `${measuredArea.toLocaleString("en-IN")} ${form.unit}` : "Not entered"],
    ["Estimated order area", areaValid ? `${orderSqft.toLocaleString("en-IN", { maximumFractionDigits: 1 })} sq ft / ${orderSqm.toLocaleString("en-IN", { maximumFractionDigits: 1 })} m²` : "Not calculated"],
    ["Supply format", form.supplyFormat], ["Thickness", form.thickness], ["Finish", form.finish],
    ["Dimensions", form.sizePreset === "Custom dimensions" ? `${form.customLength || "?"} × ${form.customWidth || "?"} mm` : form.sizePreset],
    ["Piece quantity", form.pieceQuantity || "Calculate / advise"], ["Destination", form.destination], ["Timeline", form.timeline]
  ], [form, areaValid, measuredArea, orderSqft, orderSqm]);

  const asideSummary = [
    ["Material", form.material],
    ["Application", form.application],
    ["Colour", form.colour],
    ["Area", areaValid ? `${measuredArea.toLocaleString("en-IN")} ${form.unit}` : form.pieceQuantity || "To be advised"],
    ["Finish", form.finish],
    ["Timeline", form.timeline],
  ];

  const goNext = () => {
    setError("");
    if (step === 1 && !form.material) return setError("Choose a material type or select the option for guidance.");
    if (step === 2 && !areaValid && !form.pieceQuantity.trim()) return setError("Enter a measured area or a known piece/slab quantity to continue.");
    setStep((s) => Math.min(3, s + 1));
  };

  const goBack = () => {
    setError("");
    setStep((s) => Math.max(1, s - 1));
  };

  const submit = async () => {
    setError("");
    if (!form.name.trim()) return setError("Please enter your name.");
    if (!form.email.trim() && !form.phone.trim()) return setError("Please provide an email address or phone number.");
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError("Enter a valid email address or leave email blank and provide a phone number.");
    setBusy(true);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          measuredArea: areaValid ? measuredArea : null,
          measuredUnit: form.unit,
          measuredAreaSqft: areaValid ? areaSqft : null,
          wastagePercent: form.waste,
          estimatedOrderAreaSqft: areaValid ? orderSqft : null,
          estimatedOrderAreaSqm: areaValid ? orderSqm : null,
          summary: Object.fromEntries(summary),
          sourcePath: window.location.pathname
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "We could not submit your request. Please try again.");
      setSuccess({ reference: data.reference });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally { setBusy(false); }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step < 3) goNext();
    else void submit();
  };

  const copyReference = async () => {
    if (!success) return;
    try {
      await navigator.clipboard.writeText(success.reference);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  if (success) return <div className="form-success">
    <p className="eyebrow">Requirement received</p>
    <h2>Thank you. Your brief is ready for review.</h2>
    <p>Reference: <strong>{success.reference}</strong> <button className="text-button" type="button" onClick={copyReference}>{copied ? "Copied" : "Copy reference"}</button></p>
    <p>Keep this reference for follow-up. The Crystal Stones team will contact you using the details provided.</p>
    <div className="builder-success__next">
      <div><span>01</span><strong>We review the brief</strong><small>The team checks the material direction, quantity and application details you shared.</small></div>
      <div><span>02</span><strong>We confirm the details</strong><small>Origin, finish, technical suitability and current availability are checked for the project.</small></div>
      <div><span>03</span><strong>You receive a response</strong><small>We come back with the relevant next step, documentation or quotation direction.</small></div>
    </div>
    <div className="builder-success__actions"><Link className="button button-dark" href="/all-materials/">Explore the material library <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/">Back to home</Link></div>
  </div>;

  return <div className="builder-shell">
    <div className="builder-panel">
      <div className="stepper" aria-label="Requirement steps">
        {stepLabels.map((label, i) => {
          const number = i + 1;
          return <div className={`step ${step === number ? "active" : ""} ${step > number ? "complete" : ""}`} key={label} aria-current={step === number ? "step" : undefined}>
            <span className="step-number">{step > number ? "✓" : number}</span><span>{label}</span>
          </div>;
        })}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {error && <div className="form-error" role="alert">{error}</div>}

        {step === 1 && <div className="form-section">
          <h2 ref={stepHeadingRef} tabIndex={-1}>Choose your material direction.</h2>
          <p className="form-help">Pick what you know today. Exact product and availability can be confirmed later.</p>
          <div className="form-grid">
            <fieldset className="field full form-fieldset">
              <legend>Who is this requirement for? *</legend>
              <div className="choice-grid">{audiences.map((value, i) => <div className="choice" key={value}><input type="radio" name="audience" id={`aud-${i}`} checked={form.audience === value} onChange={() => update("audience", value)} /><label htmlFor={`aud-${i}`}>{value}</label></div>)}</div>
            </fieldset>
            <div className="field"><label htmlFor="material">Material type *</label><select id="material" value={form.material} onChange={(e) => update("material", e.target.value)}>{families.map((v) => <option key={v}>{v}</option>)}</select></div>
            <div className="field"><label htmlFor="stone-name">Specific stone / product name</label><input id="stone-name" value={form.stoneName} onChange={(e) => update("stoneName", e.target.value)} placeholder="Name or code, if known" /></div>
            <div className="field"><label htmlFor="colour">Preferred colour</label><select id="colour" value={form.colour} onChange={(e) => update("colour", e.target.value)}>{colours.map((v) => <option key={v}>{v}</option>)}</select></div>
            <div className="field"><label htmlFor="application">Application *</label><select id="application" value={form.application} onChange={(e) => update("application", e.target.value)}>{applications.map((v) => <option key={v}>{v}</option>)}</select></div>
            <div className="field full"><label htmlFor="notes-first">Reference / design notes (optional)</label><textarea id="notes-first" value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Describe the look you want or any drawing/reference you can share later." /></div>
          </div>
        </div>}

        {step === 2 && <div className="form-section">
          <h2 ref={stepHeadingRef} tabIndex={-1}>Define area and supply details.</h2>
          <p className="form-help">Area estimates help start the quotation. Final order quantity depends on slab yield, cutting layout and project details.</p>
          <div className="form-grid">
            <div className="field"><label htmlFor="area">Measured area</label><input id="area" type="number" min="0" step="any" value={form.area} onChange={(e) => update("area", e.target.value)} placeholder="e.g. 1000" /></div>
            <div className="field"><label htmlFor="unit">Area unit</label><select id="unit" value={form.unit} onChange={(e) => update("unit", e.target.value as FormState["unit"])}><option value="sqft">Square feet (sq ft)</option><option value="sqm">Square metres (m²)</option></select></div>
            <div className="field full"><label htmlFor="waste">Cutting / wastage allowance: {form.waste}%</label><input id="waste" type="range" min="0" max="20" step="5" value={form.waste} onChange={(e) => update("waste", Number(e.target.value))} /><div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--muted)" }}><span>0%</span><span>10%</span><span>20%</span></div></div>
            <div className="field full"><div className="qty-result"><span>Estimated material area including allowance</span><strong>{areaValid ? `${orderSqft.toLocaleString("en-IN", { maximumFractionDigits: 1 })} sq ft` : "Enter area or quantity"}</strong>{areaValid && <span>≈ {orderSqm.toLocaleString("en-IN", { maximumFractionDigits: 1 })} m² · measured area: {measuredArea.toLocaleString("en-IN")} {form.unit}</span>}</div></div>
            <div className="field"><label htmlFor="format">Supply format</label><select id="format" value={form.supplyFormat} onChange={(e) => update("supplyFormat", e.target.value)}>{["Full slabs", "Tiles", "Cut-to-size", "Not sure / advise me"].map((v) => <option key={v}>{v}</option>)}</select></div>
            <div className="field"><label htmlFor="thickness">Thickness</label><select id="thickness" value={form.thickness} onChange={(e) => update("thickness", e.target.value)}>{["Not sure / advise me", "6 mm", "12 mm", "15 mm", "18 mm", "20 mm", "30 mm", "Other"].map((v) => <option key={v}>{v}</option>)}</select></div>
            <div className="field"><label htmlFor="finish">Surface finish</label><select id="finish" value={form.finish} onChange={(e) => update("finish", e.target.value)}>{finishes.map((v) => <option key={v}>{v}</option>)}</select></div>
            <div className="field"><label htmlFor="size">Piece / slab dimensions</label><select id="size" value={form.sizePreset} onChange={(e) => update("sizePreset", e.target.value)}>{["Custom / not sure", "Large slabs", "600 × 600 mm tiles", "600 × 1200 mm tiles", "Custom dimensions"].map((v) => <option key={v}>{v}</option>)}</select></div>
            {form.sizePreset === "Custom dimensions" && <><div className="field"><label htmlFor="length">Length (mm)</label><input id="length" type="number" min="1" value={form.customLength} onChange={(e) => update("customLength", e.target.value)} /></div><div className="field"><label htmlFor="width">Width (mm)</label><input id="width" type="number" min="1" value={form.customWidth} onChange={(e) => update("customWidth", e.target.value)} /></div></>}
            <div className="field full"><label htmlFor="piece-qty">Known number of slabs / tiles / pieces (optional)</label><input id="piece-qty" value={form.pieceQuantity} onChange={(e) => update("pieceQuantity", e.target.value)} placeholder="e.g. 24 slabs, 180 tiles, or leave blank" /></div>
          </div>
        </div>}

        {step === 3 && <div className="form-section">
          <h2 ref={stepHeadingRef} tabIndex={-1}>Where should we direct your enquiry?</h2>
          <p className="form-help">Share enough information for the team to respond. Email or phone is required; company and project details are optional.</p>
          <div className="form-grid">
            <div className="field"><label htmlFor="destination">Delivery destination *</label><select id="destination" value={form.destination} onChange={(e) => update("destination", e.target.value)}>{["India", "International"].map((v) => <option key={v}>{v}</option>)}</select></div>
            <div className="field"><label htmlFor="timeline">Expected timeline</label><select id="timeline" value={form.timeline} onChange={(e) => update("timeline", e.target.value)}>{["As soon as possible", "Within 1–3 months", "Within 3–6 months", "Planning / exploring"].map((v) => <option key={v}>{v}</option>)}</select></div>
            <div className="field"><label htmlFor="name">Full name *</label><input id="name" autoComplete="name" value={form.name} onChange={(e) => update("name", e.target.value)} /></div>
            <div className="field"><label htmlFor="company">Company / practice</label><input id="company" autoComplete="organization" value={form.company} onChange={(e) => update("company", e.target.value)} /></div>
            <div className="field"><label htmlFor="phone">Phone / WhatsApp (or provide email)</label><input id="phone" autoComplete="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Include country code for international enquiries" /></div>
            <div className="field"><label htmlFor="email">Email address (or provide phone)</label><input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></div>
            <div className="field full"><label htmlFor="location">Project city and country</label><input id="location" value={form.projectLocation} onChange={(e) => update("projectLocation", e.target.value)} placeholder="e.g. Bengaluru, India or Dubai, UAE" /></div>
            <div className="field full"><label htmlFor="notes">Additional requirements</label><textarea id="notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Timeline, delivery details, drawings, cut-outs, edge profiles or other notes" /></div>
            <div className="field full"><div className="summary-box"><h3>Review your requirement</h3><div className="summary-grid">{summary.map(([label, value]) => <div key={label}><span>{label}</span><br /><strong>{value}</strong></div>)}</div></div></div>
          </div>
        </div>}

        <div className="form-actions">
          {step > 1 ? <button className="button button-outline" type="button" onClick={goBack}>← Back</button> : <span className="muted" style={{ fontSize: 10 }}>Step 1 of 3</span>}
          {step < 3
            ? <button className="button button-dark" type="submit">Continue <span aria-hidden="true">→</span></button>
            : <button className="button button-dark" type="submit" disabled={busy}>{busy ? "Submitting…" : "Submit requirement ↗"}</button>}
        </div>
      </form>
      <p className="note">Area plus allowance is an estimate, not a guaranteed slab count or cutting yield. Do not include confidential information. By submitting, you ask Crystal Stones to contact you about this requirement.</p>
    </div>

    <aside className="builder-summary" aria-label="Requirement summary">
      <p className="eyebrow">Your brief so far</p>
      <h2>{form.stoneName.trim() || form.material}</h2>
      <p className="builder-summary__status">{form.application} · {form.colour}</p>
      <div className="builder-summary__list">{asideSummary.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
      <div className="builder-summary__progress"><span>Step {step} of 3</span><div className="progress-track"><i style={{ width: `${(step / 3) * 100}%` }} /></div></div>
      <p className="builder-summary__note">Nothing is submitted until the final step. Exact product, finish and availability are confirmed by the Crystal Stones team.</p>
    </aside>
  </div>;
}
