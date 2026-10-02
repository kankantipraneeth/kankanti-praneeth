import Link from "next/link";
import { projects } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { statusMarks } from "@/lib/work";

export function MoreProjects() {
  const more = projects.filter((project) => !project.featured).sort((a, b) => a.order - b.order);
  if (more.length === 0) return null;
  return (
    <section aria-labelledby="more-title" className="border-b border-rule py-16">
      <div className="mx-auto max-w-page px-margin">
        <h2 id="more-title" className="label text-muted">
          More projects
        </h2>
        <Reveal>
          <ul className="mt-6">
            {more.map((project) => (
              <li key={project.slug} data-reveal className="border-t border-rule">
                <Link href={`/work/${project.slug}`} className="group grid grid-cols-1 gap-2 py-6 lg:grid-cols-[1fr_auto_auto] lg:items-baseline lg:gap-8">
                  <span className="instance-display text-h2 group-hover:text-accent">{project.title}</span>
                  <span className="text-small text-muted">{project.subtitle}</span>
                  <span className="label text-muted">
                    {statusMarks(project).join(" · ")} <span aria-hidden="true" className="arrow">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
