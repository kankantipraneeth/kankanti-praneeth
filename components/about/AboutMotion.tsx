"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/components/motion/gsap-setup";
import { DIM } from "@/lib/specimen";

/** Scroll-scrubbed word highlight for [data-scrub] paragraphs and a one-time reveal for [data-portrait]. */
export function AboutMotion({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const paragraphs = gsap.utils.toArray<HTMLElement>("[data-scrub]");
        if (paragraphs.length > 0) {
          // aria: "none": the default puts aria-label on each <p>, which is not permitted there; the word spans read naturally.
          const split = SplitText.create(paragraphs, { type: "words", aria: "none" });
          gsap.fromTo(
            split.words,
            // Start at the AA-safe floor so text paused mid-scroll stays readable (DIM.text, 4.8:1 for muted, 9.7:1 for paper).
            { opacity: DIM.text },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: paragraphs[0], start: "top 75%", endTrigger: paragraphs[paragraphs.length - 1], end: "bottom 55%", scrub: true },
            },
          );
        }
        const portrait = ref.current?.querySelector("[data-portrait]");
        if (portrait) gsap.from(portrait, { autoAlpha: 0, scale: 1.06, duration: 0.8, ease: "specimen-out", scrollTrigger: { trigger: portrait, start: "top 80%", once: true } });
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
