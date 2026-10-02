"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/components/motion/gsap-setup";
import { formatReadout, formatVariation } from "@/lib/specimen";
import { LOADER_KEY } from "./loader-script";

export function Loader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      if (!html.hasAttribute("data-loader") || !root.current) return;
      const glyph = root.current.querySelector<HTMLElement>("[data-loader-glyph]");
      const readout = root.current.querySelector<HTMLElement>("[data-loader-readout]");
      const name = document.querySelector<HTMLElement>("[data-hero-name]");
      const axes = { wght: 100, wdth: 125 };
      const apply = () => {
        if (glyph) glyph.style.fontVariationSettings = formatVariation(axes);
        if (readout) readout.textContent = formatReadout(axes);
      };
      const finish = () => {
        try {
          sessionStorage.setItem(LOADER_KEY, "1");
        } catch {
          /* storage blocked: the loader will simply show again next visit */
        }
        html.removeAttribute("data-loader");
      };

      apply();
      const tl = gsap.timeline({ onComplete: finish });
      tl.to(axes, { wght: 800, wdth: 100, duration: 0.8, ease: "specimen-move", onUpdate: apply });
      tl.to(root.current, { autoAlpha: 0, duration: 0.4, ease: "specimen-in" }, 0.8);
      if (name) {
        const split = SplitText.create(name, { type: "lines", mask: "lines" });
        tl.from(split.lines, { yPercent: 100, duration: 0.4, ease: "specimen-out", stagger: 0.08, onComplete: () => split.revert() }, 0.8);
      }

      const skip = () => tl.progress(1, false);
      const events = ["keydown", "pointerdown", "wheel", "touchstart"] as const;
      events.forEach((type) => window.addEventListener(type, skip, { once: true, passive: true }));
      return () => events.forEach((type) => window.removeEventListener(type, skip));
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden="true" className="loader fixed inset-0 z-50 place-items-center bg-ink">
      <span data-loader-glyph className="font-telugu text-[min(34vw,13rem)] leading-none" style={{ fontVariationSettings: formatVariation({ wght: 100, wdth: 125 }) }}>
        ప్ర
      </span>
      <span data-loader-readout className="label absolute bottom-8 left-margin text-muted">
        {formatReadout({ wght: 100, wdth: 125 })}
      </span>
      <span className="label absolute bottom-8 right-margin text-muted">Press any key to skip</span>
    </div>
  );
}
