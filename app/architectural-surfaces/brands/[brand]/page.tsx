import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchitecturalBrandPage } from "@/components/ArchitecturalSurfaces";
import { architecturalBrands, getArchitecturalBrand } from "@/lib/architectural-brands";

type Props = { params: Promise<{ brand: string }> };

export function generateStaticParams() {
  return architecturalBrands.filter((brand) => brand.slug !== "neolith").map((brand) => ({ brand: brand.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: slug } = await params;
  const brand = getArchitecturalBrand(slug);
  if (!brand || brand.slug === "neolith") return {};
  return {
    title: `${brand.name} Architectural Surfaces`,
    description: `${brand.summary} Ask for current range information, product-specific details and availability for your project.`,
    alternates: { canonical: brand.href },
    openGraph: { title: `${brand.name} Architectural Surfaces`, description: brand.summary },
  };
}

export default async function BrandPage({ params }: Props) {
  const { brand: slug } = await params;
  const brand = getArchitecturalBrand(slug);
  if (!brand || brand.slug === "neolith") notFound();
  return <ArchitecturalBrandPage brand={brand} />;
}
