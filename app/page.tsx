import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";

export const metadata: Metadata = {
  title: "Techlam & Imported Natural Marble",
  description: "Discover Techlam architectural surfaces, imported natural marble and a wider collection of architectural materials for your project.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return <HomePage />;
}
