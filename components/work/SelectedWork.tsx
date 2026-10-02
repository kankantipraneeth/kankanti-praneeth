"use client";

import { useRef } from "react";
import { featuredProjects, getProject, skills } from "@/content/site";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/components/motion/gsap-setup";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useSpecimen } from "@/components/specimen/SpecimenProvider";
import { DIM, nearestStop, STOP_LABELS } from "@/lib/specimen";
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
          // Opacity only so the sheets' links stay keyboard-focusable; focusing inside a sheet shows it at once.
          gsap.set(sheets, { opacity: 0, y: 24 });
          ScrollTrigger.batch(sheets, {
            start: "top 85%",
            once: true,
            onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.4, ease: "specimen-out", stagger: 0.05, overwrite: true }),
          });
          const showFocused = (event: FocusEvent) => {
            const sheet = (event.target as HTMLElement).closest<HTMLElement>("[data-sheet]");
            if (sheet) gsap.set(sheet, { opacity: 1, y: 0, overwrite: true });
          };
          const trackEl = track.current;
          trackEl?.addEventListener("focusin", showFocused);
          return () => trackEl?.removeEventListener("focusin", showFocused);
        }
        const trackEl = track.current;
        const sectionEl = section.current;
        if (!trackEl || !sectionEl) return;
        // The horizontal layout exists only while this branch is active. Without JS, under reduced motion and below
        // 1024px the sheets stay a readable vertical stack. Set before measuring so scrollWidth sees the row layout.
        sectionEl.dataset.track = "horizontal";
        // Measure to the last sheet's edge plus the track's end padding: flex overflow ignores padding-right,
        // so scrollWidth alone left the final sheet flush against the viewport edge.
        const distance = () => {
          const last = trackEl.lastElementChild as HTMLElement | null;
          if (!last) return 0;
          const endPadding = parseFloat(getComputedStyle(trackEl).paddingRight) || 0;
          return Math.max(0, last.offsetLeft + last.offsetWidth + endPadding - window.innerWidth);
        };
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
        // A slight zoom gives the drift its own slack, so the screenshot edges (and logos near them) never leave the frame.
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((image) => tl.fromTo(image, { scale: 1.06, xPercent: -2.5 }, { scale: 1.06, xPercent: 2.5, ease: "none" }, 0));
        return () => {
          delete sectionEl.dataset.track;
        };
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
        // Dim the sheet's columns, not the sheet itself: the mobile reveal animates the sheet's opacity.
        // Screenshots dim further than text so de-emphasised copy stays at WCAG AA contrast.
        const [visual, text] = Array.from(sheet.children) as HTMLElement[];
        const settings = { duration: reduced ? 0 : 0.4, ease: "specimen-out", overwrite: "auto" } as const;
        if (visual) gsap.to(visual, { ...settings, opacity: on ? 1 : visual.querySelector("img") ? DIM.image : DIM.text });
        if (text) gsap.to(text, { ...settings, opacity: on ? 1 : DIM.text });
      });
    },
    { dependencies: [stop, pinnedSkill, reduced], scope: section },
  );

  const filterActive = pinnedSkill !== null || stop !== "fullstack";
  const matchLabel = pinnedSkill ?? `${STOP_LABELS[stop]} work`;
  const emphasisLabel = pinnedSkill ? `Pinned: ${pinnedSkill}` : stop === "fullstack" ? "All work" : `${STOP_LABELS[stop]} work highlighted`;

  return (
    <section ref={section} id="work" aria-labelledby="work-title" className="group/work relative overflow-hidden border-b border-rule data-[track=horizontal]:flex data-[track=horizontal]:h-svh data-[track=horizontal]:flex-col">
      <div className="mx-auto flex w-full max-w-page flex-wrap items-baseline justify-between gap-4 px-margin pb-10 pt-section group-data-[track=horizontal]/work:pb-8 group-data-[track=horizontal]/work:pt-28">
        <div>
          <h2 id="work-title" className="text-h2">
            Shipped for real clients and real users
          </h2>
        </div>
        <p className="label text-muted">
          {emphasisLabel}
          <span ref={counter} aria-hidden="true" className="ml-4 hidden group-data-[track=horizontal]/work:inline">
            01 / {String(total).padStart(2, "0")}
          </span>
        </p>
      </div>
      <div ref={track} className="flex flex-col px-margin group-data-[track=horizontal]/work:min-h-0 group-data-[track=horizontal]/work:flex-1 group-data-[track=horizontal]/work:flex-row group-data-[track=horizontal]/work:items-center group-data-[track=horizontal]/work:pb-16">
        {featuredProjects.map((project, index) => (
          <WorkSheet key={project.slug} project={project} index={index} total={total} match={filterActive && isEmphasized(project, stop, pinnedSkill, skills) ? matchLabel : null} />
        ))}
      </div>
    </section>
  );
}
