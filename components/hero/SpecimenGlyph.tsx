"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap-setup";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useSpecimen } from "@/components/specimen/SpecimenProvider";
import { axisToInstance, formatReadout, formatVariation, INSTANCES, type Instance } from "@/lib/specimen";

export function SpecimenGlyph() {
  const { axis } = useSpecimen();
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const glyph = useRef<HTMLSpanElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const current = useRef<Instance>({ ...INSTANCES.fullstack });

  useGSAP(
    () => {
      const apply = () => {
        if (glyph.current) glyph.current.style.fontVariationSettings = formatVariation(current.current);
        if (readout.current) readout.current.textContent = formatReadout(current.current);
      };
      const target = axisToInstance(axis);
      if (reduced) {
        gsap.killTweensOf(current.current);
        Object.assign(current.current, target);
        apply();
        return;
      }
      gsap.to(current.current, { ...target, duration: 0.4, ease: "specimen-move", overwrite: true, onUpdate: apply });
    },
    { dependencies: [axis, reduced], scope: root },
  );

  return (
    <figure ref={root} className="mx-auto flex w-[min(78vw,36rem)] flex-col gap-4 lg:w-full">
      <div className="flex items-stretch gap-6">
        <div className="glyph-box relative aspect-square flex-1">
          <span ref={glyph} aria-hidden="true" className="absolute inset-0 grid place-items-center font-telugu leading-none" style={{ fontVariationSettings: formatVariation(INSTANCES.fullstack) }}>
            ప్ర
          </span>
        </div>
        <div aria-hidden="true" className="relative my-[12%] w-px bg-muted">
          <div className="absolute inset-0" style={{ transform: `translateY(${100 - axis}%)` }}>
            <span className="absolute left-1/2 top-0 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
          </div>
        </div>
      </div>
      <figcaption className="label flex flex-wrap justify-between gap-2 text-muted">
        <span ref={readout}>{formatReadout(INSTANCES.fullstack)}</span>
        <span>ప్ర · &ldquo;Pra&rdquo; · Anek Telugu</span>
      </figcaption>
    </figure>
  );
}
