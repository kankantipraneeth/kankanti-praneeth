"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap-setup";

/** Pulls its child up to ±8px toward the pointer on fine-pointer, motion-allowed devices only. */
export function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const el = ref.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "specimen-out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "specimen-out" });
        const clamp = gsap.utils.clamp(-8, 8);
        const move = (event: PointerEvent) => {
          const box = el.getBoundingClientRect();
          xTo(clamp((event.clientX - (box.left + box.width / 2)) * 0.25));
          yTo(clamp((event.clientY - (box.top + box.height / 2)) * 0.25));
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className="inline-block">
      {children}
    </span>
  );
}
