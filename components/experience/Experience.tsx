import { experience } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { formatMonth } from "@/lib/format";
import { TimelineMotion } from "./TimelineMotion";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="border-b border-rule py-section">
      <div className="mx-auto grid max-w-page grid-cols-4 gap-x-gutter px-margin lg:grid-cols-12">
        <div className="col-span-4 lg:col-span-4">
          <h2 id="experience-title" className="text-h2">
            AI engineering at Viswam.AI
          </h2>
        </div>
        <TimelineMotion className="relative col-span-4 mt-10 pl-10 lg:col-span-8 lg:mt-0">
          <span data-line aria-hidden="true" className="absolute left-0 top-0 h-full w-px origin-top bg-paper" />
          {experience.map((job) => (
            <article key={job.id} aria-labelledby={`job-${job.id}`} className="pb-4">
              <ol aria-label="Dates" className="flex flex-col gap-2">
                <li data-tick className="label text-accent">
                  {formatMonth(job.start)}
                </li>
              </ol>
              <h3 id={`job-${job.id}`} className="instance-display mt-4 text-display-2">
                {job.role}
              </h3>
              <p className="mt-3 text-lead text-muted">
                {job.company} ({job.org}) · {job.location}
              </p>
              <Reveal>
                <ul className="mt-8 flex flex-col gap-4">
                  {job.bullets.map((bullet) => (
                    <li key={bullet} data-reveal className="max-w-[60ch] border-t border-rule pt-4">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <p data-tick className="label mt-8 text-muted">
                {formatMonth(job.end)}
              </p>
            </article>
          ))}
        </TimelineMotion>
      </div>
    </section>
  );
}
