"use client";

import Link from "next/link";
import { useRef, type KeyboardEvent } from "react";
import { projects, skills } from "@/content/site";
import { gsap, MQ, useGSAP } from "@/components/motion/gsap-setup";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useSpecimen } from "@/components/specimen/SpecimenProvider";
import { projectsUsingSkill } from "@/lib/skills";
import { DIM } from "@/lib/specimen";

export function GlyphTable() {
  const { pinnedSkill, setPinnedSkill } = useSpecimen();
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const pinnedProjects = pinnedSkill ? projectsUsingSkill(pinnedSkill, skills, projects) : [];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Reveal animates the <li> wrappers; dimming animates the buttons inside, so the two never share a property.
        gsap.from("[data-cell-wrap]", { autoAlpha: 0, duration: 0.4, ease: "specimen-out", stagger: { each: 0.02, grid: "auto", from: "start" }, scrollTrigger: { trigger: root.current, start: "top 80%", once: true } });
      });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-cell]").forEach((cell) => {
        const on = pinnedSkill === null || cell.dataset.skill === pinnedSkill;
        gsap.to(cell, { opacity: on ? 1 : DIM.text, duration: reduced ? 0 : 0.2, ease: "specimen-out", overwrite: "auto" });
      });
    },
    { dependencies: [pinnedSkill, reduced], scope: root },
  );

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && pinnedSkill) setPinnedSkill(null);
  };

  return (
    <div ref={root} onKeyDown={onKeyDown}>
      <p aria-live="polite" className="min-h-14 border-t border-rule py-4 text-small">
        {pinnedSkill === null ? (
          <span className="label text-muted">Select a skill to see where I used it. Esc clears.</span>
        ) : pinnedProjects.length > 0 ? (
          <>
            <span className="font-semibold text-accent">{pinnedSkill}</span> · used in{" "}
            {pinnedProjects.map((project, index) => (
              <span key={project.slug}>
                {index > 0 ? ", " : ""}
                <Link href={`/work/${project.slug}`} className="underline decoration-rule underline-offset-4 hover:decoration-accent">
                  {project.title}
                </Link>
              </span>
            ))}
          </>
        ) : (
          <>
            <span className="font-semibold text-accent">{pinnedSkill}</span> · listed on my resume; no project on this site shows it yet.
          </>
        )}
      </p>
      {skills.map((group) => {
        const headingId = `skills-${group.name.toLowerCase().replace(/[^a-z]+/g, "-")}`;
        return (
          <div key={group.name} role="group" aria-labelledby={headingId} className="grid grid-cols-1 border-t border-rule lg:grid-cols-[14rem_1fr]">
            <h3 id={headingId} className="label py-4 text-muted lg:pr-4">
              {group.name}
            </h3>
            <ul className="grid grid-cols-2 border-l border-rule sm:grid-cols-3 lg:grid-cols-6">
              {group.skills.map((skill) => (
                <li key={skill.name} data-cell-wrap className="border-b border-r border-rule">
                  <button
                    type="button"
                    data-cell
                    data-skill={skill.name}
                    aria-pressed={pinnedSkill === skill.name}
                    onClick={() => setPinnedSkill(pinnedSkill === skill.name ? null : skill.name)}
                    className="cell relative flex h-full min-h-24 w-full flex-col justify-between gap-3 p-4 text-left"
                  >
                    <span className="text-h3 font-semibold">{skill.name}</span>
                    <span className="label text-muted">{skill.usedIn.length === 0 ? "Resume" : `${skill.usedIn.length} project${skill.usedIn.length > 1 ? "s" : ""}`}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
