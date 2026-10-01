"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { EASE, toCustomEase } from "@/lib/easing";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, CustomEase);
  CustomEase.create("specimen-out", toCustomEase(EASE.out));
  CustomEase.create("specimen-in", toCustomEase(EASE.in));
  CustomEase.create("specimen-move", toCustomEase(EASE.move));
  // Exposed in development only, for the ScrollTrigger budget check in the browser check.
  if (process.env.NODE_ENV !== "production") Object.assign(window, { __ScrollTrigger: ScrollTrigger });
}

export const MQ = {
  desktop: "(min-width: 1024px)",
  motion: "(prefers-reduced-motion: no-preference)",
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
