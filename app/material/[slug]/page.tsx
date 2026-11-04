import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublishedMediaGallery } from "@/components/PublishedMediaGallery";
import { materials } from "@/lib/materials";

export function generateStaticParams() {
  return materials.map((material) => ({ slug: material.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const material = materials.find((m) => m.slug === slug);
  if (!material) return { title: "Material not found" };
  return {
    title: material.name,
    description: material.summary,
    alternates: { canonical: `/material/${material.slug}/` },
    openGraph: { images: [material.image] }
  };
}

export default async function MaterialPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const material = materials.find((m) => m.slug === slug);
  if (!material) notFound();
  return <main><section className="material-detail">
    <PublishedMediaGallery contentType="material" slug={material.slug} fallbackSrc={material.image} fallbackAlt={`${material.name} illustrative material reference`} fallbackNote="Illustrative material image · Exact product photography is not yet connected" className="material-detail__gallery" />
    <div><div className="breadcrumb"><Link href="/">Home</Link> / <Link href="/all-materials/">Materials</Link> / {material.family}</div><div className="eyebrow">{material.family}</div><h1>{material.name}</h1><p className="muted">{material.summary}</p><div className="spec-list"><div className="spec-row"><span>Colour direction</span><b>{material.colour}</b></div><div className="spec-row"><span>Possible finishes</span><b>{material.finish.join(", ")}</b></div><div className="spec-row"><span>Applications</span><b>{material.applications.join(", ")}</b></div><div className="spec-row"><span>Availability</span><b>Confirm on enquiry</b></div></div><p className="note">Illustrative reference only. Exact stone identity, origin, slab dimensions, technical properties and current stock must be confirmed by Crystal Stones.</p><Link className="button button-dark" href={`/requirement-builder/?material=${encodeURIComponent(material.family)}&colour=${encodeURIComponent(material.colour)}&stone=${encodeURIComponent(material.name)}`}>Build a requirement for this material ↗</Link></div>
  </section></main>;
}
