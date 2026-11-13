import type { Metadata } from "next";
import { RequirementBuilder } from "@/components/RequirementBuilder";

export const metadata: Metadata = {
  title: "Build Your Stone Requirement",
  description: "Configure your stone requirement by material, colour, application, area, quantity, dimensions, finish and delivery destination.",
  alternates: { canonical: "/requirement-builder/" }
};

export default function RequirementBuilderPage() {
  return <main><section className="builder-wrap"><div className="builder-intro"><div className="eyebrow">Project requirement builder</div><h1>Start with the space and the specification.</h1><p>Configure the material, enter your measured area or quantity, and share the dimensions and finish you need. If you are not sure yet, choose the closest option and ask for guidance.</p></div><RequirementBuilder /></section></main>;
}
