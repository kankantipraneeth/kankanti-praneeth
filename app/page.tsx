import { Hero } from "@/components/hero/Hero";
import { SpecimenProvider } from "@/components/specimen/SpecimenProvider";
import { SelectedWork } from "@/components/work/SelectedWork";

export default function Home() {
  return (
    <SpecimenProvider>
      <Hero />
      <SelectedWork />
    </SpecimenProvider>
  );
}
