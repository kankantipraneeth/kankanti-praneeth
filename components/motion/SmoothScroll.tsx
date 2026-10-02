"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode, type RefObject } from "react";
import { specimenMove } from "@/lib/easing";
import { gsap, ScrollTrigger } from "./gsap-setup";

const LenisContext = createContext<RefObject<Lenis | null> | null>(null);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenisRef.current = lenis;
    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}

/** Scrolls to an in-page hash (updating the URL) or an element, and moves focus there. */
export function useScrollTo() {
  const lenisRef = useContext(LenisContext);
  return useCallback(
    (destination: string | HTMLElement) => {
      const target = typeof destination === "string" ? document.querySelector<HTMLElement>(destination) : destination;
      if (!target) return;
      const lenis = lenisRef?.current;
      // No offset: the fixed-nav offset lives only in html { scroll-padding-top } (globals.css), which native hash jumps,
      // scrollIntoView and Lenis all honour. Adding scroll-margin or an explicit offset would double it.
      if (lenis) lenis.scrollTo(target, { duration: 0.8, easing: specimenMove });
      else target.scrollIntoView();
      if (typeof destination === "string") history.replaceState(null, "", destination);
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    },
    [lenisRef],
  );
}

/** Scrolls to an absolute document position (used to land on a given sheet inside the pinned work track). */
export function useScrollToY() {
  const lenisRef = useContext(LenisContext);
  return useCallback(
    (y: number) => {
      const lenis = lenisRef?.current;
      if (lenis) lenis.scrollTo(y, { duration: 0.8, easing: specimenMove });
      else window.scrollTo(0, y);
    },
    [lenisRef],
  );
}
