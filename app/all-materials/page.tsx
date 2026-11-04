import type { Metadata } from "next";
import Link from "next/link";
import { materials, families, colours } from "@/lib/materials";
import { Catalogue } from "@/components/Catalogue";

export const metadata: Metadata = {
  title: "All Materials",
  description: "Explore marble, granite, quartzite, travertine and architectural surface material references. Filter by family and colour, then request a project quotation.",
  alternates: { canonical: "/all-materials/" }
};

export default function AllMaterialsPage() {
  return <main><section className="page-hero"><div className="breadcrumb">Home / Materials</div><div className="eyebrow">Explore the collection</div><h1>Find the right material for your project.</h1><p>Browse by stone family and colour. Use the requirement builder to share area, dimensions, finish and delivery needs before requesting a quotation.</p><div className="hero-actions"><Link className="button button-dark" href="/marble/">Imported natural marble</Link><Link className="button button-outline" href="/shop/sintered-stone/">Architectural surface brands</Link></div></section><Catalogue materials={materials} families={families} colours={colours} /></main>;
}
