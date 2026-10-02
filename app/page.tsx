import type { Metadata } from "next";
import { About } from "@/components/about/About";
import { education, profile, skills } from "@/content/site";
import { SITE_URL } from "@/lib/site-url";
import { jsonLdScript, personJsonLd } from "@/lib/structured-data";
import { Contact } from "@/components/contact/Contact";
import { Credentials } from "@/components/credentials/Credentials";
import { Experience } from "@/components/experience/Experience";
import { Hero } from "@/components/hero/Hero";
import { Skills } from "@/components/skills/Skills";
import { SpecimenProvider } from "@/components/specimen/SpecimenProvider";
import { MoreProjects } from "@/components/work/MoreProjects";
import { SelectedWork } from "@/components/work/SelectedWork";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <SpecimenProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(personJsonLd(profile, education, skills, SITE_URL)) }} />
      <Hero />
      <SelectedWork />
      <MoreProjects />
      <About />
      <Experience />
      <Skills />
      <Credentials />
      <Contact />
    </SpecimenProvider>
  );
}
