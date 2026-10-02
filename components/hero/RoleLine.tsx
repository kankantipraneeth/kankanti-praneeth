"use client";

import { useRef, useState } from "react";
import { roleLines } from "@/content/site";
import { gsap, useGSAP } from "@/components/motion/gsap-setup";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useSpecimen } from "@/components/specimen/SpecimenProvider";
import { nearestStop, type RoleStop } from "@/lib/specimen";

export function RoleLine({ className = "" }: { className?: string }) {
  const { axis } = useSpecimen();
  const stop = nearestStop(axis);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const [shown, setShown] = useState<RoleStop>(stop);
  // What the paragraph currently says, readable inside timelines without stale closures.
  const shownRef = useRef<RoleStop>(stop);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  // One timeline per stop change: fade out, swap the text, fade in. A newer change kills the older timeline
  // first, so a stale swap can never land after it. Never runs on first render, so the hero paints immediately.
  useGSAP(
    () => {
      const el = ref.current;
      if (reduced || !el) return;
      timeline.current?.kill();
      if (stop === shownRef.current) {
        timeline.current = gsap.timeline().to(el, { autoAlpha: 1, y: 0, duration: 0.2, ease: "specimen-out", overwrite: true });
        return;
      }
      timeline.current = gsap
        .timeline()
        .to(el, { autoAlpha: 0, y: -8, duration: 0.2, ease: "specimen-in", overwrite: true })
        .call(() => {
          shownRef.current = stop;
          setShown(stop);
        })
        .fromTo(el, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "specimen-out", immediateRender: false });
    },
    { dependencies: [stop, reduced], scope: ref },
  );

  return (
    <p ref={ref} aria-live="polite" className={className}>
      {roleLines[reduced ? stop : shown]}
    </p>
  );
}
