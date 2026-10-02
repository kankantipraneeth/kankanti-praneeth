import { Hero } from "@/components/hero/Hero";
import { SpecimenProvider } from "@/components/specimen/SpecimenProvider";

export default function Home() {
  return (
    <SpecimenProvider>
      <Hero />
    </SpecimenProvider>
  );
}
