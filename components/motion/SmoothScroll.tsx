"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode, type RefObject } from "react";
import { specimenMove } from "@/lib/easing";
import { gsap, ScrollTrigger } from "./gsap-setup";

export const NAV_OFFSET = 72;

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

/** Scrolls to an in-page hash, moves focus there and updates the URL. */
export function useScrollTo() {
  const lenisRef = useContext(LenisContext);
  return useCallback(
    (hash: string) => {
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      const lenis = lenisRef?.current;
      if (lenis) lenis.scrollTo(target, { offset: -NAV_OFFSET, duration: 0.8, easing: specimenMove });
      else target.scrollIntoView();
      history.replaceState(null, "", hash);
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    },
    [lenisRef],
  );
}
