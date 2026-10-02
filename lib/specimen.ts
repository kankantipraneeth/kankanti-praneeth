// The Web ⟷ AI role axis (DESIGN.md §5). Axis values run 0 (Web) to 100 (AI).

export type RoleStop = "web" | "fullstack" | "ai";
export type Instance = { wdth: number; wght: number };

export const STOP_ORDER: readonly RoleStop[] = ["web", "fullstack", "ai"];
export const STOP_VALUES: Record<RoleStop, number> = { web: 0, fullstack: 50, ai: 100 };
export const STOP_LABELS: Record<RoleStop, string> = { web: "Web", fullstack: "Full-stack", ai: "AI" };
export const PRESET_HINTS: Record<RoleStop, string> = { web: "CMS · SEO", fullstack: "End to end", ai: "LLM · n8n" };

export const INSTANCES: Record<RoleStop, Instance> = {
  web: { wdth: 125, wght: 300 },
  fullstack: { wdth: 100, wght: 600 },
  ai: { wdth: 75, wght: 800 },
};

export function clampAxis(value: number): number {
  if (!Number.isFinite(value)) return STOP_VALUES.fullstack;
  return Math.min(100, Math.max(0, value));
}

const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

export function axisToInstance(value: number): Instance {
  const v = clampAxis(value);
  const [from, to, t] = v <= 50 ? [INSTANCES.web, INSTANCES.fullstack, v / 50] : [INSTANCES.fullstack, INSTANCES.ai, (v - 50) / 50];
  return {
    wdth: Math.round(lerp(from.wdth, to.wdth, t) * 10) / 10,
    wght: Math.round(lerp(from.wght, to.wght, t)),
  };
}

export function nearestStop(value: number): RoleStop {
  const v = clampAxis(value);
  if (v < 25) return "web";
  if (v > 75) return "ai";
  return "fullstack";
}

export const snapAxis = (value: number): number => STOP_VALUES[nearestStop(value)];

export const formatVariation = ({ wdth, wght }: Instance): string => `"wdth" ${wdth}, "wght" ${wght}`;

export const formatReadout = ({ wdth, wght }: Instance): string => `wght ${Math.round(wght)} · wdth ${Math.round(wdth)}`;

/**
 * Opacity for de-emphasised items. Text never goes below 0.75: muted labels at 0.75 still reach 4.8:1 on ink (WCAG AA).
 * Screenshots carry no text that must be read, so they can dim further to keep the emphasis legible.
 */
export const DIM = { text: 0.75, image: 0.35 } as const;
