"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, useGSAP } from "./gsap-setup";

type RevealProps = { children: ReactNode; className?: string; y?: number; stagger?: number };

/** Reveals every descendant marked `data-reveal` once, with one ScrollTrigger for the group. */
export function Reveal({ children, className, y = 12, stagger = 0.05 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", ref.current);
        if (items.length === 0) return;
        gsap.from(items, {
          autoAlpha: 0,
          y,
          duration: 0.4,
          ease: "specimen-out",
          stagger: Math.min(stagger, 0.6 / items.length),
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
