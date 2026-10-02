"use client";

import { useRef } from "react";
import { featuredProjects, getProject, skills } from "@/content/site";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/components/motion/gsap-setup";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useSpecimen } from "@/components/specimen/SpecimenProvider";
import { nearestStop, STOP_LABELS } from "@/lib/specimen";
import { isEmphasized } from "@/lib/work";
import { WorkSheet } from "./WorkSheet";

export function SelectedWork() {
  const { axis, pinnedSkill } = useSpecimen();
  const stop = nearestStop(axis);
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const total = featuredProjects.length;

  // Layout motion: pinned horizontal track on desktop, one-time reveals on mobile.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, motion: MQ.motion }, (context) => {
        const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
        const sheets = gsap.utils.toArray<HTMLElement>("[data-sheet]");
        if (!motion) return;
        if (!desktop) {
          gsap.set(sheets, { autoAlpha: 0, y: 24 });
          ScrollTrigger.batch(sheets, {
            start: "top 85%",
            once: true,
            onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.4, ease: "specimen-out", stagger: 0.05, overwrite: true }),
          });
          return;
        }
        const trackEl = track.current;
        if (!trackEl) return;
        const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (counter.current) counter.current.textContent = `${String(Math.min(total, Math.floor(self.progress * total) + 1)).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
            },
          },
        });
        tl.to(trackEl, { x: () => -distance(), ease: "none" }, 0);
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((image) => tl.fromTo(image, { xPercent: -6 }, { xPercent: 0, ease: "none" }, 0));
      });
    },
    { scope: section },
  );

  // Emphasis: dim sheets that don't match the axis stop or the pinned skill.
  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-sheet]").forEach((sheet) => {
        const project = getProject(sheet.dataset.slug ?? "");
        if (!project) return;
        const on = isEmphasized(project, stop, pinnedSkill, skills);
        sheet.dataset.emphasis = on ? "on" : "off";
        gsap.to(sheet, { opacity: on ? 1 : 0.45, duration: reduced ? 0 : 0.4, ease: "specimen-out", overwrite: "auto" });
      });
    },
    { dependencies: [stop, pinnedSkill, reduced], scope: section },
  );

  const emphasisLabel = pinnedSkill ? `Pinned: ${pinnedSkill}` : stop === "fullstack" ? "All work" : `${STOP_LABELS[stop]} work highlighted`;

  return (
    <section ref={section} id="work" aria-labelledby="work-title" className="overflow-hidden border-b border-rule lg:flex lg:h-svh lg:flex-col">
      <div className="mx-auto flex w-full max-w-page flex-wrap items-baseline justify-between gap-4 px-margin pb-10 pt-section lg:pb-8 lg:pt-28">
        <div>
          <p className="label text-muted">02 · Selected work</p>
          <h2 id="work-title" className="mt-4 text-h2">
            Shipped for real clients and real users
          </h2>
        </div>
        <p className="label text-muted" aria-live="polite">
          {emphasisLabel}
          <span ref={counter} aria-hidden="true" className="ml-4 hidden lg:inline">
            01 / {String(total).padStart(2, "0")}
          </span>
        </p>
      </div>
      <div ref={track} className="flex flex-col px-margin lg:min-h-0 lg:flex-1 lg:flex-row lg:items-center lg:pb-16">
        {featuredProjects.map((project, index) => (
          <WorkSheet key={project.slug} project={project} index={index} total={total} />
        ))}
      </div>
    </section>
  );
}
