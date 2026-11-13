import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Materials",
  description: "Explore stone categories — marble, granite, quartzite, onyx, sandstone, travertine and limestone, plus porcelain, sintered stone, quartz and composite surfaces. Find your category, then request a project quotation.",
  alternates: { canonical: "/all-materials/" }
};

const stoneCategories = [
  {
    name: "Marble",
    href: "/marble/",
    image: "/images/catalogue/imported-marble/marble-family-collection.webp",
    alt: "Illustrative arrangement of imported marble samples",
    blurb: "Imported natural marble by origin and variety."
  },
  {
    name: "Granite",
    href: "/granite/",
    image: "/images/catalogue/natural-stone-families/granite-family-collection.webp",
    alt: "Illustrative arrangement of granite samples in several tones",
    blurb: "Hard-wearing granite for countertops, floors and exteriors."
  },
  {
    name: "Quartzite",
    href: "/material/dramatic-quartzite/",
    image: "/images/catalogue/materials/pexels-quartzite.webp",
    alt: "Illustrative quartzite surface with dramatic movement",
    blurb: "Dramatic natural quartzite for feature surfaces."
  },
  {
    name: "Onyx",
    href: "/onyx/",
    image: "/images/catalogue/natural-stone-families/onyx-amber.webp",
    alt: "Illustrative amber onyx surface with translucent banding",
    blurb: "Translucent onyx for backlit and feature applications."
  },
  {
    name: "Sandstone",
    href: "/sandstone/",
    image: "/images/catalogue/natural-stone-families/sandstone.webp",
    alt: "Illustrative layered sandstone surface",
    blurb: "Warm sedimentary stone for facades and landscape."
  },
  {
    name: "Travertine & limestone",
    href: "/travertine/",
    image: "/images/catalogue/natural-stone-families/travertine.webp",
    alt: "Illustrative warm travertine surface",
    blurb: "Warm-toned stone for floors, walls and details."
  },
  {
    name: "Porcelain",
    href: "/shop/porcelain/",
    image: "/images/neolith-interior.webp",
    alt: "Illustrative large-format porcelain surface in a kitchen interior",
    blurb: "Large-format porcelain slabs and tiles."
  },
  {
    name: "Sintered stone",
    href: "/shop/sintered-stone/",
    image: "/images/catalogue/architectural-surfaces/techlam/techlam-showroom.webp",
    alt: "Illustrative showroom of large-format sintered stone slabs",
    blurb: "Sintered-stone surface brands and collections."
  },
  {
    name: "Quartz",
    href: "/all-materials/quartz/",
    image: "/images/catalogue/materials/pexels-porcelain-application.webp",
    alt: "Illustrative engineered stone surface in a bathroom interior",
    blurb: "Engineered quartz surfaces for interiors."
  },
  {
    name: "Composite surfaces",
    href: "/shop/composite/",
    image: "/images/uploads/neolith-facade-reference.webp",
    alt: "Illustrative architectural facade with composite cladding",
    blurb: "Composite and engineered cladding categories."
  }
];

export default function AllMaterialsPage() {
  return <main>
    <section className="page-hero"><div className="breadcrumb">Home / Materials</div><div className="eyebrow">Explore the collection</div><h1>Find the right material for your project.</h1><p>Browse by stone category — natural families like marble, granite, quartzite, onyx, sandstone and travertine, plus porcelain, sintered stone, quartz and composite surfaces. Use the requirement builder to share area, dimensions, finish and delivery needs before requesting a quotation.</p><div className="hero-actions"><Link className="button button-dark" href="/marble/">Imported natural marble</Link><Link className="button button-outline" href="/shop/sintered-stone/">Architectural surface brands</Link></div></section>
    <section className="material-categories">
      <div className="section-shell">
        <div className="section-intro"><div><p className="eyebrow">Stone categories</p><h2>Start with the category.</h2></div><p>Each category leads to its own catalogue where varieties, colours and finishes are listed. Category imagery is illustrative; actual stock and availability are confirmed on enquiry.</p></div>
        <div className="material-categories__grid">
          {stoneCategories.map((category) => (
            <Link key={category.href} href={category.href} className="material-category-card">
              <div className="material-category-card__media"><Image src={category.image} alt={category.alt} fill sizes="(max-width: 760px) 45vw, 22vw" /></div>
              <div className="material-category-card__body"><h2>{category.name}</h2><p>{category.blurb}</p><span className="material-category-card__cta">Explore <em aria-hidden="true">↗</em></span></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  </main>;
}
