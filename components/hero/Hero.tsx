import { heroProof, profile } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { AxisControls } from "./AxisControls";
import { RoleLine } from "./RoleLine";
import { SpecimenGlyph } from "./SpecimenGlyph";

export function Hero() {
  return (
    <section aria-labelledby="hero-name" className="border-b border-rule">
      <div className="mx-auto grid max-w-page grid-cols-4 gap-x-gutter px-margin pb-16 pt-28 lg:grid-cols-12 lg:items-center lg:pb-20 lg:pt-36">
        <div className="col-span-4 lg:col-span-5">
          <h1 id="hero-name" data-hero-name translate="no" className="instance-display text-display-1">
            Kankanti
            <br />
            Praneeth
          </h1>
          <p className="label mt-6 text-muted">
            {profile.role} · {profile.location.split(",")[0]}
          </p>
          <RoleLine className="mt-8 max-w-[34ch] text-lead" />
          <ul aria-label="Proof" className="mt-6 flex max-w-[48ch] flex-wrap gap-x-5 gap-y-1 text-small text-muted">
            {heroProof.map((claim, index) => (
              <li key={claim} className={index === 0 ? "font-semibold text-paper" : undefined}>
                {claim}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={profile.resumeUrl} download>
              Download resume
            </Button>
            <Button href="/#contact" variant="secondary">
              Get in touch
            </Button>
          </div>
        </div>
        <div className="col-span-4 mt-14 lg:col-span-4 lg:mt-0">
          <SpecimenGlyph />
        </div>
        <div className="col-span-4 mt-12 lg:col-span-3 lg:mt-0 lg:border-l lg:border-rule lg:pl-gutter">
          <AxisControls />
        </div>
      </div>
    </section>
  );
}
