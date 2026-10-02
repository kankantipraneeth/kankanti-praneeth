import Image from "next/image";
import { profile, summary } from "@/content/site";
import { AboutMotion } from "./AboutMotion";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-b border-rule py-section">
      <AboutMotion className="mx-auto grid max-w-page grid-cols-4 gap-x-gutter px-margin lg:grid-cols-12">
        <div className="col-span-4 lg:col-span-7">
          <p className="label text-muted">01 · About</p>
          <h2 id="about-title" className="mt-4 text-h2">
            About me
          </h2>
          <div className="mt-10 flex flex-col gap-6">
            {summary.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} data-scrub className="max-w-[60ch] text-lead">
                {paragraph}
              </p>
            ))}
          </div>
          <p aria-hidden="true" className="label mt-10 text-muted">
            Body text · Anek Latin 400 · wdth 100
          </p>
        </div>
        <figure className="col-span-4 mt-14 border border-rule lg:col-span-4 lg:col-start-9 lg:mt-0">
          <div className="overflow-hidden">
            <Image data-portrait src={profile.photo} alt={`Portrait of ${profile.name}`} width={1086} height={1448} sizes="(min-width: 1024px) 30vw, 100vw" className="h-auto w-full" />
          </div>
          <figcaption className="label border-t border-rule p-4 text-muted">
            {profile.name} · {profile.location}
          </figcaption>
        </figure>
      </AboutMotion>
    </section>
  );
}
