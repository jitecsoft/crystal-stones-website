import Link from "next/link";
import type { CatalogueProduct } from "@/lib/products/db";
import { productCategoryLabel, subfamilyLabel } from "@/lib/products/db";

export function ProductCardStrip({ products, heading, copy }: { products: CatalogueProduct[]; heading: string; copy: string }) {
  if (!products.length) return null;
  return (
    <section className="product-strip" aria-label={heading}>
      <div className="section-shell">
        <div className="section-intro">
          <div><p className="eyebrow">Team catalogue</p><h2>{heading}</h2></div>
          <p>{copy}</p>
        </div>
        <div className="product-strip__grid">
          {products.map((product) => (
            <Link href={`/material/${product.slug}/`} key={product.id} className="product-strip__card">
              <span className="product-strip__category">{product.subfamily ? subfamilyLabel(product.subfamily) : productCategoryLabel(product.category)}</span>
              <h3>{product.name}</h3>
              {product.summary && <p>{product.summary}</p>}
              <b>View product <em aria-hidden="true">↗</em></b>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
