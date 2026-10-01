import { describe, expect, it } from "vitest";
import { cubicBezier, EASE, specimenIn, specimenMove, specimenOut, toCustomEase } from "./easing";

describe("cubicBezier", () => {
  it("pins the endpoints", () => {
    for (const ease of [specimenOut, specimenIn, specimenMove]) {
      expect(ease(0)).toBe(0);
      expect(ease(1)).toBe(1);
      expect(ease(-1)).toBe(0);
      expect(ease(2)).toBe(1);
    }
  });

  it("is monotonic for the three site curves", () => {
    for (const ease of [specimenOut, specimenIn, specimenMove]) {
      let previous = 0;
      for (let t = 0.05; t <= 1; t += 0.05) {
        const value = ease(t);
        expect(value).toBeGreaterThanOrEqual(previous - 1e-9);
        previous = value;
      }
    }
  });

  it("has the right character", () => {
    expect(specimenOut(0.5)).toBeGreaterThan(0.8); // fast start, soft landing
    expect(specimenIn(0.5)).toBeLessThan(0.2); // slow start, fast exit
    expect(specimenMove(0.5)).toBeCloseTo(0.5, 2); // symmetric
  });

  it("matches linear for (0,0,1,1)", () => {
    const linear = cubicBezier(0, 0, 1, 1);
    expect(linear(0.3)).toBeCloseTo(0.3, 4);
  });

  it("formats GSAP CustomEase strings", () => {
    expect(toCustomEase(EASE.out)).toBe("0.16,1,0.3,1");
  });
});
