import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { getProject, isTodo, projects } from "@/content/site";
import { CaseReveal } from "@/components/case/CaseReveal";
import { CaseSection } from "@/components/case/CaseSection";
import { Button } from "@/components/ui/Button";
import { FlowPanel } from "@/components/work/FlowPanel";
import { ScoreReadout } from "@/components/work/ScoreReadout";
import { nextProject, projectLinks, statusMarks } from "@/lib/work";
import { Arrow } from "@/components/ui/Arrow";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const description = isTodo(project.problem) ? project.subtitle : project.problem;
  return {
    title: `${project.title}: ${project.subtitle}`,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: project.title, description, type: "article" },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const next = nextProject(project.slug, projects);
  const external = projectLinks(project).filter((link) => link.external);
  const results = project.results.filter((result) => !isTodo(result));

  return (
    <CaseReveal>
      <article className="mx-auto max-w-page px-margin pb-section pt-32">
        <Link href="/#work" className="label inline-flex min-h-11 items-center gap-2 text-muted hover:text-accent">
          <Arrow direction="left" /> All work
        </Link>
        <h1 className="instance-display mt-10 text-display-1">{project.title}</h1>
        <p className="mt-4 text-lead text-muted">{project.subtitle}</p>
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Status">
          {statusMarks(project).map((mark) => (
            <li key={mark} className="label border border-rule px-2 py-1">
              {mark}
            </li>
          ))}
        </ul>
        {external.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-4">
            {external.map((link) => (
              <Button key={link.href} href={link.href} external variant={link.label === "Live site" ? "primary" : "secondary"}>
                {link.label}
              </Button>
            ))}
          </div>
        ) : null}
        <div className="mt-12">
          {project.image ? (
            <ViewTransition name={`work-${project.slug}`}>
              <Image src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} sizes="(min-width: 1440px) 1328px, 100vw" loading="eager" fetchPriority="high" className="h-auto w-full border border-rule" />
            </ViewTransition>
          ) : (
            <FlowPanel steps={project.flow ?? []} />
          )}
        </div>

        <div className="mt-section">
          <CaseSection title="Problem">
            <p className="text-lead">{project.problem}</p>
          </CaseSection>
          <CaseSection title="My role">
            <p className="text-lead">{project.role}</p>
          </CaseSection>
          <CaseSection title="What I built">
            <ul className="flex flex-col gap-4">
              {project.built.map((item) => (
                <li key={item} className="border-l border-rule pl-4">
                  {item}
                </li>
              ))}
            </ul>
          </CaseSection>
          <CaseSection title="Stack">
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <li key={item} className="border border-rule px-3 py-1 text-small">
                  {item}
                </li>
              ))}
            </ul>
          </CaseSection>
          <CaseSection title="Results">
            <ul className="flex flex-col gap-4">
              {results.map((item) => (
                <li key={item} className="border-l border-accent pl-4 text-lead">
                  {item}
                </li>
              ))}
            </ul>
            {project.lighthouse ? (
              <div className="mt-8">
                <ScoreReadout lighthouse={project.lighthouse} />
              </div>
            ) : null}
          </CaseSection>
          {project.gallery.length > 0 ? (
            <CaseSection title="Gallery">
              <div className="flex flex-col gap-8">
                {project.gallery.map((shot) => (
                  <figure key={shot.src}>
                    <Image data-gallery-image src={shot.src} alt={shot.alt} width={1266} height={617} sizes="(min-width: 1024px) 66vw, 100vw" className="h-auto w-full border border-rule" />
                    <figcaption className="label mt-3 text-muted">{shot.alt}</figcaption>
                  </figure>
                ))}
              </div>
            </CaseSection>
          ) : null}
        </div>

        <nav aria-label="Next project" className="mt-section border-t border-rule pt-10">
          <p className="label text-muted">Next project</p>
          <Link href={`/work/${next.slug}`} className="group instance-display mt-4 inline-flex min-h-11 items-baseline gap-4 text-display-2 hover:text-accent">
            {next.title}{" "}
            <span aria-hidden="true" className="arrow">
              <Arrow />
            </span>
          </Link>
        </nav>
      </article>
    </CaseReveal>
  );
}
