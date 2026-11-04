import type { MetadataRoute } from "next";
import { materials } from "@/lib/materials";
import { importedMarbleVarieties, marbleOrigins } from "@/lib/imported-marble";
import { architecturalBrands } from "@/lib/architectural-brands";
import { siteUrl } from "@/lib/site";

const staticRoutes = [
  "", "/all-materials/", "/granite/", "/marble/", "/neolith/", "/onyx/", "/travertine/", "/sandstone/",
  "/all-materials/quartz/", "/all-materials/ceramic/", "/shop/porcelain/", "/shop/composite/",
  "/shop/sintered-stone/", "/all-materials/quartz/caesarstone/", "/about/", "/contact-us/",
  "/faq/", "/how-it-works/", "/projects/", "/blog/", "/requirement-builder/"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl.replace(/\/$/, "");
  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      changeFrequency: (route === "" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: route === "" ? 1 : ["/all-materials/", "/marble/", "/neolith/", "/requirement-builder/"].includes(route) ? 0.9 : 0.65,
    })),
    ...marbleOrigins.map((origin) => ({ url: `${base}/marble/origin/${origin.slug}/`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...architecturalBrands.filter((brand) => brand.slug !== "neolith").map((brand) => ({ url: `${base}${brand.href}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...importedMarbleVarieties.map((item) => ({ url: `${base}/marble/variety/${item.slug}/`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...materials.map((material) => ({ url: `${base}/material/${material.slug}/`, changeFrequency: "monthly" as const, priority: 0.6 }))
  ];
}
