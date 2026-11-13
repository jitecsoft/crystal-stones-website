import Image from "next/image";
import { getPublishedCategoryPhotos } from "@/lib/media/published";

type StripImage = { id: string; url: string; alt: string; caption: string; attribution: string; width: number; height: number };

function Grid({ images }: { images: StripImage[] }) {
  return (
    <div className="category-media__grid">
      {images.map((image) => (
        <figure key={image.id}>
          <div className="category-media__frame"><Image src={image.url} alt={image.alt} width={image.width} height={image.height} unoptimized sizes="(max-width: 700px) 92vw, 440px" /></div>
          {(image.caption || image.attribution) && <figcaption>{image.caption}{image.attribution && <small>{image.attribution}</small>}</figcaption>}
        </figure>
      ))}
    </div>
  );
}

/**
 * Published team photography for a stone category: photos tagged with the
 * category itself, then one group per colour-family sub-category that has
 * photos (e.g. "White marble", "Black granite"). Renders nothing while no
 * photos have been published for the category.
 */
export async function CategoryMediaStrip({ category, heading, copy }: { category: string; heading: string; copy: string }) {
  const photos = await getPublishedCategoryPhotos(category);
  if (!photos.general.length && !photos.groups.length) return null;
  return (
    <section className="category-media" aria-label={heading}>
      <div className="section-shell">
        <div className="section-intro">
          <div><p className="eyebrow">From the team</p><h2>{heading}</h2></div>
          <p>{copy}</p>
        </div>
        {photos.general.length > 0 && <Grid images={photos.general} />}
        {photos.groups.map((group) => (
          <div className="category-media__group" key={group.slug}>
            <h3>{group.label}</h3>
            <Grid images={group.images} />
          </div>
        ))}
      </div>
    </section>
  );
}
