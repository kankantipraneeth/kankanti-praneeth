"use client";

import type { MouseEvent } from "react";
import { featuredProjects, roleLines, skills } from "@/content/site";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useSpecimen } from "@/components/specimen/SpecimenProvider";
import { clampAxis, nearestStop, PRESET_HINTS, snapAxis, STOP_LABELS, STOP_ORDER, STOP_VALUES } from "@/lib/specimen";
import { isEmphasized } from "@/lib/work";
import { showWork } from "@/components/work/show-work";
import { Arrow } from "@/components/ui/Arrow";

export function AxisControls() {
  const { axis, setAxis } = useSpecimen();
  const reduced = useReducedMotion();
  const stop = nearestStop(axis);
  const update = (value: number) => setAxis(reduced ? snapAxis(value) : clampAxis(value));
  const matchingProjects = featuredProjects.filter((project) => isEmphasized(project, stop, null, skills));
  const matching = matchingProjects.length;
  // Lands on the first matching sheet (e.g. the AI projects are 03–04), not the top of the section.
  const seeWork = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    showWork((matchingProjects[0] ?? featuredProjects[0]).slug);
  };

  return (
    <div>
      <h2 className="label text-muted">Filter my work</h2>
      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-small">
        <label htmlFor="role-axis">Show my work</label>
        <span aria-hidden="true" className="font-mono text-readout text-accent">
          {STOP_LABELS[stop]} work
        </span>
      </div>
      <input
        id="role-axis"
        type="range"
        min={0}
        max={100}
        step={reduced ? 50 : 5}
        value={axis}
        aria-valuetext={`${STOP_LABELS[stop]} work`}
        onChange={(event) => update(Number(event.target.value))}
        className="axis-range mt-4 w-full"
      />
      <div aria-hidden="true" className="label mt-2 flex justify-between text-muted">
        <span>Web</span>
        <span>AI</span>
      </div>
      <p id="presets-label" className="label mt-10 text-muted">
        Jump to
      </p>
      <div role="group" aria-labelledby="presets-label" className="mt-4 grid grid-cols-3 border-l border-t border-rule lg:grid-cols-1">
        {STOP_ORDER.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={stop === s}
            onClick={() => setAxis(STOP_VALUES[s])}
            className="min-h-16 border-b border-r border-rule p-3 text-left text-small font-semibold hover:bg-ink-raised lg:flex lg:min-h-12 lg:items-baseline lg:justify-between lg:gap-3 aria-pressed:text-accent aria-pressed:outline aria-pressed:outline-1 aria-pressed:-outline-offset-1 aria-pressed:outline-accent"
          >
            {STOP_LABELS[s]}
            <span className="label mt-1 block whitespace-nowrap font-normal text-muted lg:mt-0">{PRESET_HINTS[s]}</span>
          </button>
        ))}
      </div>
      {/* On mobile the role line sits far above these controls; mirror it here so the change is visible where you act.
          aria-hidden: the hero's own role line is the live region that announces it. */}
      <p aria-hidden="true" className="mt-6 text-small text-muted lg:hidden">
        {roleLines[stop]}
      </p>
      <a href="#work" onClick={seeWork} className="group mt-6 inline-flex min-h-11 items-center gap-2 text-small font-semibold underline decoration-rule underline-offset-[6px] hover:decoration-accent">
        {stop === "fullstack" ? `See all ${matching} projects` : `See the ${matching} ${STOP_LABELS[stop]} projects`}
        <span aria-hidden="true" className="arrow">
          <Arrow direction="down" />
        </span>
      </a>
    </div>
  );
}
