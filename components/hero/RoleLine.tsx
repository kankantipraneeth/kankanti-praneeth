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
  const lastShown = useRef<RoleStop>(stop);

  // Fade the old line out when the stop changes.
  useGSAP(
    () => {
      if (reduced || stop === shown) return;
      gsap.to(ref.current, { autoAlpha: 0, y: -8, duration: 0.2, ease: "specimen-in", overwrite: true, onComplete: () => setShown(stop) });
    },
    { dependencies: [stop, shown, reduced], scope: ref },
  );

  // Fade the new line in (never on first render, so the hero paints immediately).
  useGSAP(
    () => {
      if (reduced || shown === lastShown.current) return;
      lastShown.current = shown;
      gsap.fromTo(ref.current, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "specimen-out", overwrite: true });
    },
    { dependencies: [shown, reduced], scope: ref },
  );

  return (
    <p ref={ref} aria-live="polite" className={className}>
      {roleLines[reduced ? stop : shown]}
    </p>
  );
}
