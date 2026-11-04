import type { Metadata } from "next";
import { ArchitecturalSurfacesPage } from "@/components/ArchitecturalSurfaces";

export const metadata: Metadata = {
  title: "Architectural Surface Brands",
  description: "Explore Neolith, Dekton, Laminam and Stonelam brand references for architectural surfaces. Confirm current collection coverage, technical details and availability for each project.",
  alternates: { canonical: "/shop/sintered-stone/" },
};

export default function Page() {
  return <ArchitecturalSurfacesPage />;
}
