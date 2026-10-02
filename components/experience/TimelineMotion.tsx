"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, useGSAP } from "@/components/motion/gsap-setup";

/** Draws [data-line] with scaleY and fades [data-tick] labels in as the line passes them. */
export function TimelineMotion({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const line = ref.current?.querySelector("[data-line]");
        if (!line) return;
        const ticks = gsap.utils.toArray<HTMLElement>("[data-tick]");
        const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 60%", scrub: true } });
        tl.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: "none", duration: 1 }, 0);
        ticks.forEach((tick, index) => tl.fromTo(tick, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1, ease: "none" }, (index / Math.max(1, ticks.length - 1)) * 0.9));
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
