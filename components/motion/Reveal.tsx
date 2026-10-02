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
        const container = ref.current;
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", container);
        if (!container || items.length === 0) return;
        // Opacity only (not autoAlpha): hidden-by-visibility items can't take keyboard focus, so a Tab past them would skip
        // their links. Focus anywhere inside finishes the reveal at once, so a focused control is never invisible.
        const tween = gsap.from(items, {
          opacity: 0,
          y,
          duration: 0.4,
          ease: "specimen-out",
          stagger: Math.min(stagger, 0.6 / items.length),
          scrollTrigger: { trigger: container, start: "top 85%", once: true },
        });
        const finish = () => tween.progress(1);
        container.addEventListener("focusin", finish);
        return () => container.removeEventListener("focusin", finish);
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
