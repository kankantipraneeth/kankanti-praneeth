// Cubic-bezier easing shared by GSAP (CustomEase), Lenis and CSS tokens. See MOTION.md §2.

export type BezierTuple = readonly [number, number, number, number];

export const EASE = {
  out: [0.16, 1, 0.3, 1],
  in: [0.7, 0, 0.84, 0],
  move: [0.65, 0, 0.35, 1],
} as const satisfies Record<string, BezierTuple>;

export function cubicBezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleDerivativeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  const solveX = (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const error = sampleX(t) - x;
      if (Math.abs(error) < 1e-7) return t;
      const slope = sampleDerivativeX(t);
      if (Math.abs(slope) < 1e-7) break;
      t -= error / slope;
    }
    let low = 0;
    let high = 1;
    t = x;
    for (let i = 0; i < 60; i++) {
      const value = sampleX(t);
      if (Math.abs(value - x) < 1e-7) break;
      if (x > value) low = t;
      else high = t;
      t = (low + high) / 2;
    }
    return t;
  };

  return (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : sampleY(solveX(t)));
}

export const specimenOut = cubicBezier(...EASE.out);
export const specimenIn = cubicBezier(...EASE.in);
export const specimenMove = cubicBezier(...EASE.move);

export const toCustomEase = (tuple: BezierTuple): string => tuple.join(",");
