"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type PublishedMedia = { id: string; title: string; alt: string; caption: string; attribution: string; variant: string; width: number; height: number; placement: string; position: number; url: string };

type Props = { contentType: "material" | "marble_variety" | "brand" | "product"; slug: string; fallbackSrc: string; fallbackAlt: string; fallbackNote: string; className?: string };

export function PublishedMediaGallery({ contentType, slug, fallbackSrc, fallbackAlt, fallbackNote, className = "" }: Props) {
  const [items, setItems] = useState<PublishedMedia[]>([]);
  useEffect(() => {
    let active = true;
    fetch(`/api/media?type=${encodeURIComponent(contentType)}&slug=${encodeURIComponent(slug)}`, { headers: { Accept: "application/json" } })
      .then((response) => response.ok ? response.json() : { items: [] })
      .then((result: { items?: PublishedMedia[] }) => { if (active && Array.isArray(result.items)) setItems(result.items); })
      .catch(() => { if (active) setItems([]); });
    return () => { active = false; };
  }, [contentType, slug]);

  if (!items.length) return <figure className={className}>
    <Image src={fallbackSrc} alt={fallbackAlt} fill priority sizes="(max-width: 800px) 100vw, 52vw" />
    <figcaption><strong>Illustrative development image</strong><span>{fallbackNote}</span></figcaption>
  </figure>;

  return <div className={`published-media-gallery ${className}`} aria-label="Published product images">
    {items.map((item) => <figure className="published-media-item" key={`${item.id}-${item.variant}`}>
      <Image src={item.url} alt={item.alt || item.title || ""} width={item.width} height={item.height} unoptimized sizes="(max-width: 800px) 100vw, 52vw" priority={item.position === 0} />
      {(item.caption || item.attribution) && <figcaption>{item.caption && <span>{item.caption}</span>}{item.attribution && <small>{item.attribution}</small>}</figcaption>}
    </figure>)}
  </div>;
}
