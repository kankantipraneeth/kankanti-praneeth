import Image from "next/image";
import { ViewTransition } from "react";
import type { Project } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Readout } from "@/components/ui/Readout";
import { projectLinks, statusMarks } from "@/lib/work";
import { FlowPanel } from "./FlowPanel";
import { ScoreReadout } from "./ScoreReadout";

type WorkSheetProps = {
  project: Project;
  index: number;
  total: number;
  /** Set while a work filter or skill pin is active and this project matches it. */
  match?: string | null;
};

export function WorkSheet({ project, index, total, match = null }: WorkSheetProps) {
  const titleId = `work-${project.slug}-title`;
  return (
    <article data-sheet data-slug={project.slug} aria-labelledby={titleId} className="flex w-full shrink-0 flex-col gap-8 border-t border-rule py-12 lg:flex-row lg:gap-gutter group-data-[track=horizontal]/work:w-[min(78vw,72rem)] group-data-[track=horizontal]/work:border-l group-data-[track=horizontal]/work:border-t-0 group-data-[track=horizontal]/work:px-gutter group-data-[track=horizontal]/work:py-0">
      <div className={`overflow-hidden lg:w-3/5 ${project.image ? "border border-rule lg:self-start" : ""}`}>
        {project.image ? (
          <ViewTransition name={`work-${project.slug}`}>
            <Image data-parallax src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} sizes="(min-width: 1024px) 45vw, 100vw" className="h-auto w-full" />
          </ViewTransition>
        ) : (
          <FlowPanel steps={project.flow ?? []} />
        )}
      </div>
      <div className="flex flex-col gap-6 lg:w-2/5">
        <p className="label text-muted">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <h3 id={titleId} className="sheet-title">
          {project.title}
        </h3>
        <p className="text-lead text-muted">{project.subtitle}</p>
        <ul className="flex flex-wrap gap-2" aria-label="Status">
          {match ? <li className="label border border-accent px-2 py-1 text-accent">Matches · {match}</li> : null}
          {statusMarks(project).map((mark) => (
            <li key={mark} className="label border border-rule px-2 py-1">
              {mark}
            </li>
          ))}
        </ul>
        <Readout label="Stack">{project.stack.join(" · ")}</Readout>
        {project.lighthouse ? <ScoreReadout lighthouse={project.lighthouse} /> : null}
        <div className="mt-auto flex flex-wrap gap-x-6 gap-y-3">
          {projectLinks(project).map((link) => (
            <Button key={link.href} href={link.href} variant="link" external={link.external}>
              {link.label}
              {link.label === "Case study" ? <span className="sr-only">: {project.title}</span> : null}
            </Button>
          ))}
        </div>
      </div>
    </article>
  );
}
