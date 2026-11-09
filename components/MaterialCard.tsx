import Image from "next/image";
import Link from "next/link";
import type { Material } from "@/lib/materials";

export function MaterialCard({
  material,
  sizes = "(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 33vw",
}: {
  material: Material;
  sizes?: string;
}) {
  return (
    <article className="material-card">
      <Link className="material-card__link" href={`/material/${material.slug}/`}>
        <div className="material-image">
          <Image src={material.image} alt={`${material.name} illustrative material reference`} fill sizes={sizes} />
        </div>
        <div className="material-card__body">
          <p className="material-card__meta">{material.family} · {material.colour}</p>
          <h2>{material.name}</h2>
          <p className="material-card__summary">{material.summary}</p>
          <span className="material-card__link-text">View material details <span aria-hidden="true">↗</span></span>
        </div>
      </Link>
    </article>
  );
}
