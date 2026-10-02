import { About } from "@/components/about/About";
import { Experience } from "@/components/experience/Experience";
import { Hero } from "@/components/hero/Hero";
import { Skills } from "@/components/skills/Skills";
import { SpecimenProvider } from "@/components/specimen/SpecimenProvider";
import { MoreProjects } from "@/components/work/MoreProjects";
import { SelectedWork } from "@/components/work/SelectedWork";

export default function Home() {
  return (
    <SpecimenProvider>
      <Hero />
      <About />
      <SelectedWork />
      <MoreProjects />
      <Experience />
      <Skills />
    </SpecimenProvider>
  );
}
