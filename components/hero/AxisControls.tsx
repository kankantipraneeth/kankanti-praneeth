"use client";

import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useSpecimen } from "@/components/specimen/SpecimenProvider";
import { clampAxis, nearestStop, PRESET_HINTS, snapAxis, STOP_LABELS, STOP_ORDER, STOP_VALUES } from "@/lib/specimen";

export function AxisControls() {
  const { axis, setAxis } = useSpecimen();
  const reduced = useReducedMotion();
  const stop = nearestStop(axis);
  const update = (value: number) => setAxis(reduced ? snapAxis(value) : clampAxis(value));

  return (
    <div>
      <h2 className="label text-muted">Filter my work</h2>
      <div className="mt-6 flex items-baseline justify-between text-small">
        <label htmlFor="role-axis">Show my work: Web to AI</label>
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
      <div role="group" aria-labelledby="presets-label" className="mt-4 grid grid-cols-3 border-l border-t border-rule">
        {STOP_ORDER.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={stop === s}
            onClick={() => setAxis(STOP_VALUES[s])}
            className="min-h-16 border-b border-r border-rule p-3 text-left text-small font-semibold aria-pressed:text-accent aria-pressed:outline aria-pressed:outline-1 aria-pressed:-outline-offset-1 aria-pressed:outline-accent"
          >
            {STOP_LABELS[s]}
            <span className="label mt-1 block font-normal text-muted">{PRESET_HINTS[s]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
