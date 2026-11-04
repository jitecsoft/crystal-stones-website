import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { materials } from "@/lib/materials";

export const metadata: Metadata = {
  title: "Granite",
  description: "Explore granite surface options for flooring, countertops and architectural applications. Request a tailored material quotation.",
  alternates: { canonical: "/granite/" }
};

export default function GranitePage() {
  const granite = materials.filter((m) => m.family === "Granite");
  return <main><section className="page-hero"><div className="breadcrumb">Home / Materials / Granite</div><div className="eyebrow">Material family</div><h1>Granite for considered spaces.</h1><p>Explore colour and finish directions for residential and commercial projects. Confirm exact grade, dimensions, finish and availability before final specification.</p></section><section className="catalogue-section"><div className="material-grid">{granite.map((m) => <article className="material-card" key={m.slug}><Link href={`/material/${m.slug}/`}><div className="material-image"><Image src={m.image} alt={`${m.name} inspiration`} fill sizes="(max-width: 650px) 50vw, (max-width: 1000px) 33vw, 30vw" /></div><h3>{m.name}</h3><p>{m.colour} · {m.finish.join(", ")}</p><span className="card-link">Explore material ↗</span></Link></article>)}</div><div style={{marginTop:35}}><Link className="button button-dark" href="/requirement-builder/">Request a granite quotation</Link></div></section></main>;
}
