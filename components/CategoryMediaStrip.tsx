import Image from "next/image";
import { getPublishedCategoryMedia } from "@/lib/media/published";

/**
 * Published team photography for an entire stone category (photos the team
 * tagged simply "Granite", "Marble" and so on in the media library). Renders
 * nothing while no photos have been published for the category.
 */
export async function CategoryMediaStrip({ category, heading, copy }: { category: string; heading: string; copy: string }) {
  const images = await getPublishedCategoryMedia(category);
  if (!images.length) return null;
  return (
    <section className="category-media" aria-label={heading}>
      <div className="section-shell">
        <div className="section-intro">
          <div><p className="eyebrow">From the team</p><h2>{heading}</h2></div>
          <p>{copy}</p>
        </div>
        <div className="category-media__grid">
          {images.map((image) => (
            <figure key={image.id}>
              <div className="category-media__frame"><Image src={image.url} alt={image.alt} width={image.width} height={image.height} unoptimized sizes="(max-width: 700px) 92vw, 440px" /></div>
              {(image.caption || image.attribution) && <figcaption>{image.caption}{image.attribution && <small>{image.attribution}</small>}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
