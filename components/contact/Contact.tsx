import { profile } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { CopyEmail } from "./CopyEmail";
import { Magnetic } from "./Magnetic";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="py-section">
      <div className="mx-auto max-w-page px-margin">
        <p className="label text-muted">06 · Contact</p>
        <h2 id="contact-title" className="mt-4 max-w-[22ch] text-h2">
          Hiring, or need a website or an automation built?
        </h2>
        <div className="mt-12">
          <CopyEmail email={profile.email} />
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <Magnetic>
            <Button href={`mailto:${profile.email}`} variant="primary" external={false}>
              Write an email
            </Button>
          </Magnetic>
          <Magnetic>
            <Button href={profile.linkedin} variant="secondary" external>
              LinkedIn
            </Button>
          </Magnetic>
          <Magnetic>
            <Button href={profile.github} variant="secondary" external>
              GitHub
            </Button>
          </Magnetic>
          <Magnetic>
            <Button href={profile.resumeUrl} variant="secondary" download>
              Download resume
            </Button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
