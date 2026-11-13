import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublishedMediaGallery } from "@/components/PublishedMediaGallery";
import { materials } from "@/lib/materials";
import {
  categoryApplicationImages,
  categoryFallbackImages,
  getPublishedProduct,
  getProductCoverUrl,
  productCategory,
  productCategoryLabel,
  subfamilyLabel,
  type CatalogueProduct
} from "@/lib/products/db";

export const dynamicParams = true;

export function generateStaticParams() {
  return materials.map((material) => ({ slug: material.slug }));
}

function productMetadata(product: CatalogueProduct, image?: string | null): Metadata {
  const category = productCategory(product.category);
  const title = product.seo_title || product.name;
  const description = product.seo_description || product.summary || `${product.name} — ${productCategoryLabel(product.category)} reference from Crystal Stones.`;
  return {
    title,
    description,
    alternates: { canonical: `/material/${product.slug}/` },
    openGraph: { title, description, images: image ? [{ url: image, alt: product.name }] : category ? [{ url: categoryFallbackImages[category.slug], alt: `${productCategoryLabel(product.category)} reference image` }] : undefined },
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const material = materials.find((m) => m.slug === slug);
  if (material) {
    return {
      title: material.name,
      description: material.summary,
      alternates: { canonical: `/material/${material.slug}/` },
      openGraph: { images: [material.image] }
    };
  }
  const product = await getPublishedProduct(slug);
  if (!product) return { title: "Material not found" };
  return productMetadata(product, await getProductCoverUrl(product.slug));
}

function ProductDetails({ product, cover }: { product: CatalogueProduct; cover: string }) {
  const category = productCategory(product.category);
  const categoryLabel = productCategoryLabel(product.category);
  const applicationImage = category ? categoryApplicationImages[category.slug] : null;
  const origin = [product.origin_country, product.origin_region].filter(Boolean).join(" · ");
  const rows = [
    ["Category", categoryLabel],
    ...(product.subfamily ? [["Sub-family", subfamilyLabel(product.subfamily)]] : []),
    ["Origin", origin || "Confirm on enquiry"],
    ["Colour direction", product.colours.join(", ") || "Confirm from current material"],
    ["Visual pattern", product.patterns.join(", ") || "Confirm from current material"],
    ["Available finishes", product.finishes.join(", ") || "Confirm for requested lot"],
    ["Typical applications", product.applications.join(", ") || "Confirm for the project"],
    ["Availability", "Request price & availability"]
  ];
  const enquiry = `/requirement-builder/?${new URLSearchParams({ material: categoryLabel, stone: product.name, ...(product.tags.length ? { notes: `Interested in: ${product.tags.join(", ")}` } : {}) }).toString()}`;
  return <main>
    <section className="material-detail">
      <PublishedMediaGallery contentType="product" slug={product.slug} fallbackSrc={cover} fallbackAlt={`${categoryLabel} illustrative reference`} fallbackNote="Illustrative category reference · Published product photography appears here once the team attaches images" className="material-detail__gallery" />
      <div>
        <div className="breadcrumb"><Link href="/">Home</Link> / {category && <Link href={category.listingHref}>{category.listingLabel}</Link>} / {product.name}</div>
        <div className="eyebrow">{product.subfamily ? subfamilyLabel(product.subfamily) : categoryLabel}{product.attributes_verified ? " · Attributes verified" : ""}</div>
        <h1>{product.name}</h1>
        <p className="muted">{product.summary}</p>
        {product.description && <p className="material-detail__description">{product.description}</p>}
        <div className="spec-list">
          {rows.map(([label, value]) => <div className="spec-row" key={label}><span>{label}</span><b>{value}</b></div>)}
          {product.tags.length > 0 && <div className="spec-row"><span>Tags</span><b>{product.tags.join(" · ")}</b></div>}
        </div>
        <p className="note">Natural material varies between blocks and lots. Exact identity, origin, dimensions, technical properties and current stock must be confirmed by Crystal Stones before ordering.</p>
        <Link className="button button-dark" href={enquiry}>Request price &amp; availability <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
    {applicationImage && <section className="application-showcase">
      <div className="section-shell">
        <div className="application-showcase__intro"><p className="eyebrow">Seen in a space</p><h2>Applied in an interior.</h2><p>Typical settings for {product.applications.length ? product.applications.join(", ").toLowerCase() : "this category"} — request material photographs to confirm the actual stone.</p></div>
        <figure><div className="application-showcase__media"><Image src={applicationImage.src} alt={applicationImage.alt} fill sizes="(max-width: 900px) 92vw, 1040px" /></div><figcaption>Illustrative interior · Shown to demonstrate the setting, not this specific product.</figcaption></figure>
      </div>
    </section>}
    {product.care_notes && <section className="material-detail-care">
      <div className="section-shell">
        <p className="eyebrow">Care &amp; specification</p>
        <h2>Confirm the material before specifying.</h2>
        <p>{product.care_notes}</p>
      </div>
    </section>}
  </main>;
}

export default async function MaterialPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const material = materials.find((m) => m.slug === slug);
  if (material) {
    return <main><section className="material-detail">
      <PublishedMediaGallery contentType="material" slug={material.slug} fallbackSrc={material.image} fallbackAlt={`${material.name} illustrative material reference`} fallbackNote="Illustrative material image · Exact product photography is not yet connected" className="material-detail__gallery" />
      <div><div className="breadcrumb"><Link href="/">Home</Link> / <Link href="/all-materials/">Materials</Link> / {material.family}</div><div className="eyebrow">{material.family}</div><h1>{material.name}</h1><p className="muted">{material.summary}</p><div className="spec-list"><div className="spec-row"><span>Colour direction</span><b>{material.colour}</b></div><div className="spec-row"><span>Possible finishes</span><b>{material.finish.join(", ")}</b></div><div className="spec-row"><span>Applications</span><b>{material.applications.join(", ")}</b></div><div className="spec-row"><span>Availability</span><b>Confirm on enquiry</b></div></div><p className="note">Illustrative reference only. Exact stone identity, origin, slab dimensions, technical properties and current stock must be confirmed by Crystal Stones.</p><Link className="button button-dark" href={`/requirement-builder/?material=${encodeURIComponent(material.family)}&colour=${encodeURIComponent(material.colour)}&stone=${encodeURIComponent(material.name)}`}>Build a requirement for this material ↗</Link></div>
    </section>
    {material.applicationImage && <section className="application-showcase">
      <div className="section-shell">
        <div className="application-showcase__intro"><p className="eyebrow">Seen in a space</p><h2>Applied in an interior.</h2><p>Beyond the slab, here is the kind of setting this material is used in — {material.applications.join(", ").toLowerCase()}.</p></div>
        <figure><div className="application-showcase__media"><Image src={material.applicationImage.src} alt={material.applicationImage.alt} fill sizes="(max-width: 900px) 92vw, 1040px" /></div><figcaption>Illustrative interior · Shown to demonstrate the setting, not this specific stone.</figcaption></figure>
      </div>
    </section>}</main>;
  }
  const product = await getPublishedProduct(slug);
  if (!product) notFound();
  const category = productCategory(product.category);
  const cover = (await getProductCoverUrl(product.slug)) ?? (category ? categoryFallbackImages[category.slug] : "/images/marble-sourcing.webp");
  return <ProductDetails product={product} cover={cover} />;
}
