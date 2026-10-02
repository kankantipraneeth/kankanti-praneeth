"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/components/motion/gsap-setup";

/** Masked line reveal for case-study headings and a fade-in for gallery images. */
export function CaseReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-case-heading]").forEach((heading) => {
          SplitText.create(heading, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, { yPercent: 100, duration: 0.4, ease: "specimen-out", stagger: 0.08, scrollTrigger: { trigger: heading, start: "top 85%", once: true } }),
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-gallery-image]").forEach((image) => {
          gsap.from(image, { autoAlpha: 0, scale: 1.06, duration: 0.8, ease: "specimen-out", scrollTrigger: { trigger: image, start: "top 85%", once: true } });
        });
      });
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
