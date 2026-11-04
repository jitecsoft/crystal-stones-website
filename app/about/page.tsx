import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Crystal Stones",
  description: "Learn about Crystal Stones and begin a material requirement for your next architectural or interior project.",
  alternates: { canonical: "/about/" }
};

export default function AboutPage() {
  return <main><section className="page-hero"><div className="breadcrumb">Home / About</div><div className="eyebrow">About Crystal Stones</div><h1>Material choices deserve clarity.</h1><p>Crystal Stones helps clients explore stone and surface possibilities for homes, interiors and commercial projects. The aim of this rebuild is to make material discovery, requirement definition and quotation requests simpler.</p></section><section className="section split-section"><div className="section-inner split-grid"><div><h2>From a visual idea to a usable brief.</h2><p>Material selection involves more than colour. Format, finish, thickness, application, cutting requirements and delivery destination all affect the final recommendation.</p><p>This website is being structured to capture those details earlier, so the conversation can start with a clearer project brief.</p><Link className="button button-dark" href="/requirement-builder/">Build your requirement ↗</Link></div><div><ul className="feature-list"><li>Material discovery for trade and private buyers</li><li>Area-based requirement capture</li><li>India and international enquiry paths</li><li>Specifications and availability confirmed before quotation</li></ul></div></div></section></main>;
}
