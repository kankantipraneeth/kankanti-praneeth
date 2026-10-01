# Praneeth Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the "Specimen" portfolio: a dark, animated Next.js site where a Web ⟷ AI role axis drives a variable-font glyph and re-weights the work, with case-study pages for every project.

**Architecture:** Server-component pages render all content from `content/site.ts`. Pure logic (axis maths, project emphasis, labels, formatting) lives in `lib/` with Vitest tests. Animation lives only in small `"use client"` components that import GSAP from one setup module and register every effect inside `gsap.matchMedia()` so reduced motion and mobile get static, fully visible content. Shared interactive state (axis value, pinned skill) lives in one client context, `SpecimenProvider`.

**Tech Stack:** Node 24 · Next.js 16.3 (App Router, Turbopack) · React 19.2 · TypeScript (strict) · Tailwind CSS v4 · GSAP 3.15 + `@gsap/react` (ScrollTrigger, SplitText, CustomEase) · Lenis 1.3 · Vitest (dev only) · playwright-cli (verification).

**Spec:** `PRODUCT.md`, `DESIGN.md`, `MOTION.md`, `content/site.ts`, `CLAUDE.md`, `.impeccable/surfaces/app-page-tsx.md` (direction contract). Executors read these alongside this plan.

## Global Constraints

- Read the relevant guide in `node_modules/next/dist/docs/` before using any Next.js API (AGENTS.md). Next 16: `params` is a `Promise`; use `PageProps<"/route">`.
- No new runtime dependencies. The only new dev dependency is `vitest`. No other animation or UI library.
- All copy comes from `content/site.ts`. Never invent facts, metrics, clients or testimonials. The phone number never appears on the site. Private or absent repos are never linked.
- Pages are server components. Animation code lives only in `"use client"` components and imports GSAP only from `components/motion/gsap-setup.ts`.
- Animate `transform` and `opacity` only. Approved exception: `font-variation-settings` on the single hero/loader specimen glyph inside a fixed-size `contain: strict` box.
- Every GSAP effect is created inside `useGSAP()` and inside a `gsap.matchMedia()` branch keyed on `MQ.motion`. Hidden start states are only set in that branch, so content is visible with no JS and under reduced motion.
- Pinning only at ≥1024px (stricter than CLAUDE.md's 768px). One pinned section on the site (Selected Work).
- At most 12 ScrollTriggers on the home page at 1440px.
- Visual tokens only from DESIGN.md: colours `ink, ink-raised, rule, muted, paper, accent, on-accent`; fonts Anek Latin / Anek Telugu / Martian Mono; radius 0; no shadows; no gradients. Dark only: light tokens exist in CSS, with no toggle.
- Eases: `specimen-out` `cubic-bezier(0.16, 1, 0.3, 1)`, `specimen-in` `cubic-bezier(0.7, 0, 0.84, 0)`, `specimen-move` `cubic-bezier(0.65, 0, 0.35, 1)`. Durations: 0.2 / 0.4 / 0.8 / 1.2s.
- Tests: Vitest only for pure functions in `lib/` (no component, animation or snapshot tests).
- **Every task ends with:** `npm run check` passing (type-check, lint, Vitest, `next build`), then the **Browser Check (BC)** below, then a commit whose message ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Stop and summarise after each task (CLAUDE.md).

### Browser Check (BC)

Run the dev server in the background with `npm run dev -- --port 3100`, then:

```bash
playwright-cli open http://localhost:3100/
playwright-cli resize 375 812
playwright-cli console error
playwright-cli snapshot
playwright-cli resize 1440 900
playwright-cli reload
playwright-cli console error
playwright-cli snapshot
playwright-cli close
```

Pass means `console error` prints no errors and the snapshot contains the headings and landmarks the task lists. Headless. Take screenshots only when a check fails: `playwright-cli screenshot --filename=.playwright-cli/fail-task<N>-<width>.png`. Stop the dev server afterwards. Task-specific `eval` checks run in the same session before `close`.

## Review Focus

1. **Projects without an image, live site or public repo** (WhatsApp bot, StuRequire): the page must render no dead links and no empty image boxes. Pinned by `projectLinks` / `statusMarks` tests in Task 2 and the BC in Task 8.
2. **Content edited inconsistently later** (a `githubUrl` added to a private project, a skill pointing at a deleted slug, a phone number pasted into copy): the build must fail. Pinned by `lib/content.test.ts` in Task 2.
3. **Resizing across 1024px while on Selected Work**: the pin must be removed cleanly, with no blank gap and no horizontal offset. Pinned by the resize check in Task 8.
4. **Home → case study → browser Back**: no duplicated ScrollTriggers or Lenis instances, and the pin still works. Pinned by the navigation check in Task 9.
5. **Clipboard unavailable or denied** (non-secure context, permission refused): Copy email must fall back to selecting the text with instructions, and the mailto link still works. Pinned by the clipboard check in Task 13.

---

### Task 1: Tooling, scripts and the easing module

**Files:**
- Modify: `package.json` (scripts, devDependency)
- Modify: `eslint.config.mjs` (ignores)
- Create: `vitest.config.ts`
- Create: `lib/easing.ts`
- Test: `lib/easing.test.ts`

**Interfaces:**
- Produces: `cubicBezier(x1, y1, x2, y2): (t: number) => number`; `EASE` (`{ out, in, move }` tuples); `specimenOut`, `specimenIn`, `specimenMove` easing functions; `toCustomEase(tuple): string`. npm scripts `test`, `typecheck`, `check`.

- [ ] **Step 1: Install Vitest and add scripts**

```bash
npm i -D vitest
```

Set `scripts` in `package.json` to:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run",
  "typecheck": "next typegen && tsc --noEmit",
  "check": "npm run typecheck && npm run lint && npm run test && npm run build"
}
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { include: ["lib/**/*.test.ts"], environment: "node" },
  resolve: { alias: { "@": fileURLToPath(new URL("./", import.meta.url)) } },
});
```

- [ ] **Step 3: Ignore non-source folders in ESLint**

In `eslint.config.mjs`, extend the `globalIgnores([...])` array with:

```js
".claude/**",
".impeccable/**",
".playwright-cli/**",
"docs/**",
```

- [ ] **Step 4: Write the failing test `lib/easing.test.ts`**

```ts
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
```

- [ ] **Step 5: Run it and confirm it fails**

Run: `npm run test`
Expected: FAIL with "Failed to resolve import './easing'".

- [ ] **Step 6: Implement `lib/easing.ts`**

```ts
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
```

- [ ] **Step 7: Run tests and the full check**

Run: `npm run test` → Expected: 5 passed.
Run: `npm run check` → Expected: all four stages succeed (the page is still the scaffold).

- [ ] **Step 8: BC and commit**

BC: the scaffold page loads with no console errors.

```bash
git add package.json package-lock.json eslint.config.mjs vitest.config.ts lib/easing.ts lib/easing.test.ts
git commit -m "chore: add Vitest, check script and shared easing curves" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Content model and pure logic

**Files:**
- Modify: `content/site.ts` (new Project fields, `roleLines`)
- Create: `lib/specimen.ts`, `lib/skills.ts`, `lib/work.ts`, `lib/format.ts`
- Test: `lib/specimen.test.ts`, `lib/skills.test.ts`, `lib/work.test.ts`, `lib/format.test.ts`, `lib/content.test.ts`

**Interfaces:**
- Consumes: `Project`, `SkillGroup`, `projects`, `skills`, `getProject` from `content/site.ts`.
- Produces:
  - `content/site.ts`: `Project` gains `track: "web" | "ai"`, `deployment: "live" | "private" | "local"`, `repo: "public" | "private-client" | "none"`, `image: ProjectImage | null`, `flow?: string[]`; `type ProjectImage = { src: string; width: number; height: number; alt: string }`; `roleLines: Record<RoleStop, string>`.
  - `lib/specimen.ts`: `type RoleStop = "web" | "fullstack" | "ai"`, `type Instance = { wdth: number; wght: number }`, `STOP_ORDER`, `STOP_VALUES`, `STOP_LABELS`, `PRESET_HINTS`, `INSTANCES`, `clampAxis(v)`, `axisToInstance(v): Instance`, `nearestStop(v): RoleStop`, `snapAxis(v): number`, `formatVariation(i): string`, `formatReadout(i): string`.
  - `lib/skills.ts`: `projectSlugsForSkill(skill, groups): string[]`, `projectsUsingSkill(skill, groups, projects): Project[]`.
  - `lib/work.ts`: `isEmphasized(project, stop, pinnedSkill, groups): boolean`, `type StatusMark`, `statusMarks(project): [StatusMark, StatusMark]`, `type ProjectLink = { label: string; href: string; external: boolean }`, `projectLinks(project): ProjectLink[]`, `nextProject(slug, list): Project`.
  - `lib/format.ts`: `formatMonth("2025-05") → "MAY 2025"`, `formatIssued(date): string`.

- [ ] **Step 1: Extend the content model in `content/site.ts`**

Add above `export type Project`:

```ts
import type { RoleStop } from "@/lib/specimen";

export type ProjectImage = { src: string; width: number; height: number; alt: string };
```

Add these fields to `export type Project` (after `order`):

```ts
  /** Which end of the Web ⟷ AI role axis this project belongs to. */
  track: "web" | "ai";
  /** live = public URL; private = runs for a client, no public demo; local = never deployed. */
  deployment: "live" | "private" | "local";
  /** public = githubUrl set; private-client = client-owned repo; none = no repository to show. */
  repo: "public" | "private-client" | "none";
  /** Main screenshot. null when no genuine screenshot exists. */
  image: ProjectImage | null;
  /** Typographic flow shown instead of a screenshot (only real steps from the project). */
  flow?: string[];
```

Set the values on each project:

| slug | track | deployment | repo | image | flow |
|---|---|---|---|---|---|
| koshetty-jewellers | `"web"` | `"live"` | `"private-client"` | `{ src: "/work/koshetty-jewellers.webp", width: 1440, height: 900, alt: "Koshetty Jewellers home page" }` | — |
| sunshine-overseas | `"web"` | `"live"` | `"private-client"` | `{ src: "/work/sunshine-overseas.webp", width: 1440, height: 900, alt: "Sunshine Overseas home page" }` | — |
| auto-eda-ai | `"ai"` | `"live"` | `"public"` | `{ src: "/work/auto-eda-ai.webp", width: 1440, height: 900, alt: "Auto-EDA AI Streamlit app" }` | — |
| whatsapp-automation-bot | `"ai"` | `"private"` | `"none"` | `null` | `["Client query on WhatsApp", "n8n workflow", "LLM", "Automated reply"]` |
| sturequire | `"web"` | `"local"` | `"none"` | `{ src: "/work/sturequire/home.webp", width: 1266, height: 617, alt: "StuRequire home page with the student portal's feature list" }` | — |

The three `.webp` screenshots are captured in Task 8; their dimensions are re-checked there.

Add after `summary`:

```ts
/** Role line under the name, one true statement per stop of the Web ⟷ AI axis. */
export const roleLines: Record<RoleStop, string> = {
  web: "I build production websites: Next.js front ends with Sanity CMS, HubSpot CRM, SEO and deployment.",
  fullstack: "I build production websites and AI automations, from requirements to deployment.",
  ai: "I build AI automations: n8n workflows that connect an LLM to WhatsApp, and an AI-powered data analysis platform.",
};
```

- [ ] **Step 2: Write the failing tests**

`lib/specimen.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { axisToInstance, clampAxis, formatReadout, formatVariation, INSTANCES, nearestStop, snapAxis } from "./specimen";

describe("role axis", () => {
  it("clamps and repairs bad input", () => {
    expect(clampAxis(-10)).toBe(0);
    expect(clampAxis(140)).toBe(100);
    expect(clampAxis(Number.NaN)).toBe(50);
  });

  it("maps stops to their exact instances", () => {
    expect(axisToInstance(0)).toEqual(INSTANCES.web);
    expect(axisToInstance(50)).toEqual(INSTANCES.fullstack);
    expect(axisToInstance(100)).toEqual(INSTANCES.ai);
  });

  it("interpolates between neighbouring stops", () => {
    expect(axisToInstance(25)).toEqual({ wdth: 112.5, wght: 450 });
    expect(axisToInstance(75)).toEqual({ wdth: 87.5, wght: 700 });
  });

  it("finds the nearest named stop, ties going to full-stack", () => {
    expect(nearestStop(0)).toBe("web");
    expect(nearestStop(24)).toBe("web");
    expect(nearestStop(25)).toBe("fullstack");
    expect(nearestStop(75)).toBe("fullstack");
    expect(nearestStop(76)).toBe("ai");
    expect(snapAxis(90)).toBe(100);
    expect(snapAxis(40)).toBe(50);
  });

  it("formats CSS and readout strings", () => {
    expect(formatVariation({ wdth: 100, wght: 600 })).toBe('"wdth" 100, "wght" 600');
    expect(formatReadout({ wdth: 112.5, wght: 449.6 })).toBe("wght 450 · wdth 113");
  });
});
```

`lib/skills.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { projects, skills } from "@/content/site";
import { projectSlugsForSkill, projectsUsingSkill } from "./skills";

describe("skills → projects", () => {
  it("returns the slugs a skill was used in", () => {
    expect(projectSlugsForSkill("n8n", skills)).toEqual(["whatsapp-automation-bot"]);
  });

  it("returns [] for unknown or unused skills", () => {
    expect(projectSlugsForSkill("COBOL", skills)).toEqual([]);
    expect(projectSlugsForSkill("LangChain", skills)).toEqual([]);
  });

  it("returns full projects in site order", () => {
    expect(projectsUsingSkill("REST APIs", skills, projects).map((p) => p.slug)).toEqual([
      "sunshine-overseas",
      "whatsapp-automation-bot",
      "sturequire",
    ]);
  });
});
```

`lib/work.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getProject, projects, skills } from "@/content/site";
import { isEmphasized, nextProject, projectLinks, statusMarks } from "./work";

const p = (slug: string) => {
  const project = getProject(slug);
  if (!project) throw new Error(`missing ${slug}`);
  return project;
};

describe("emphasis", () => {
  it("emphasises everything at full-stack", () => {
    expect(projects.every((x) => isEmphasized(x, "fullstack", null, skills))).toBe(true);
  });

  it("emphasises only the matching track at the ends", () => {
    expect(isEmphasized(p("auto-eda-ai"), "ai", null, skills)).toBe(true);
    expect(isEmphasized(p("koshetty-jewellers"), "ai", null, skills)).toBe(false);
    expect(isEmphasized(p("koshetty-jewellers"), "web", null, skills)).toBe(true);
  });

  it("lets a pinned skill override the axis", () => {
    expect(isEmphasized(p("whatsapp-automation-bot"), "web", "n8n", skills)).toBe(true);
    expect(isEmphasized(p("auto-eda-ai"), "ai", "n8n", skills)).toBe(false);
  });
});

describe("honest labels and links", () => {
  it("labels deployment and repo truthfully", () => {
    expect(statusMarks(p("koshetty-jewellers"))).toEqual(["LIVE", "PRIVATE CLIENT REPO"]);
    expect(statusMarks(p("auto-eda-ai"))).toEqual(["LIVE", "PUBLIC REPO"]);
    expect(statusMarks(p("whatsapp-automation-bot"))).toEqual(["NO PUBLIC DEMO", "NO PUBLIC REPO"]);
    expect(statusMarks(p("sturequire"))).toEqual(["LOCAL ONLY", "NO PUBLIC REPO"]);
  });

  it("only links what exists", () => {
    expect(projectLinks(p("whatsapp-automation-bot"))).toEqual([
      { label: "Case study", href: "/work/whatsapp-automation-bot", external: false },
    ]);
    expect(projectLinks(p("auto-eda-ai")).map((l) => l.label)).toEqual(["Case study", "Live site", "GitHub"]);
    expect(projectLinks(p("sunshine-overseas")).map((l) => l.label)).toEqual(["Case study", "Live site"]);
  });

  it("cycles to the next project by order", () => {
    expect(nextProject("koshetty-jewellers", projects).slug).toBe("sunshine-overseas");
    expect(nextProject("sturequire", projects).slug).toBe("koshetty-jewellers");
  });
});
```

`lib/format.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { formatIssued, formatMonth } from "./format";

describe("dates", () => {
  it("formats months", () => {
    expect(formatMonth("2025-05")).toBe("MAY 2025");
    expect(() => formatMonth("2025-13")).toThrow();
  });

  it("formats issue dates at their own precision", () => {
    expect(formatIssued("2025-10-29")).toBe("29 OCT 2025");
    expect(formatIssued("2025-10")).toBe("OCT 2025");
    expect(formatIssued("2022")).toBe("2022");
  });
});
```

`lib/content.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import * as site from "@/content/site";

const { projects, skills, certifications } = site;

describe("content integrity", () => {
  it("never contains the phone number", () => {
    const text = JSON.stringify(site);
    expect(text).not.toMatch(/6305\s?538\s?759/);
    expect(text).not.toMatch(/\+91/);
  });

  it("has no TODO left in project copy", () => {
    expect(JSON.stringify(projects)).not.toContain("TODO");
  });

  it("keeps repo flags consistent with links", () => {
    for (const project of projects) {
      expect(project.repo === "public", project.slug).toBe(project.githubUrl !== null);
      expect(project.deployment === "live", project.slug).toBe(project.liveUrl !== null);
    }
  });

  it("only references real projects from skills", () => {
    const slugs = new Set(projects.map((p) => p.slug));
    for (const group of skills) for (const skill of group.skills) for (const slug of skill.usedIn) expect(slugs.has(slug), `${skill.name} → ${slug}`).toBe(true);
  });

  it("has unique skill names and slugs", () => {
    const names = skills.flatMap((g) => g.skills.map((s) => s.name));
    expect(new Set(names).size).toBe(names.length);
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
  });

  it("has four featured projects ordered 1-4", () => {
    expect(site.featuredProjects.map((p) => p.order)).toEqual([1, 2, 3, 4]);
  });

  it("gives every certificate a way to verify it", () => {
    for (const cert of certifications) expect(cert.verifyUrl !== null || cert.credentialId !== null, cert.name).toBe(true);
  });

  it("has a flow panel for every project without an image", () => {
    for (const project of projects) if (project.image === null) expect(project.flow?.length, project.slug).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 3: Run tests and confirm they fail**

Run: `npm run test`
Expected: FAIL with "Failed to resolve import './specimen'" (and the same for skills, work, format).

- [ ] **Step 4: Implement `lib/specimen.ts`**

```ts
// The Web ⟷ AI role axis (DESIGN.md §5). Axis values run 0 (Web) to 100 (AI).

export type RoleStop = "web" | "fullstack" | "ai";
export type Instance = { wdth: number; wght: number };

export const STOP_ORDER: readonly RoleStop[] = ["web", "fullstack", "ai"];
export const STOP_VALUES: Record<RoleStop, number> = { web: 0, fullstack: 50, ai: 100 };
export const STOP_LABELS: Record<RoleStop, string> = { web: "Web", fullstack: "Full-stack", ai: "AI" };
export const PRESET_HINTS: Record<RoleStop, string> = { web: "Sites · CMS · SEO", fullstack: "End to end", ai: "LLM · n8n · Data" };

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
```

- [ ] **Step 5: Implement `lib/skills.ts`**

```ts
import type { Project, SkillGroup } from "@/content/site";

export function projectSlugsForSkill(skill: string, groups: SkillGroup[]): string[] {
  for (const group of groups) {
    const match = group.skills.find((s) => s.name === skill);
    if (match) return [...match.usedIn];
  }
  return [];
}

export function projectsUsingSkill(skill: string, groups: SkillGroup[], projects: Project[]): Project[] {
  const slugs = new Set(projectSlugsForSkill(skill, groups));
  return projects.filter((p) => slugs.has(p.slug)).sort((a, b) => a.order - b.order);
}
```

- [ ] **Step 6: Implement `lib/work.ts`**

```ts
import type { Project, SkillGroup } from "@/content/site";
import type { RoleStop } from "./specimen";
import { projectSlugsForSkill } from "./skills";

export function isEmphasized(project: Project, stop: RoleStop, pinnedSkill: string | null, groups: SkillGroup[]): boolean {
  if (pinnedSkill) return projectSlugsForSkill(pinnedSkill, groups).includes(project.slug);
  if (stop === "fullstack") return true;
  return project.track === stop;
}

export type StatusMark = "LIVE" | "NO PUBLIC DEMO" | "LOCAL ONLY" | "PUBLIC REPO" | "PRIVATE CLIENT REPO" | "NO PUBLIC REPO";

const DEPLOYMENT_MARK: Record<Project["deployment"], StatusMark> = { live: "LIVE", private: "NO PUBLIC DEMO", local: "LOCAL ONLY" };
const REPO_MARK: Record<Project["repo"], StatusMark> = { public: "PUBLIC REPO", "private-client": "PRIVATE CLIENT REPO", none: "NO PUBLIC REPO" };

export const statusMarks = (project: Project): [StatusMark, StatusMark] => [DEPLOYMENT_MARK[project.deployment], REPO_MARK[project.repo]];

export type ProjectLink = { label: string; href: string; external: boolean };

export function projectLinks(project: Project): ProjectLink[] {
  const links: ProjectLink[] = [{ label: "Case study", href: `/work/${project.slug}`, external: false }];
  if (project.liveUrl) links.push({ label: "Live site", href: project.liveUrl, external: true });
  if (project.githubUrl) links.push({ label: "GitHub", href: project.githubUrl, external: true });
  return links;
}

export function nextProject(slug: string, list: Project[]): Project {
  const ordered = [...list].sort((a, b) => a.order - b.order);
  const index = ordered.findIndex((p) => p.slug === slug);
  return ordered[(index + 1) % ordered.length];
}
```

- [ ] **Step 7: Implement `lib/format.ts`**

```ts
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export function formatMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split("-");
  const index = Number(month) - 1;
  if (!/^\d{4}$/.test(year ?? "") || !(index >= 0 && index < 12)) throw new Error(`Bad month: ${yearMonth}`);
  return `${MONTHS[index]} ${year}`;
}

export function formatIssued(date: string): string {
  const parts = date.split("-");
  if (parts.length === 3) return `${Number(parts[2])} ${formatMonth(`${parts[0]}-${parts[1]}`)}`;
  if (parts.length === 2) return formatMonth(date);
  return date;
}
```

- [ ] **Step 8: Run tests and the full check**

Run: `npm run test` → Expected: all tests pass (easing + 5 new files).
Run: `npm run check` → Expected: success.

- [ ] **Step 9: BC and commit**

BC: the scaffold page still loads with no console errors (no UI change in this task).

```bash
git add content/site.ts lib/
git commit -m "feat: content model for tracks, status and images; axis, work, skills and date logic" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Design tokens, fonts, root layout and metadata defaults

**Files:**
- Create: `app/fonts.ts`
- Modify: `app/globals.css` (replace), `app/layout.tsx` (replace), `app/page.tsx` (replace)
- Delete: `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`

**Interfaces:**
- Produces: Tailwind utilities `bg-ink text-paper text-muted border-rule bg-accent text-on-accent bg-ink-raised`, `text-display-1 text-display-2 text-h2 text-h3 text-lead text-body text-small text-readout`, `font-sans font-mono font-telugu`, spacing `py-section px-margin gap-x-gutter`, `max-w-page`; CSS classes `.label`, `.instance-display`, `.skip-link`, `.arrow`; CSS vars `--ease-specimen-out|in|move`. `RootLayout` renders `<main id="main">`.

- [ ] **Step 1: Create `app/fonts.ts`**

Read `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md` (the `axes` option) first.

```ts
import { Anek_Latin, Anek_Telugu, Martian_Mono } from "next/font/google";

export const anek = Anek_Latin({ subsets: ["latin"], axes: ["wdth"], variable: "--font-anek", display: "swap" });
export const anekTelugu = Anek_Telugu({ subsets: ["telugu"], axes: ["wdth"], variable: "--font-anek-telugu", display: "swap" });
export const martian = Martian_Mono({ subsets: ["latin"], axes: ["wdth"], variable: "--font-martian", display: "swap" });
```

- [ ] **Step 2: Replace `app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-ink: oklch(0.155 0.004 90);
  --color-ink-raised: oklch(0.195 0.005 90);
  --color-rule: oklch(0.3 0.006 90);
  --color-muted: oklch(0.72 0.01 90);
  --color-paper: oklch(0.955 0.008 95);
  --color-accent: oklch(0.86 0.165 92);
  --color-on-accent: oklch(0.17 0.02 90);
  --color-accent-ink: oklch(0.86 0.165 92);

  --text-display-1: clamp(3.25rem, 7vw, 7.25rem);
  --text-display-1--line-height: 0.92;
  --text-display-1--letter-spacing: -0.02em;
  --text-display-2: clamp(2.5rem, 5.5vw, 5.5rem);
  --text-display-2--line-height: 0.95;
  --text-display-2--letter-spacing: -0.015em;
  --text-h2: clamp(2rem, 3.4vw, 3.25rem);
  --text-h2--line-height: 1.05;
  --text-h2--letter-spacing: -0.01em;
  --text-h3: 1.5rem;
  --text-h3--line-height: 1.2;
  --text-lead: clamp(1.125rem, 1.6vw, 1.375rem);
  --text-lead--line-height: 1.45;
  --text-body: 1.0625rem;
  --text-body--line-height: 1.6;
  --text-small: 0.9375rem;
  --text-small--line-height: 1.5;
  --text-readout: 0.8125rem;
  --text-readout--line-height: 1.4;

  --spacing-section: clamp(6rem, 14vw, 12rem);
  --spacing-margin: clamp(1rem, 4vw, 3.5rem);
  --spacing-gutter: clamp(1rem, 2vw, 1.5rem);
  --container-page: 90rem;

  --ease-specimen-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-specimen-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-specimen-move: cubic-bezier(0.65, 0, 0.35, 1);
}

@theme inline {
  --font-sans: var(--font-anek), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-martian), ui-monospace, monospace;
  --font-telugu: var(--font-anek-telugu), var(--font-anek), sans-serif;
}

/* Light tokens kept for later (DESIGN.md §3). No toggle ships. */
:root[data-theme="light"] {
  --color-ink: oklch(0.975 0.004 95);
  --color-ink-raised: oklch(0.945 0.005 95);
  --color-rule: oklch(0.86 0.006 95);
  --color-muted: oklch(0.48 0.01 90);
  --color-paper: oklch(0.17 0.004 90);
  --color-accent-ink: oklch(0.5 0.1 80);
}

@layer base {
  html {
    color-scheme: dark;
    background: var(--color-ink);
  }
  body {
    background: var(--color-ink);
    color: var(--color-paper);
    font-family: var(--font-sans);
    font-size: var(--text-body);
    line-height: var(--text-body--line-height);
    font-variation-settings: "wdth" 100;
  }
  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 3px;
  }
  section[id] {
    scroll-margin-top: 4.5rem;
  }
  ::selection {
    background: var(--color-accent);
    color: var(--color-on-accent);
  }
}

@layer components {
  .label {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    line-height: 1.4;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 500;
  }
  .instance-display {
    font-weight: 700;
    font-variation-settings: "wdth" 112;
  }
  .skip-link {
    position: fixed;
    left: var(--spacing-margin);
    top: 0.75rem;
    z-index: 60;
    transform: translateY(-200%);
    background: var(--color-accent);
    color: var(--color-on-accent);
    padding: 0.75rem 1rem;
  }
  .skip-link:focus-visible {
    transform: none;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .arrow {
    display: inline-block;
    transition: transform 0.2s var(--ease-specimen-out);
  }
  .group:hover .arrow,
  .group:focus-visible .arrow {
    transform: translateX(4px);
  }
}
```

- [ ] **Step 3: Replace `app/layout.tsx`**

```tsx
import type { Metadata, Viewport } from "next";
import { profile } from "@/content/site";
import { anek, anekTelugu, martian } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: `${profile.name}: Full-stack + AI developer`, template: `%s · ${profile.name}` },
  description: "Full-stack developer in Hyderabad who builds production websites and AI automations. Case studies, resume and contact.",
  openGraph: { type: "website", siteName: profile.name, locale: "en_IN" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0D0C0A", colorScheme: "dark" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${anek.variable} ${anekTelugu.variable} ${martian.variable}`} suppressHydrationWarning>
      <body className="min-h-svh bg-ink font-sans text-paper antialiased">
        <a href="#main" className="skip-link label">
          Skip to content
        </a>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Replace `app/page.tsx` with a token check page**

```tsx
import { profile } from "@/content/site";

export default function Home() {
  return (
    <section className="mx-auto max-w-page px-margin py-section">
      <p className="label text-muted">{profile.role}</p>
      <h1 className="instance-display mt-6 text-display-1">{profile.name}</h1>
    </section>
  );
}
```

- [ ] **Step 5: Delete the scaffold SVGs**

```bash
git rm public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
```

- [ ] **Step 6: Run the full check**

Run: `npm run check` → Expected: success.

- [ ] **Step 7: BC with font check**

Before `close`, run:

```bash
playwright-cli eval "getComputedStyle(document.querySelector('h1')).fontFamily"
playwright-cli eval "getComputedStyle(document.body).backgroundColor"
```

Expected: the font family contains `Anek Latin` (next/font may prefix it, e.g. `__Anek_Latin_…`); the background is the ink colour (`oklch(0.155 0.004 90)` or its rgb equivalent). Snapshot shows `heading "Kankanti Praneeth" [level=1]` and a `main` landmark.

- [ ] **Step 8: Commit**

```bash
git add app/ public/
git commit -m "feat: specimen design tokens, Anek and Martian Mono fonts, root layout" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Motion foundation (GSAP setup, Lenis, reduced motion, Reveal)

**Files:**
- Create: `components/motion/gsap-setup.ts`, `components/motion/useReducedMotion.ts`, `components/motion/SmoothScroll.tsx`, `components/motion/Reveal.tsx`
- Modify: `app/layout.tsx` (wrap body content in `<SmoothScroll>`)

**Interfaces:**
- Consumes: `EASE`, `toCustomEase`, `specimenMove` from `lib/easing.ts`.
- Produces: `gsap`, `ScrollTrigger`, `SplitText`, `useGSAP`, `MQ = { desktop: "(min-width: 1024px)", motion: "(prefers-reduced-motion: no-preference)" }` from `gsap-setup.ts`; `useReducedMotion(): boolean`; `<SmoothScroll>` provider and `useScrollTo(): (hash: string) => void`; `NAV_OFFSET = 72`; `<Reveal className? y? stagger?>` which reveals descendants marked `data-reveal`.

- [ ] **Step 1: Create `components/motion/gsap-setup.ts`**

```ts
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
```

- [ ] **Step 2: Create `components/motion/useReducedMotion.ts`**

```ts
"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}
```

- [ ] **Step 3: Create `components/motion/SmoothScroll.tsx`**

```tsx
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
```

- [ ] **Step 4: Create `components/motion/Reveal.tsx`**

```tsx
"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, useGSAP } from "./gsap-setup";

type RevealProps = { children: ReactNode; className?: string; y?: number; stagger?: number };

/** Reveals every descendant marked `data-reveal` once, with one ScrollTrigger for the group. */
export function Reveal({ children, className, y = 12, stagger = 0.05 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", ref.current);
        if (items.length === 0) return;
        gsap.from(items, {
          autoAlpha: 0,
          y,
          duration: 0.4,
          ease: "specimen-out",
          stagger: Math.min(stagger, 0.6 / items.length),
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
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
```

- [ ] **Step 5: Wrap the layout in `SmoothScroll`**

In `app/layout.tsx`, add `import { SmoothScroll } from "@/components/motion/SmoothScroll";` and change the body content to:

```tsx
      <body className="min-h-svh bg-ink font-sans text-paper antialiased">
        <SmoothScroll>
          <a href="#main" className="skip-link label">
            Skip to content
          </a>
          <main id="main">{children}</main>
        </SmoothScroll>
      </body>
```

- [ ] **Step 6: Run the full check**

Run: `npm run check` → Expected: success. (No new tests: nothing new is a pure function.)

- [ ] **Step 7: BC with motion checks**

Before `close`, run at 1440px:

```bash
playwright-cli eval "typeof window.__ScrollTrigger"
playwright-cli eval "document.documentElement.classList.contains('lenis')"
playwright-cli set-reduced-motion reduce
playwright-cli reload
playwright-cli eval "document.documentElement.classList.contains('lenis')"
playwright-cli clear-reduced-motion
```

Expected: `"function"`, then `true` (Lenis active), then `false` (Lenis not started under reduced motion). No console errors.

- [ ] **Step 8: Commit**

```bash
git add components/motion app/layout.tsx
git commit -m "feat: GSAP setup with specimen eases, Lenis smooth scroll, reduced-motion hook, Reveal" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Navigation, footer and shared UI atoms

**Files:**
- Create: `components/ui/Button.tsx`, `components/ui/Readout.tsx`, `components/layout/Nav.tsx`, `components/layout/Footer.tsx`
- Modify: `app/layout.tsx` (render Nav and Footer), `app/globals.css` (nav raised state)

**Interfaces:**
- Consumes: `useScrollTo`, `NAV_OFFSET` (Task 4); `gsap`, `ScrollTrigger`, `MQ`, `useGSAP` (Task 4); `profile` (content).
- Produces: `<Button href variant="primary"|"secondary"|"link" download? external? className?>`; `<Readout label>`; `<Nav />` (links to `#work #about #experience #skills #contact`); `<Footer />`.

- [ ] **Step 1: Create `components/ui/Button.tsx`**

```tsx
import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "link";
  download?: boolean;
  external?: boolean;
  className?: string;
};

const VARIANTS = {
  primary: "bg-accent px-6 text-on-accent",
  secondary: "border border-paper px-6 text-paper hover:bg-ink-raised",
  link: "text-paper underline decoration-rule underline-offset-[6px] hover:decoration-accent",
} as const;

export function Button({ href, children, variant = "primary", download, external, className = "" }: ButtonProps) {
  const classes = `group inline-flex min-h-12 items-center gap-3 text-small font-semibold ${VARIANTS[variant]} ${className}`;
  const arrow = (
    <span aria-hidden="true" className="arrow">
      {download ? "↓" : external ? "↗" : "→"}
    </span>
  );
  if (download || external) {
    return (
      <a href={href} className={classes} download={download || undefined} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
        {children}
        {arrow}
        {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
      {arrow}
    </Link>
  );
}
```

- [ ] **Step 2: Create `components/ui/Readout.tsx`**

```tsx
import type { ReactNode } from "react";

export function Readout({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="label text-muted">{label}</span>
      <span className="font-mono text-readout">{children}</span>
    </div>
  );
}
```

- [ ] **Step 3: Create `components/layout/Nav.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { profile } from "@/content/site";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/components/motion/gsap-setup";
import { useScrollTo } from "@/components/motion/SmoothScroll";

const LINKS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

export function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const scrollTo = useScrollTo();
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav) return;
      const mm = gsap.matchMedia();
      // Two complementary conditions so the handler runs for every visitor; only the hide/show needs motion.
      mm.add({ motion: MQ.motion, reduce: "(prefers-reduced-motion: reduce)" }, (context) => {
        const { motion } = context.conditions as { motion: boolean };
        let hidden = false;
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            nav.dataset.raised = String(self.scroll() > 24);
            if (!motion) return;
            const hide = self.direction === 1 && self.scroll() > 120 && nav.dataset.open !== "true" && !nav.contains(document.activeElement);
            if (hide === hidden) return;
            hidden = hide;
            gsap.to(nav, { yPercent: hide ? -100 : 0, duration: 0.4, ease: hide ? "specimen-in" : "specimen-out", overwrite: "auto" });
          },
        });
      });
    },
    { scope: navRef },
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const onLink = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    setOpen(false);
    if (!onHome) return;
    event.preventDefault();
    scrollTo(`#${id}`);
  };

  const links = (className: string) =>
    LINKS.map((link) => (
      <li key={link.id}>
        <Link href={`/#${link.id}`} onClick={(event) => onLink(event, link.id)} className={className}>
          {link.label}
        </Link>
      </li>
    ));

  return (
    <header ref={navRef} data-open={open} onFocus={() => gsap.to(navRef.current, { yPercent: 0, duration: 0.2, overwrite: "auto" })} className="nav fixed inset-x-0 top-0 z-40">
      <nav aria-label="Main" className="mx-auto flex h-[72px] max-w-page items-center justify-between gap-6 px-margin">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="instance-display text-small">{profile.name}</span>
          <span className="label text-muted">Full-stack + AI · {profile.location.split(",")[0]}</span>
        </Link>
        <ul className="hidden items-center gap-8 lg:flex">{links("label hover:text-accent")}</ul>
        <div className="flex items-center gap-4">
          <a href={profile.resumeUrl} download className="group label hidden min-h-11 items-center gap-2 border border-paper px-4 sm:inline-flex">
            Resume <span aria-hidden="true" className="arrow">↓</span>
          </a>
          <button type="button" className="label min-h-11 px-2 lg:hidden" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)}>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>
      {open ? (
        <div id="mobile-menu" className="fixed inset-0 top-[72px] z-40 bg-ink px-margin py-10 lg:hidden">
          <ul className="flex flex-col gap-6">{links("instance-display text-display-2")}</ul>
          <a href={profile.resumeUrl} download className="label mt-12 inline-flex min-h-12 items-center gap-2 bg-accent px-6 text-on-accent">
            Download resume ↓
          </a>
        </div>
      ) : null}
    </header>
  );
}
```

- [ ] **Step 4: Add the nav raised state to `app/globals.css`** (inside `@layer components`)

```css
  .nav::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: var(--color-ink-raised);
    border-bottom: 1px solid var(--color-rule);
    opacity: 0;
    transition: opacity 0.2s var(--ease-specimen-out);
  }
  .nav[data-raised="true"]::before,
  .nav[data-open="true"]::before {
    opacity: 1;
  }
```

- [ ] **Step 5: Create `components/layout/Footer.tsx`**

```tsx
import { profile } from "@/content/site";

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-page flex-col gap-4 px-margin py-10 lg:flex-row lg:items-baseline lg:justify-between">
        <p className="instance-display text-h3">{profile.name}</p>
        <p className="label text-muted">Built with Next.js · GSAP · Anek & Martian Mono</p>
        <p className="label text-muted">© {YEAR}</p>
        <a href="#main" className="label hover:text-accent">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Render Nav and Footer in `app/layout.tsx`**

Import both, then:

```tsx
        <SmoothScroll>
          <a href="#main" className="skip-link label">
            Skip to content
          </a>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </SmoothScroll>
```

- [ ] **Step 7: Run the full check**

Run: `npm run check` → Expected: success.

- [ ] **Step 8: BC with nav checks**

Snapshot at 375px shows `button "Menu"` with `expanded=false` and no visible desktop link list; at 1440px shows `navigation "Main"` with links Work, About, Experience, Skills, Contact and a `Resume` link. Before `close`, at 375px:

```bash
playwright-cli find "Menu"
playwright-cli click <ref of Menu>
playwright-cli snapshot
playwright-cli press Escape
playwright-cli snapshot
```

Expected: the menu list appears with `expanded=true`, then closes on Escape.

- [ ] **Step 9: Commit**

```bash
git add components/ui components/layout app/layout.tsx app/globals.css
git commit -m "feat: navigation with hide-on-scroll and mobile menu, footer, button and readout atoms" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Hero specimen and the Role axis

**Files:**
- Create: `components/specimen/SpecimenProvider.tsx`, `components/hero/Hero.tsx`, `components/hero/SpecimenGlyph.tsx`, `components/hero/AxisControls.tsx`, `components/hero/RoleLine.tsx`, `components/hero/AxisLabel.tsx`
- Modify: `app/page.tsx`, `app/globals.css` (range input, glyph box)

**Interfaces:**
- Consumes: `lib/specimen.ts` (all exports), `roleLines`, `profile`; `gsap`, `useGSAP` (Task 4); `useReducedMotion`; `Button` (Task 5).
- Produces: `<SpecimenProvider>` and `useSpecimen(): { axis: number; setAxis(v: number): void; pinnedSkill: string | null; setPinnedSkill(s: string | null): void }`; `<Hero />`; the hero `h1` carries `data-hero-name` (used by the loader in Task 7).

- [ ] **Step 1: Create `components/specimen/SpecimenProvider.tsx`**

```tsx
"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { STOP_VALUES } from "@/lib/specimen";

type SpecimenState = {
  axis: number;
  setAxis: (value: number) => void;
  pinnedSkill: string | null;
  setPinnedSkill: (skill: string | null) => void;
};

const SpecimenContext = createContext<SpecimenState | null>(null);

export function SpecimenProvider({ children }: { children: ReactNode }) {
  const [axis, setAxis] = useState(STOP_VALUES.fullstack);
  const [pinnedSkill, setPinnedSkill] = useState<string | null>(null);
  const value = useMemo(() => ({ axis, setAxis, pinnedSkill, setPinnedSkill }), [axis, pinnedSkill]);
  return <SpecimenContext.Provider value={value}>{children}</SpecimenContext.Provider>;
}

export function useSpecimen(): SpecimenState {
  const value = useContext(SpecimenContext);
  if (!value) throw new Error("useSpecimen must be used inside <SpecimenProvider>");
  return value;
}
```

- [ ] **Step 2: Create `components/hero/SpecimenGlyph.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap-setup";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useSpecimen } from "@/components/specimen/SpecimenProvider";
import { axisToInstance, formatReadout, formatVariation, INSTANCES, type Instance } from "@/lib/specimen";

export function SpecimenGlyph() {
  const { axis } = useSpecimen();
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const glyph = useRef<HTMLSpanElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const current = useRef<Instance>({ ...INSTANCES.fullstack });

  useGSAP(
    () => {
      const apply = () => {
        if (glyph.current) glyph.current.style.fontVariationSettings = formatVariation(current.current);
        if (readout.current) readout.current.textContent = formatReadout(current.current);
      };
      const target = axisToInstance(axis);
      if (reduced) {
        gsap.killTweensOf(current.current);
        Object.assign(current.current, target);
        apply();
        return;
      }
      gsap.to(current.current, { ...target, duration: 0.4, ease: "specimen-move", overwrite: true, onUpdate: apply });
    },
    { dependencies: [axis, reduced], scope: root },
  );

  return (
    <figure ref={root} className="mx-auto flex w-[min(78vw,36rem)] flex-col gap-4 lg:w-full">
      <div className="flex items-stretch gap-6">
        <div className="glyph-box relative aspect-square flex-1">
          <span ref={glyph} aria-hidden="true" className="absolute inset-0 grid place-items-center font-telugu leading-none" style={{ fontVariationSettings: formatVariation(INSTANCES.fullstack) }}>
            ప్ర
          </span>
        </div>
        <div aria-hidden="true" className="relative my-[12%] w-px bg-muted">
          <div className="absolute inset-0" style={{ transform: `translateY(${100 - axis}%)` }}>
            <span className="absolute left-1/2 top-0 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
          </div>
        </div>
      </div>
      <figcaption className="label flex flex-wrap justify-between gap-2 text-muted">
        <span ref={readout}>{formatReadout(INSTANCES.fullstack)}</span>
        <span>ప్ర · &ldquo;Pra&rdquo; · Anek Telugu</span>
      </figcaption>
    </figure>
  );
}
```

Add to `app/globals.css` (`@layer components`):

```css
  .glyph-box {
    contain: strict;
    container-type: size;
  }
  .glyph-box > span {
    font-size: 70cqmin;
  }
```

- [ ] **Step 3: Create `components/hero/AxisControls.tsx`**

```tsx
"use client";

import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useSpecimen } from "@/components/specimen/SpecimenProvider";
import { clampAxis, nearestStop, PRESET_HINTS, snapAxis, STOP_LABELS, STOP_ORDER, STOP_VALUES } from "@/lib/specimen";

export function AxisControls() {
  const { axis, setAxis } = useSpecimen();
  const reduced = useReducedMotion();
  const stop = nearestStop(axis);
  const update = (value: number) => setAxis(reduced ? snapAxis(value) : clampAxis(value));

  return (
    <div>
      <p className="label text-muted">Axis controls</p>
      <label htmlFor="role-axis" className="mt-6 flex items-baseline justify-between text-small">
        <span>Role: Web to AI</span>
        <span className="font-mono text-readout text-accent">{STOP_LABELS[stop]}</span>
      </label>
      <input
        id="role-axis"
        type="range"
        min={0}
        max={100}
        step={reduced ? 50 : 5}
        value={axis}
        aria-valuetext={STOP_LABELS[stop]}
        onChange={(event) => update(Number(event.target.value))}
        className="axis-range mt-4 w-full"
      />
      <div aria-hidden="true" className="label mt-2 flex justify-between text-muted">
        <span>Web</span>
        <span>AI</span>
      </div>
      <p id="presets-label" className="label mt-10 text-muted">
        Presets
      </p>
      <div role="group" aria-labelledby="presets-label" className="mt-4 grid grid-cols-3 border-l border-t border-rule">
        {STOP_ORDER.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={stop === s}
            onClick={() => setAxis(STOP_VALUES[s])}
            className="min-h-16 border-b border-r border-rule p-3 text-left text-small font-semibold aria-pressed:text-accent aria-pressed:outline aria-pressed:outline-1 aria-pressed:-outline-offset-1 aria-pressed:outline-accent"
          >
            {STOP_LABELS[s]}
            <span className="label mt-1 block font-normal text-muted">{PRESET_HINTS[s]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

Add to `app/globals.css` (`@layer components`):

```css
  .axis-range {
    appearance: none;
    background: transparent;
    height: 1.5rem;
    cursor: pointer;
  }
  .axis-range::-webkit-slider-runnable-track {
    height: 1px;
    background: var(--color-muted);
  }
  .axis-range::-moz-range-track {
    height: 1px;
    background: var(--color-muted);
  }
  .axis-range::-webkit-slider-thumb {
    appearance: none;
    width: 1.25rem;
    height: 1.25rem;
    margin-top: -0.625rem;
    border-radius: 9999px;
    background: var(--color-accent);
  }
  .axis-range::-moz-range-thumb {
    width: 1.25rem;
    height: 1.25rem;
    border: 0;
    border-radius: 9999px;
    background: var(--color-accent);
  }
```

- [ ] **Step 4: Create `components/hero/RoleLine.tsx` and `AxisLabel.tsx`**

```tsx
"use client";

import { useRef, useState } from "react";
import { roleLines } from "@/content/site";
import { gsap, useGSAP } from "@/components/motion/gsap-setup";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useSpecimen } from "@/components/specimen/SpecimenProvider";
import { nearestStop, type RoleStop } from "@/lib/specimen";

export function RoleLine({ className = "" }: { className?: string }) {
  const { axis } = useSpecimen();
  const stop = nearestStop(axis);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const [shown, setShown] = useState<RoleStop>(stop);
  const lastShown = useRef<RoleStop>(stop);

  // Fade the old line out when the stop changes.
  useGSAP(
    () => {
      if (reduced || stop === shown) return;
      gsap.to(ref.current, { autoAlpha: 0, y: -8, duration: 0.2, ease: "specimen-in", overwrite: true, onComplete: () => setShown(stop) });
    },
    { dependencies: [stop, shown, reduced], scope: ref },
  );

  // Fade the new line in (never on first render, so the hero paints immediately).
  useGSAP(
    () => {
      if (reduced || shown === lastShown.current) return;
      lastShown.current = shown;
      gsap.fromTo(ref.current, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "specimen-out", overwrite: true });
    },
    { dependencies: [shown, reduced], scope: ref },
  );

  return (
    <p ref={ref} aria-live="polite" className={className}>
      {roleLines[reduced ? stop : shown]}
    </p>
  );
}
```

`components/hero/AxisLabel.tsx`:

```tsx
"use client";

import { useSpecimen } from "@/components/specimen/SpecimenProvider";
import { nearestStop, STOP_LABELS } from "@/lib/specimen";

export function AxisLabel() {
  const { axis } = useSpecimen();
  return (
    <p className="label flex items-center gap-3 text-muted">
      <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
      Axis: Role · {STOP_LABELS[nearestStop(axis)]}
    </p>
  );
}
```

- [ ] **Step 5: Create `components/hero/Hero.tsx`**

The CTAs sit before the glyph in DOM and on mobile, so both actions stay in the first screen on a phone. (DESIGN.md put them after the slider on mobile; this ordering keeps reading and focus order identical to visual order.)

```tsx
import { profile } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { AxisControls } from "./AxisControls";
import { AxisLabel } from "./AxisLabel";
import { RoleLine } from "./RoleLine";
import { SpecimenGlyph } from "./SpecimenGlyph";

export function Hero() {
  return (
    <section aria-labelledby="hero-name" className="border-b border-rule">
      <div className="mx-auto grid max-w-page grid-cols-4 gap-x-gutter px-margin pb-16 pt-28 lg:min-h-svh lg:grid-cols-12 lg:items-center lg:pb-24 lg:pt-32">
        <div className="col-span-4 lg:col-span-5">
          <AxisLabel />
          <h1 id="hero-name" data-hero-name className="instance-display mt-6 text-display-1">
            Kankanti
            <br />
            Praneeth
          </h1>
          <p className="label mt-6 text-muted">
            {profile.role} · {profile.location}
          </p>
          <RoleLine className="mt-8 max-w-[34ch] text-lead" />
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={profile.resumeUrl} download>
              Download resume
            </Button>
            <Button href="/#contact" variant="secondary">
              Get in touch
            </Button>
          </div>
        </div>
        <div className="col-span-4 mt-14 lg:col-span-4 lg:mt-0">
          <SpecimenGlyph />
        </div>
        <div className="col-span-4 mt-12 lg:col-span-3 lg:mt-0 lg:border-l lg:border-rule lg:pl-gutter">
          <AxisControls />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Replace `app/page.tsx`**

```tsx
import { Hero } from "@/components/hero/Hero";
import { SpecimenProvider } from "@/components/specimen/SpecimenProvider";

export default function Home() {
  return (
    <SpecimenProvider>
      <Hero />
    </SpecimenProvider>
  );
}
```

- [ ] **Step 7: Run the full check**

Run: `npm run check` → Expected: success.

- [ ] **Step 8: BC with axis checks**

Snapshot shows `heading "Kankanti Praneeth" [level=1]`, `slider "Role: Web to AI"`, buttons `Web`, `Full-stack` (pressed), `AI`, links `Download resume` and `Get in touch`. Before `close`, at 1440px:

```bash
playwright-cli find "AI"
playwright-cli click <ref of the AI preset>
playwright-cli eval "document.querySelector('.glyph-box span').style.fontVariationSettings"
playwright-cli eval "document.querySelector('[aria-live=polite]').textContent"
playwright-cli find "Role: Web to AI"
playwright-cli click <ref of the slider>
playwright-cli press Home
playwright-cli eval "document.querySelector('#role-axis').getAttribute('aria-valuetext')"
playwright-cli set-reduced-motion reduce
playwright-cli reload
playwright-cli press Tab
playwright-cli eval "document.querySelector('#role-axis').step"
playwright-cli clear-reduced-motion
```

Expected: after a 0.5s settle, variation `"wdth" 75, "wght" 800`; the role line is the AI sentence; after Home the valuetext is `Web`; under reduced motion step is `50`. No console errors at either width. The glyph box must not overflow its column at 375px (check the snapshot for horizontal scroll: `playwright-cli eval "document.documentElement.scrollWidth <= innerWidth"` → `true`).

- [ ] **Step 9: Commit**

```bash
git add components/specimen components/hero app/page.tsx app/globals.css
git commit -m "feat: hero specimen with Role axis, Telugu glyph, presets and role line" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Loader (first visit per session)

**Files:**
- Create: `components/loader/loader-script.ts`, `components/loader/Loader.tsx`
- Modify: `app/layout.tsx` (head script, `<Loader />`), `app/globals.css` (loader visibility)

**Interfaces:**
- Consumes: `gsap`, `SplitText`, `useGSAP` (Task 4); `formatVariation`, `formatReadout` (Task 2); `[data-hero-name]` (Task 6).
- Produces: `LOADER_KEY = "pk-loader-seen"`, `LOADER_SCRIPT` string; `<Loader />`; the `html[data-loader]` attribute contract.

- [ ] **Step 1: Create `components/loader/loader-script.ts`**

```ts
export const LOADER_KEY = "pk-loader-seen";

/** Runs in <head> before first paint: shows the loader only on the first visit per session, never under reduced motion. */
export const LOADER_SCRIPT = `(function(){try{if(sessionStorage.getItem("${LOADER_KEY}"))return;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;document.documentElement.setAttribute("data-loader","")}catch(e){}})();`;
```

- [ ] **Step 2: Create `components/loader/Loader.tsx`**

```tsx
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
      <span data-loader-glyph className="font-telugu text-[min(60vw,28rem)] leading-none" style={{ fontVariationSettings: formatVariation({ wght: 100, wdth: 125 }) }}>
        ప్ర
      </span>
      <span data-loader-readout className="label absolute bottom-8 left-margin text-muted">
        {formatReadout({ wght: 100, wdth: 125 })}
      </span>
      <span className="label absolute bottom-8 right-margin text-muted">Press any key to skip</span>
    </div>
  );
}
```

- [ ] **Step 3: Loader CSS in `app/globals.css`** (`@layer components`)

```css
  .loader {
    display: none;
  }
  html[data-loader] .loader {
    display: grid;
  }
  html[data-loader] body {
    overflow: hidden;
  }
```

- [ ] **Step 4: Wire the layout**

In `app/layout.tsx`, import `Loader` and `LOADER_SCRIPT`, add a `<head>` before `<body>` and render the loader first inside `SmoothScroll`:

```tsx
    <html lang="en" className={`${anek.variable} ${anekTelugu.variable} ${martian.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LOADER_SCRIPT }} />
      </head>
      <body className="min-h-svh bg-ink font-sans text-paper antialiased">
        <SmoothScroll>
          <Loader />
          ...
```

- [ ] **Step 5: Run the full check**

Run: `npm run check` → Expected: success.

- [ ] **Step 6: BC with loader checks**

Before `close`, at 1440px with a fresh session:

```bash
playwright-cli sessionstorage-clear
playwright-cli reload
playwright-cli eval "document.documentElement.hasAttribute('data-loader')"
playwright-cli eval "new Promise(r => setTimeout(() => r(document.documentElement.hasAttribute('data-loader')), 1600))"
playwright-cli reload
playwright-cli eval "document.documentElement.hasAttribute('data-loader')"
playwright-cli sessionstorage-clear
playwright-cli reload
playwright-cli press Space
playwright-cli eval "new Promise(r => setTimeout(() => r(document.documentElement.hasAttribute('data-loader')), 100))"
playwright-cli sessionstorage-clear
playwright-cli set-reduced-motion reduce
playwright-cli reload
playwright-cli eval "document.documentElement.hasAttribute('data-loader')"
playwright-cli clear-reduced-motion
```

Expected in order: `true` (loader showing), `false` (gone within 1.6s), `false` (not shown again this session), `false` (skipped by a key press), `false` (never under reduced motion). The `h1` text is still "Kankanti Praneeth" after the loader (SplitText reverted): `playwright-cli eval "document.querySelector('[data-hero-name]').innerHTML"` contains no `<div`.

- [ ] **Step 7: Commit**

```bash
git add components/loader app/layout.tsx app/globals.css
git commit -m "feat: first-visit specimen loader with skip, name line reveal and no-flash head script" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Selected Work (screenshots, specimen sheets, pinned track, axis emphasis)

**Files:**
- Create: `public/work/koshetty-jewellers.webp`, `public/work/sunshine-overseas.webp`, `public/work/auto-eda-ai.webp` (captured)
- Create: `components/work/WorkSheet.tsx`, `components/work/FlowPanel.tsx`, `components/work/ScoreReadout.tsx`, `components/work/SelectedWork.tsx`
- Modify: `app/page.tsx`, `lib/content.test.ts` (image files exist), `DESIGN.md` §5 and `MOTION.md` §4.2/§4.4 (record two simplifications)

**Interfaces:**
- Consumes: `featuredProjects`, `skills`, `getProject` (content); `isEmphasized`, `statusMarks`, `projectLinks` (Task 2); `nearestStop`, `STOP_LABELS` (Task 2); `useSpecimen` (Task 6); `gsap`, `ScrollTrigger`, `MQ`, `useGSAP` (Task 4); `Button`, `Readout` (Task 5).
- Produces: `<SelectedWork />` (section `#work`); `<WorkSheet project index total />` with an image wrapped in `<ViewTransition name="work-<slug>">` (consumed by Task 9); `<FlowPanel steps />`; `<ScoreReadout lighthouse />`.

Two simplifications, recorded in the docs in Step 9: (1) the axis **dims** non-matching sheets but does **not reorder** them (reordering a keyed list mid-animation breaks focus order and needs the Flip plugin; dimming carries the same meaning). (2) Image parallax runs on the **same scrubbed timeline** as the horizontal track instead of per-sheet `containerAnimation` triggers, which keeps the home page within the 12-ScrollTrigger budget.

- [ ] **Step 1: Capture the three live-site screenshots**

```bash
playwright-cli open https://koshetty-jewellers.vercel.app
playwright-cli resize 1440 900
playwright-cli snapshot
playwright-cli screenshot --filename=public/work/koshetty-jewellers.png
playwright-cli goto https://sunshine-overseas.vercel.app
playwright-cli snapshot
playwright-cli screenshot --filename=public/work/sunshine-overseas.png
playwright-cli goto https://auto-eda-ai-assisted.streamlit.app
playwright-cli snapshot
```

If the snapshot shows a cookie or consent banner, decline non-essential cookies before the screenshot. If the Streamlit snapshot shows the "app is asleep" page, click the wake button it offers, wait about 60s, and snapshot again. Take the screenshot only when the real app UI is visible:

```bash
playwright-cli screenshot --filename=public/work/auto-eda-ai.png
playwright-cli close
magick public/work/koshetty-jewellers.png -quality 82 public/work/koshetty-jewellers.webp
magick public/work/sunshine-overseas.png -quality 82 public/work/sunshine-overseas.webp
magick public/work/auto-eda-ai.png -quality 82 public/work/auto-eda-ai.webp
rm public/work/*.png
magick identify public/work/*.webp
```

Open each `.webp` with the Read tool and confirm it shows the real site. If a capture is not the genuine site (error page, sleeping app, blank), set that project's `image` to `null`, give it a `flow` of its real steps from `content/site.ts`, and report it in the task summary. Update `width`/`height` in `content/site.ts` if `identify` reports different dimensions.

- [ ] **Step 2: Add the image-existence test to `lib/content.test.ts`**

Add the import `import { existsSync } from "node:fs";` and inside the `describe`:

```ts
  it("only points at screenshots that exist in public/", () => {
    for (const project of projects) {
      if (project.image) expect(existsSync(`public${project.image.src}`), project.image.src).toBe(true);
      for (const shot of project.gallery) expect(existsSync(`public${shot.src}`), shot.src).toBe(true);
    }
  });
```

Run: `npm run test` → Expected: PASS (it would fail if Step 1 left a missing file).

- [ ] **Step 3: Create `components/work/FlowPanel.tsx`**

```tsx
export function FlowPanel({ steps }: { steps: string[] }) {
  return (
    <ol aria-label="How it works" className="flex h-full flex-col justify-center gap-3 border border-rule p-6 lg:p-10">
      {steps.map((step, index) => (
        <li key={step} className="flex items-baseline gap-4">
          <span className="label text-muted">{String(index + 1).padStart(2, "0")}</span>
          <span className="instance-display text-h2">{step}</span>
          {index < steps.length - 1 ? (
            <span aria-hidden="true" className="text-h3 text-accent">
              ↓
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
```

- [ ] **Step 4: Create `components/work/ScoreReadout.tsx`**

```tsx
import type { Lighthouse, LighthouseScores } from "@/content/site";
import { formatIssued } from "@/lib/format";

const row = (scores: LighthouseScores) =>
  [`PERF ${scores.performance}`, `A11Y ${scores.accessibility}`, `BP ${scores.bestPractices}`, scores.seo === undefined ? null : `SEO ${scores.seo}`].filter(Boolean).join(" · ");

export function ScoreReadout({ lighthouse }: { lighthouse: Lighthouse }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="label text-muted">
        {lighthouse.tool} · measured {formatIssued(lighthouse.measured)}
      </span>
      <span className="font-mono text-readout">MOBILE {row(lighthouse.mobile)}</span>
      <span className="font-mono text-readout">DESKTOP {row(lighthouse.desktop)}</span>
    </div>
  );
}
```

- [ ] **Step 5: Create `components/work/WorkSheet.tsx`**

```tsx
import Image from "next/image";
import { ViewTransition } from "react";
import type { Project } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Readout } from "@/components/ui/Readout";
import { projectLinks, statusMarks } from "@/lib/work";
import { FlowPanel } from "./FlowPanel";
import { ScoreReadout } from "./ScoreReadout";

type WorkSheetProps = { project: Project; index: number; total: number };

export function WorkSheet({ project, index, total }: WorkSheetProps) {
  const titleId = `work-${project.slug}-title`;
  return (
    <article data-sheet data-slug={project.slug} aria-labelledby={titleId} className="flex w-full shrink-0 flex-col gap-8 border-t border-rule py-12 lg:w-[min(78vw,72rem)] lg:flex-row lg:gap-gutter lg:border-l lg:border-t-0 lg:px-gutter lg:py-0">
      <div className="overflow-hidden lg:w-3/5">
        {project.image ? (
          <ViewTransition name={`work-${project.slug}`}>
            <Image data-parallax src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} sizes="(min-width: 1024px) 45vw, 100vw" className="h-auto w-full border border-rule" />
          </ViewTransition>
        ) : (
          <FlowPanel steps={project.flow ?? []} />
        )}
      </div>
      <div className="flex flex-col gap-6 lg:w-2/5">
        <p className="label text-muted">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <h3 id={titleId} className="instance-display text-display-2">
          {project.title}
        </h3>
        <p className="text-lead text-muted">{project.subtitle}</p>
        <ul className="flex flex-wrap gap-2" aria-label="Status">
          {statusMarks(project).map((mark) => (
            <li key={mark} className="label border border-rule px-2 py-1">
              {mark}
            </li>
          ))}
        </ul>
        <Readout label="Stack">{project.stack.join(" · ")}</Readout>
        {project.lighthouse ? <ScoreReadout lighthouse={project.lighthouse} /> : null}
        <div className="mt-auto flex flex-wrap gap-x-6 gap-y-3">
          {projectLinks(project).map((link) => (
            <Button key={link.href} href={link.href} variant="link" external={link.external}>
              {link.label}
              {link.label === "Case study" ? <span className="sr-only">: {project.title}</span> : null}
            </Button>
          ))}
        </div>
      </div>
    </article>
  );
}
```

`Lighthouse` and `LighthouseScores` are already exported from `content/site.ts`.

- [ ] **Step 6: Create `components/work/SelectedWork.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { featuredProjects, getProject, skills } from "@/content/site";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/components/motion/gsap-setup";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useSpecimen } from "@/components/specimen/SpecimenProvider";
import { nearestStop, STOP_LABELS } from "@/lib/specimen";
import { isEmphasized } from "@/lib/work";
import { WorkSheet } from "./WorkSheet";

export function SelectedWork() {
  const { axis, pinnedSkill } = useSpecimen();
  const stop = nearestStop(axis);
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const total = featuredProjects.length;

  // Layout motion: pinned horizontal track on desktop, one-time reveals on mobile.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, motion: MQ.motion }, (context) => {
        const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
        const sheets = gsap.utils.toArray<HTMLElement>("[data-sheet]");
        if (!motion) return;
        if (!desktop) {
          gsap.set(sheets, { autoAlpha: 0, y: 24 });
          ScrollTrigger.batch(sheets, {
            start: "top 85%",
            once: true,
            onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.4, ease: "specimen-out", stagger: 0.05, overwrite: true }),
          });
          return;
        }
        const trackEl = track.current;
        if (!trackEl) return;
        const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (counter.current) counter.current.textContent = `${String(Math.min(total, Math.floor(self.progress * total) + 1)).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
            },
          },
        });
        tl.to(trackEl, { x: () => -distance(), ease: "none" }, 0);
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((image) => tl.fromTo(image, { xPercent: -6 }, { xPercent: 0, ease: "none" }, 0));
      });
    },
    { scope: section },
  );

  // Emphasis: dim sheets that don't match the axis stop or the pinned skill.
  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-sheet]").forEach((sheet) => {
        const project = getProject(sheet.dataset.slug ?? "");
        if (!project) return;
        const on = isEmphasized(project, stop, pinnedSkill, skills);
        sheet.dataset.emphasis = on ? "on" : "off";
        gsap.to(sheet, { opacity: on ? 1 : 0.45, duration: reduced ? 0 : 0.4, ease: "specimen-out", overwrite: "auto" });
      });
    },
    { dependencies: [stop, pinnedSkill, reduced], scope: section },
  );

  const emphasisLabel = pinnedSkill ? `Pinned: ${pinnedSkill}` : stop === "fullstack" ? "All work" : `${STOP_LABELS[stop]} work highlighted`;

  return (
    <section ref={section} id="work" aria-labelledby="work-title" className="overflow-hidden border-b border-rule lg:flex lg:h-svh lg:flex-col">
      <div className="mx-auto flex w-full max-w-page flex-wrap items-baseline justify-between gap-4 px-margin pb-10 pt-section lg:pb-8 lg:pt-28">
        <div>
          <p className="label text-muted">02 · Selected work</p>
          <h2 id="work-title" className="mt-4 text-h2">
            Shipped for real clients and real users
          </h2>
        </div>
        <p className="label text-muted" aria-live="polite">
          {emphasisLabel}
          <span ref={counter} aria-hidden="true" className="ml-4 hidden lg:inline">
            01 / {String(total).padStart(2, "0")}
          </span>
        </p>
      </div>
      <div ref={track} className="flex flex-col px-margin lg:min-h-0 lg:flex-1 lg:flex-row lg:items-center lg:pb-16">
        {featuredProjects.map((project, index) => (
          <WorkSheet key={project.slug} project={project} index={index} total={total} />
        ))}
      </div>
    </section>
  );
}
```

The heading "Shipped for real clients and real users" is backed by `content/site.ts`: two client sites, a client bot and a public app. If the reviewer prefers plain wording, use "Selected work".

- [ ] **Step 7: Render the section**

In `app/page.tsx`, import `SelectedWork` and render `<SelectedWork />` after `<Hero />` (About is inserted between them in Task 10).

- [ ] **Step 8: Run the full check**

Run: `npm run check` → Expected: success.

- [ ] **Step 9: Record the two simplifications in the docs**

In `DESIGN.md` §5 item 3, replace "projects tagged for that end move to the front and the rest dim to `--muted` (they are never hidden)" with "projects that don't match the stop dim to 45% opacity (they are never hidden or reordered)". In `MOTION.md` §4.2, replace the "Selected Work re-weights: `Flip.getState`…" bullet with "Selected Work re-weights: non-matching sheets go to `opacity 0.45` (0.4s, `specimen-out`); no reorder, no Flip." In §4.4, replace the `containerAnimation` bullet with "Each sheet's screenshot drifts `xPercent -6 → 0` on the same scrubbed timeline as the track (no extra triggers)." In §8, delete the `Flip` row and change "Horizontal work track" to "`ScrollTrigger` `pin` + `scrub`, `invalidateOnRefresh`". In §7, change "GSAP core, ScrollTrigger, SplitText, Flip and CustomEase" to "GSAP core, ScrollTrigger, SplitText and CustomEase".

- [ ] **Step 10: BC with work checks**

Snapshot at both widths shows `region "Shipped for real clients and real users"` with four `article` headings (Koshetty Jewellers, Sunshine Overseas, Auto-EDA AI, AI-Powered WhatsApp Automation Bot). The WhatsApp sheet has a list `How it works` and **no** `Live site` or `GitHub` link. Sunshine has no `GitHub` link. Before `close`:

```bash
playwright-cli resize 1440 900
playwright-cli eval "document.querySelectorAll('.pin-spacer').length"
playwright-cli mousewheel 0 2400
playwright-cli eval "getComputedStyle(document.querySelector('#work [data-sheet]').parentElement).transform"
playwright-cli eval "window.__ScrollTrigger.getAll().length"
playwright-cli resize 900 900
playwright-cli eval "new Promise(r => setTimeout(() => r([document.querySelectorAll('.pin-spacer').length, document.documentElement.scrollWidth <= innerWidth]), 500))"
playwright-cli resize 375 812
playwright-cli reload
playwright-cli eval "document.querySelectorAll('.pin-spacer').length"
playwright-cli resize 1440 900
playwright-cli reload
playwright-cli find "AI"
playwright-cli click <ref of the AI preset>
playwright-cli eval "new Promise(r => setTimeout(() => r([...document.querySelectorAll('[data-sheet]')].map(s => s.dataset.emphasis)), 600))"
```

Expected: `1` pin spacer at 1440; a non-identity transform (`matrix(…)` with a negative x) after scrolling; the ScrollTrigger count ≤ 12; after resizing to 900px `[0, true]` (pin removed, no horizontal overflow: Review Focus 3); `0` pin spacers at 375; emphasis `["off","off","on","on"]` (only the AI projects on). No console errors.

- [ ] **Step 11: Commit**

```bash
git add public/work components/work app/page.tsx lib/content.test.ts content/site.ts DESIGN.md MOTION.md
git commit -m "feat: selected work as specimen sheets with pinned horizontal track and axis emphasis" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Case-study pages, view-transition morph and OG images

**Files:**
- Create: `app/work/[slug]/page.tsx`, `app/work/[slug]/opengraph-image.tsx`, `components/case/CaseSection.tsx`, `components/case/CaseReveal.tsx`
- Modify: `app/globals.css` (view-transition timing + reduced motion)
- Install skill (docs only): `vercel-react-view-transitions`

**Interfaces:**
- Consumes: `projects`, `getProject`, `isTodo` (content); `nextProject`, `projectLinks`, `statusMarks` (Task 2); `WorkSheet`'s `ViewTransition name="work-<slug>"` (Task 8); `FlowPanel`, `ScoreReadout` (Task 8); `Button`, `Readout` (Task 5); `gsap`, `SplitText`, `MQ`, `useGSAP` (Task 4).
- Produces: static routes `/work/koshetty-jewellers`, `/work/sunshine-overseas`, `/work/auto-eda-ai`, `/work/whatsapp-automation-bot`, `/work/sturequire`; per-page metadata; OG images.

- [ ] **Step 1: Install and read the view-transitions skill**

```bash
npx skills add vercel-labs/agent-skills --skill vercel-react-view-transitions -a claude-code -y --copy
```

Read `.claude/skills/vercel-react-view-transitions/SKILL.md` and `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md` (shared-element section) before Step 4.

- [ ] **Step 2: Create `components/case/CaseSection.tsx`**

```tsx
import type { ReactNode } from "react";

export function CaseSection({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  const id = `case-${title.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  return (
    <section aria-labelledby={id} className="grid grid-cols-4 gap-x-gutter border-t border-rule py-12 lg:grid-cols-12">
      <p className="label col-span-4 text-muted lg:col-span-3">{number}</p>
      <div className="col-span-4 mt-4 lg:col-span-8 lg:mt-0">
        <h2 id={id} data-case-heading className="text-h2">
          {title}
        </h2>
        <div className="mt-6 max-w-[68ch]">{children}</div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `components/case/CaseReveal.tsx`**

```tsx
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
```

- [ ] **Step 4: Create `app/work/[slug]/page.tsx`**

Read `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md` and `.../04-functions/generate-metadata.md` first.

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { getProject, isTodo, projects } from "@/content/site";
import { CaseReveal } from "@/components/case/CaseReveal";
import { CaseSection } from "@/components/case/CaseSection";
import { Button } from "@/components/ui/Button";
import { Readout } from "@/components/ui/Readout";
import { FlowPanel } from "@/components/work/FlowPanel";
import { ScoreReadout } from "@/components/work/ScoreReadout";
import { nextProject, projectLinks, statusMarks } from "@/lib/work";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const description = isTodo(project.problem) ? project.subtitle : project.problem;
  return {
    title: `${project.title}: ${project.subtitle}`,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: project.title, description, type: "article" },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const next = nextProject(project.slug, projects);
  const external = projectLinks(project).filter((link) => link.external);
  const results = project.results.filter((result) => !isTodo(result));

  return (
    <CaseReveal>
      <article className="mx-auto max-w-page px-margin pb-section pt-32">
        <Link href="/#work" className="label text-muted hover:text-accent">
          ← All work
        </Link>
        <p className="label mt-10 text-muted">Case study · {project.subtitle}</p>
        <h1 className="instance-display mt-4 text-display-1">{project.title}</h1>
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Status">
          {statusMarks(project).map((mark) => (
            <li key={mark} className="label border border-rule px-2 py-1">
              {mark}
            </li>
          ))}
        </ul>
        <div className="mt-12">
          {project.image ? (
            <ViewTransition name={`work-${project.slug}`}>
              <Image src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} sizes="(min-width: 1440px) 1328px, 100vw" priority className="h-auto w-full border border-rule" />
            </ViewTransition>
          ) : (
            <FlowPanel steps={project.flow ?? []} />
          )}
        </div>
        {external.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-4">
            {external.map((link) => (
              <Button key={link.href} href={link.href} external variant={link.label === "Live site" ? "primary" : "secondary"}>
                {link.label}
              </Button>
            ))}
          </div>
        ) : null}

        <div className="mt-section">
          <CaseSection number="01" title="Problem">
            <p className="text-lead">{project.problem}</p>
          </CaseSection>
          <CaseSection number="02" title="My role">
            <p className="text-lead">{project.role}</p>
          </CaseSection>
          <CaseSection number="03" title="What I built">
            <ul className="flex flex-col gap-4">
              {project.built.map((item) => (
                <li key={item} className="border-l border-rule pl-4">
                  {item}
                </li>
              ))}
            </ul>
          </CaseSection>
          <CaseSection number="04" title="Stack">
            <Readout label="Stack">{project.stack.join(" · ")}</Readout>
          </CaseSection>
          <CaseSection number="05" title="Results">
            <ul className="flex flex-col gap-4">
              {results.map((item) => (
                <li key={item} className="border-l border-accent pl-4">
                  {item}
                </li>
              ))}
            </ul>
            {project.lighthouse ? (
              <div className="mt-8">
                <ScoreReadout lighthouse={project.lighthouse} />
              </div>
            ) : null}
          </CaseSection>
          {project.gallery.length > 0 ? (
            <CaseSection number="06" title="Gallery">
              <div className="flex flex-col gap-8">
                {project.gallery.map((shot) => (
                  <figure key={shot.src}>
                    <Image data-gallery-image src={shot.src} alt={shot.alt} width={1266} height={617} sizes="(min-width: 1024px) 66vw, 100vw" className="h-auto w-full border border-rule" />
                    <figcaption className="label mt-3 text-muted">{shot.alt}</figcaption>
                  </figure>
                ))}
              </div>
            </CaseSection>
          ) : null}
        </div>

        <nav aria-label="Next project" className="mt-section border-t border-rule pt-10">
          <p className="label text-muted">Next project</p>
          <Link href={`/work/${next.slug}`} className="group instance-display mt-4 inline-flex items-baseline gap-4 text-display-2 hover:text-accent">
            {next.title} <span aria-hidden="true" className="arrow">→</span>
          </Link>
        </nav>
      </article>
    </CaseReveal>
  );
}
```

Gallery images are all StuRequire crops at 1266×617; if a future gallery image has other dimensions, add `width`/`height` to the gallery type then.

- [ ] **Step 5: Create `app/work/[slug]/opengraph-image.tsx`**

Read `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md` first.

```tsx
import { ImageResponse } from "next/og";
import { getProject, profile } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Case study by Kankanti Praneeth";

// Params come from the page's generateStaticParams in this segment; no separate export is needed.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0D0C0A", color: "#F2F0EA", padding: 72 }}>
        <div style={{ fontSize: 24, letterSpacing: 4, color: "#A7A49E" }}>{`${profile.name.toUpperCase()} · CASE STUDY`}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 92, fontWeight: 700, lineHeight: 1 }}>{project?.title ?? "Project"}</div>
          <div style={{ fontSize: 34, color: "#A7A49E" }}>{project?.subtitle ?? ""}</div>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ background: "#F8CC2F", color: "#130F06", fontSize: 26, padding: "10px 18px" }}>{project?.stack.slice(0, 3).join(" · ") ?? ""}</div>
        </div>
      </div>
    ),
    size,
  );
}
```

- [ ] **Step 6: View-transition CSS in `app/globals.css`** (top level, after `@layer` blocks)

```css
::view-transition-group(*) {
  animation-duration: 0.4s;
  animation-timing-function: var(--ease-specimen-move);
}
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.2s;
}
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
```

- [ ] **Step 7: Run the full check**

Run: `npm run check` → Expected: success; the build output lists the 5 `/work/[slug]` routes as static (●/SSG).

- [ ] **Step 8: BC on case pages and navigation**

Run BC for `/work/koshetty-jewellers` and `/work/whatsapp-automation-bot` (use `playwright-cli goto` for the second). Snapshots show `heading "<title>" [level=1]`, headings Problem, My role, What I built, Stack, Results, and `navigation "Next project"`. WhatsApp has no `Live site` / `GitHub` buttons and shows the `How it works` list. `/work/sturequire` shows `Gallery` with 3 images. Then, at 1440px:

```bash
playwright-cli goto http://localhost:3100/
playwright-cli eval "window.__ScrollTrigger.getAll().length"
playwright-cli find "Case study: Koshetty Jewellers"
playwright-cli click <ref>
playwright-cli eval "location.pathname"
playwright-cli go-back
playwright-cli eval "new Promise(r => setTimeout(() => r([window.__ScrollTrigger.getAll().length, document.querySelectorAll('.pin-spacer').length, document.querySelectorAll('html.lenis').length]), 800))"
playwright-cli console error
playwright-cli goto http://localhost:3100/work/koshetty-jewellers/opengraph-image
```

Expected: path `/work/koshetty-jewellers`; after Back the ScrollTrigger count equals the first reading, exactly 1 pin spacer and Lenis still active (Review Focus 4); no console errors; the OG route returns an image (the snapshot shows an `img`). `curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/work/not-a-project` returns `404`.

- [ ] **Step 9: Commit**

```bash
git add app/work components/case app/globals.css .claude/skills/vercel-react-view-transitions skills-lock.json
git commit -m "feat: static case-study pages with image morph, per-page metadata and OG images" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: About section

**Files:**
- Create: `components/about/About.tsx`, `components/about/AboutMotion.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `summary`, `profile` (content); `gsap`, `SplitText`, `MQ`, `useGSAP` (Task 4).
- Produces: `<About />` (section `#about`).

- [ ] **Step 1: Create `components/about/AboutMotion.tsx`**

```tsx
"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/components/motion/gsap-setup";

/** Scroll-scrubbed word highlight for [data-scrub] paragraphs and a one-time reveal for [data-portrait]. */
export function AboutMotion({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const paragraphs = gsap.utils.toArray<HTMLElement>("[data-scrub]");
        if (paragraphs.length > 0) {
          const split = SplitText.create(paragraphs, { type: "words" });
          gsap.fromTo(
            split.words,
            { opacity: 0.25 },
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
```

- [ ] **Step 2: Create `components/about/About.tsx`**

```tsx
import Image from "next/image";
import { profile, summary } from "@/content/site";
import { AboutMotion } from "./AboutMotion";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-b border-rule py-section">
      <AboutMotion className="mx-auto grid max-w-page grid-cols-4 gap-x-gutter px-margin lg:grid-cols-12">
        <div className="col-span-4 lg:col-span-7">
          <p className="label text-muted">01 · About</p>
          <h2 id="about-title" className="mt-4 text-h2">
            About me
          </h2>
          <div className="mt-10 flex flex-col gap-6">
            {summary.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} data-scrub className="max-w-[60ch] text-lead">
                {paragraph}
              </p>
            ))}
          </div>
          <p aria-hidden="true" className="label mt-10 text-muted">
            Body text · Anek Latin 400 · wdth 100
          </p>
        </div>
        <figure className="col-span-4 mt-14 border border-rule lg:col-span-4 lg:col-start-9 lg:mt-0">
          <div className="overflow-hidden">
            <Image data-portrait src={profile.photo} alt={`Portrait of ${profile.name}`} width={1086} height={1448} sizes="(min-width: 1024px) 30vw, 100vw" className="h-auto w-full" />
          </div>
          <figcaption className="label border-t border-rule p-4 text-muted">
            {profile.name} · {profile.location}
          </figcaption>
        </figure>
      </AboutMotion>
    </section>
  );
}
```

- [ ] **Step 3: Render About between Hero and SelectedWork in `app/page.tsx`**

- [ ] **Step 4: Run the full check**

Run: `npm run check` → Expected: success.

- [ ] **Step 5: BC with About checks**

Snapshot shows `heading "About me" [level=2]`, both summary paragraphs as text, and `img "Portrait of Kankanti Praneeth"`. Before `close`, at 1440px:

```bash
playwright-cli set-reduced-motion reduce
playwright-cli reload
playwright-cli eval "document.querySelectorAll('#about [data-scrub] div').length"
playwright-cli clear-reduced-motion
playwright-cli reload
playwright-cli eval "window.__ScrollTrigger.getAll().length"
```

Expected: `0` (no word split under reduced motion); ScrollTrigger count ≤ 12. No console errors.

- [ ] **Step 6: Commit**

```bash
git add components/about app/page.tsx
git commit -m "feat: about section with scrubbed word highlight and portrait cell" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: More projects and Experience timeline

**Files:**
- Create: `components/work/MoreProjects.tsx`, `components/experience/Experience.tsx`, `components/experience/TimelineMotion.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `projects`, `experience` (content); `statusMarks` (Task 2); `formatMonth` (Task 2); `Reveal`, `gsap`, `MQ`, `useGSAP` (Task 4).
- Produces: `<MoreProjects />` (non-featured projects, links to case studies); `<Experience />` (section `#experience`).

- [ ] **Step 1: Create `components/work/MoreProjects.tsx`**

```tsx
import Link from "next/link";
import { projects } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { statusMarks } from "@/lib/work";

export function MoreProjects() {
  const more = projects.filter((project) => !project.featured).sort((a, b) => a.order - b.order);
  if (more.length === 0) return null;
  return (
    <section aria-labelledby="more-title" className="border-b border-rule py-16">
      <div className="mx-auto max-w-page px-margin">
        <h2 id="more-title" className="label text-muted">
          More projects
        </h2>
        <Reveal>
          <ul className="mt-6">
            {more.map((project) => (
              <li key={project.slug} data-reveal className="border-t border-rule">
                <Link href={`/work/${project.slug}`} className="group grid grid-cols-1 gap-2 py-6 lg:grid-cols-[1fr_auto_auto] lg:items-baseline lg:gap-8">
                  <span className="instance-display text-h2 group-hover:text-accent">{project.title}</span>
                  <span className="text-small text-muted">{project.subtitle}</span>
                  <span className="label text-muted">
                    {statusMarks(project).join(" · ")} <span aria-hidden="true" className="arrow">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/experience/TimelineMotion.tsx`**

```tsx
"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, useGSAP } from "@/components/motion/gsap-setup";

/** Draws [data-line] with scaleY and fades [data-tick] labels in as the line passes them. */
export function TimelineMotion({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const line = ref.current?.querySelector("[data-line]");
        if (!line) return;
        const ticks = gsap.utils.toArray<HTMLElement>("[data-tick]");
        const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 60%", scrub: true } });
        tl.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: "none", duration: 1 }, 0);
        ticks.forEach((tick, index) => tl.fromTo(tick, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1, ease: "none" }, (index / Math.max(1, ticks.length - 1)) * 0.9));
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
```

- [ ] **Step 3: Create `components/experience/Experience.tsx`**

```tsx
import { experience } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { formatMonth } from "@/lib/format";
import { TimelineMotion } from "./TimelineMotion";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="border-b border-rule py-section">
      <div className="mx-auto grid max-w-page grid-cols-4 gap-x-gutter px-margin lg:grid-cols-12">
        <div className="col-span-4 lg:col-span-4">
          <p className="label text-muted">03 · Experience</p>
          <h2 id="experience-title" className="mt-4 text-h2">
            Experience
          </h2>
        </div>
        <TimelineMotion className="relative col-span-4 mt-10 pl-10 lg:col-span-8 lg:mt-0">
          <span data-line aria-hidden="true" className="absolute left-0 top-0 h-full w-px origin-top bg-paper" />
          {experience.map((job) => (
            <article key={job.id} aria-labelledby={`job-${job.id}`} className="pb-4">
              <ol aria-label="Dates" className="flex flex-col gap-2">
                <li data-tick className="label text-accent">
                  {formatMonth(job.start)}
                </li>
              </ol>
              <h3 id={`job-${job.id}`} className="instance-display mt-4 text-display-2">
                {job.role}
              </h3>
              <p className="mt-3 text-lead text-muted">
                {job.company} ({job.org}) · {job.location}
              </p>
              <Reveal>
                <ul className="mt-8 flex flex-col gap-4">
                  {job.bullets.map((bullet) => (
                    <li key={bullet} data-reveal className="max-w-[60ch] border-t border-rule pt-4">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <p data-tick className="label mt-8 text-muted">
                {formatMonth(job.end)}
              </p>
            </article>
          ))}
        </TimelineMotion>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Render in `app/page.tsx`**

Order: `<Hero /> <About /> <SelectedWork /> <MoreProjects /> <Experience />`.

- [ ] **Step 5: Run the full check**

Run: `npm run check` → Expected: success.

- [ ] **Step 6: BC with section checks**

Snapshot shows `heading "More projects"` with a link containing `StuRequire` and `LOCAL ONLY`, and `heading "Experience" [level=2]` with `heading "AI Engineering Intern" [level=3]`, `MAY 2025`, `JUN 2025` and the three bullets. At 1440px: `playwright-cli eval "window.__ScrollTrigger.getAll().length"` → ≤ 12. Under `set-reduced-motion reduce` + reload: `playwright-cli eval "getComputedStyle(document.querySelector('[data-line]')).transform"` → `none` (line fully drawn, not scaled). No console errors.

- [ ] **Step 7: Commit**

```bash
git add components/work/MoreProjects.tsx components/experience app/page.tsx
git commit -m "feat: more projects list and experience baseline timeline" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Skills glyph table with pinning

**Files:**
- Create: `components/skills/Skills.tsx`, `components/skills/GlyphTable.tsx`
- Modify: `app/page.tsx`, `app/globals.css` (pinned cell overlay)

**Interfaces:**
- Consumes: `skills`, `projects` (content); `projectsUsingSkill` (Task 2); `useSpecimen` (Task 6, `pinnedSkill` / `setPinnedSkill`); `gsap`, `MQ`, `useGSAP` (Task 4); `useReducedMotion`.
- Produces: `<Skills />` (section `#skills`). Pinning a skill also dims non-matching Selected Work sheets (already handled by Task 8's emphasis effect through `pinnedSkill`).

- [ ] **Step 1: Create `components/skills/GlyphTable.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useRef, type KeyboardEvent } from "react";
import { projects, skills } from "@/content/site";
import { gsap, MQ, useGSAP } from "@/components/motion/gsap-setup";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useSpecimen } from "@/components/specimen/SpecimenProvider";
import { projectsUsingSkill } from "@/lib/skills";

export function GlyphTable() {
  const { pinnedSkill, setPinnedSkill } = useSpecimen();
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const pinnedProjects = pinnedSkill ? projectsUsingSkill(pinnedSkill, skills, projects) : [];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-cell]", { autoAlpha: 0, duration: 0.4, ease: "specimen-out", stagger: { each: 0.02, grid: "auto", from: "start" }, scrollTrigger: { trigger: root.current, start: "top 80%", once: true } });
      });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-cell]").forEach((cell) => {
        const on = pinnedSkill === null || cell.dataset.skill === pinnedSkill;
        gsap.to(cell, { opacity: on ? 1 : 0.35, duration: reduced ? 0 : 0.2, ease: "specimen-out", overwrite: "auto" });
      });
    },
    { dependencies: [pinnedSkill, reduced], scope: root },
  );

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && pinnedSkill) setPinnedSkill(null);
  };

  return (
    <div ref={root} onKeyDown={onKeyDown}>
      <p aria-live="polite" className="min-h-14 border-t border-rule py-4 text-small">
        {pinnedSkill === null ? (
          <span className="label text-muted">Select a skill to see where I used it. Esc clears.</span>
        ) : pinnedProjects.length > 0 ? (
          <>
            <span className="font-semibold text-accent">{pinnedSkill}</span> · used in{" "}
            {pinnedProjects.map((project, index) => (
              <span key={project.slug}>
                {index > 0 ? ", " : ""}
                <Link href={`/work/${project.slug}`} className="underline decoration-rule underline-offset-4 hover:decoration-accent">
                  {project.title}
                </Link>
              </span>
            ))}
          </>
        ) : (
          <>
            <span className="font-semibold text-accent">{pinnedSkill}</span> · listed on my resume; no project on this site shows it yet.
          </>
        )}
      </p>
      {skills.map((group) => {
        const headingId = `skills-${group.name.toLowerCase().replace(/[^a-z]+/g, "-")}`;
        return (
          <div key={group.name} role="group" aria-labelledby={headingId} className="grid grid-cols-1 border-t border-rule lg:grid-cols-[14rem_1fr]">
            <h3 id={headingId} className="label py-4 text-muted lg:pr-4">
              {group.name}
            </h3>
            <ul className="grid grid-cols-2 border-l border-rule sm:grid-cols-3 lg:grid-cols-6">
              {group.skills.map((skill) => (
                <li key={skill.name} className="border-b border-r border-rule">
                  <button
                    type="button"
                    data-cell
                    data-skill={skill.name}
                    aria-pressed={pinnedSkill === skill.name}
                    onClick={() => setPinnedSkill(pinnedSkill === skill.name ? null : skill.name)}
                    className="cell relative flex h-full min-h-24 w-full flex-col justify-between gap-3 p-4 text-left"
                  >
                    <span className="text-h3 font-semibold">{skill.name}</span>
                    <span className="label text-muted">{skill.usedIn.length === 0 ? "Resume" : `${skill.usedIn.length} project${skill.usedIn.length > 1 ? "s" : ""}`}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Pinned cell overlay in `app/globals.css`** (`@layer components`)

```css
  .cell::after {
    content: "";
    position: absolute;
    inset: 0;
    border: 2px solid var(--color-accent);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s var(--ease-specimen-out);
  }
  .cell[aria-pressed="true"]::after,
  .cell:hover::after {
    opacity: 1;
  }
```

- [ ] **Step 3: Create `components/skills/Skills.tsx`**

```tsx
import { GlyphTable } from "./GlyphTable";

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="border-b border-rule py-section">
      <div className="mx-auto max-w-page px-margin">
        <p className="label text-muted">04 · Skills</p>
        <h2 id="skills-title" className="mt-4 text-h2">
          Skills, and where I used them
        </h2>
        <div className="mt-12">
          <GlyphTable />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Render after Experience in `app/page.tsx`**

- [ ] **Step 5: Run the full check**

Run: `npm run check` → Expected: success.

- [ ] **Step 6: BC with pinning checks**

Snapshot shows `heading "Skills, and where I used them"`, five `group`s (AI & Agents, Frontend, Backend, CMS/CRM & SEO, Data & Tools) and buttons for each skill. Before `close`, at 1440px:

```bash
playwright-cli find "n8n"
playwright-cli click <ref of the n8n button>
playwright-cli eval "document.querySelector('#skills [aria-live]').textContent"
playwright-cli eval "new Promise(r => setTimeout(() => r([...document.querySelectorAll('[data-sheet]')].map(s => s.dataset.emphasis)), 600))"
playwright-cli press Escape
playwright-cli eval "document.querySelector('[data-skill=n8n]').getAttribute('aria-pressed')"
playwright-cli find "LangChain"
playwright-cli click <ref>
playwright-cli eval "document.querySelector('#skills [aria-live]').textContent"
playwright-cli eval "window.__ScrollTrigger.getAll().length"
```

Expected: the readout contains "n8n · used in AI-Powered WhatsApp Automation Bot"; emphasis `["off","off","off","on"]`; after Escape `false`; LangChain shows "listed on my resume"; ScrollTrigger count ≤ 12. Keyboard: Tab reaches each cell button and Enter toggles it. No console errors.

- [ ] **Step 7: Commit**

```bash
git add components/skills app/page.tsx app/globals.css
git commit -m "feat: skills glyph table with pin-to-isolate linked to selected work" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: Certifications, education and contact

**Files:**
- Create: `components/credentials/Credentials.tsx`, `components/contact/Contact.tsx`, `components/contact/CopyEmail.tsx`, `components/contact/Magnetic.tsx`
- Modify: `app/page.tsx`, `MOTION.md` §4.9 (copy feedback without fade)

**Interfaces:**
- Consumes: `certifications`, `education`, `profile` (content); `formatIssued` (Task 2); `Reveal`, `gsap`, `useGSAP` (Task 4); `Button` (Task 5).
- Produces: `<Credentials />` (section `#credentials`), `<Contact />` (section `#contact`), `<CopyEmail email />`, `<Magnetic>`. Final `app/page.tsx`.

- [ ] **Step 1: Create `components/credentials/Credentials.tsx`**

```tsx
import { certifications, education } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { formatIssued } from "@/lib/format";

export function Credentials() {
  return (
    <section id="credentials" aria-labelledby="credentials-title" className="border-b border-rule py-section">
      <div className="mx-auto max-w-page px-margin">
        <p className="label text-muted">05 · Certifications & education</p>
        <h2 id="credentials-title" className="mt-4 text-h2">
          Credentials
        </h2>
        <Reveal>
          <ul className="mt-12">
            {certifications.map((cert) => (
              <li key={cert.name} data-reveal className="grid grid-cols-1 gap-2 border-t border-rule py-5 lg:grid-cols-[1fr_12rem_16rem_8rem_8rem] lg:items-baseline lg:gap-6">
                <span className="text-h3 font-semibold">{cert.name}</span>
                <span className="label text-muted">{cert.kind}</span>
                <span className="text-small text-muted">{cert.issuer}</span>
                <span className="font-mono text-readout">{formatIssued(cert.issued)}</span>
                {cert.verifyUrl ? (
                  <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer" className="group label hover:text-accent">
                    Verify <span aria-hidden="true" className="arrow">↗</span>
                    <span className="sr-only"> {cert.name} (opens in a new tab)</span>
                  </a>
                ) : (
                  <span className="font-mono text-readout text-muted">ID {cert.credentialId}</span>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
        {education.map((item) => (
          <div key={item.degree} className="mt-16 grid grid-cols-1 gap-4 border-t border-rule pt-8 lg:grid-cols-[1fr_auto] lg:items-baseline">
            <div>
              <h3 className="instance-display text-h2">{item.degree}</h3>
              <p className="mt-2 text-lead text-muted">{item.institution}</p>
              <p className="label mt-4 text-muted">Coursework · {item.coursework.join(" · ")}</p>
            </div>
            <div className="flex flex-col gap-1 font-mono text-readout lg:text-right">
              <span>
                {item.start} – {item.end}
              </span>
              <span>CGPA {item.cgpa}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/contact/CopyEmail.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "copied" | "manual";

const MESSAGES: Record<Status, string> = {
  idle: "Click the address to copy it",
  copied: "Copied ✓",
  manual: "Selected. Press Ctrl+C (⌘+C on Mac) to copy",
};

export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (status === "idle") return;
    const timer = window.setTimeout(() => setStatus("idle"), status === "copied" ? 2000 : 6000);
    return () => window.clearTimeout(timer);
  }, [status]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      const selection = window.getSelection();
      if (textRef.current && selection) {
        const range = document.createRange();
        range.selectNodeContents(textRef.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setStatus("manual");
    }
  };

  return (
    <div>
      <button type="button" onClick={copy} className="instance-display text-left text-display-2 break-all hover:text-accent">
        <span ref={textRef}>{email}</span>
        <span className="sr-only"> (copy email address)</span>
      </button>
      <p aria-live="polite" className="label mt-4 text-muted">
        {MESSAGES[status]}
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Create `components/contact/Magnetic.tsx`**

```tsx
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
```

- [ ] **Step 4: Create `components/contact/Contact.tsx`**

```tsx
import { profile } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { CopyEmail } from "./CopyEmail";
import { Magnetic } from "./Magnetic";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="py-section">
      <div className="mx-auto max-w-page px-margin">
        <p className="label text-muted">06 · Contact</p>
        <h2 id="contact-title" className="mt-4 max-w-[22ch] text-h2">
          Hiring, or need a website or an automation built?
        </h2>
        <div className="mt-12">
          <CopyEmail email={profile.email} />
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <Magnetic>
            <Button href={`mailto:${profile.email}`} variant="primary" external={false}>
              Write an email
            </Button>
          </Magnetic>
          <Magnetic>
            <Button href={profile.linkedin} variant="secondary" external>
              LinkedIn
            </Button>
          </Magnetic>
          <Magnetic>
            <Button href={profile.github} variant="secondary" external>
              GitHub
            </Button>
          </Magnetic>
          <Magnetic>
            <Button href={profile.resumeUrl} variant="secondary" download>
              Download resume
            </Button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
```

`Button` renders `mailto:` through `next/link`, which passes non-HTTP schemes through as a plain anchor. If the BC shows otherwise, add `href.startsWith("mailto:")` to the plain-`<a>` branch condition in `components/ui/Button.tsx`.

- [ ] **Step 5: Final `app/page.tsx`**

```tsx
import { About } from "@/components/about/About";
import { Contact } from "@/components/contact/Contact";
import { Credentials } from "@/components/credentials/Credentials";
import { Experience } from "@/components/experience/Experience";
import { Hero } from "@/components/hero/Hero";
import { Skills } from "@/components/skills/Skills";
import { SpecimenProvider } from "@/components/specimen/SpecimenProvider";
import { MoreProjects } from "@/components/work/MoreProjects";
import { SelectedWork } from "@/components/work/SelectedWork";

export default function Home() {
  return (
    <SpecimenProvider>
      <Hero />
      <About />
      <SelectedWork />
      <MoreProjects />
      <Experience />
      <Skills />
      <Credentials />
      <Contact />
    </SpecimenProvider>
  );
}
```

- [ ] **Step 6: Record the copy-feedback simplification in `MOTION.md` §4.9**

Replace "The readout swaps to `COPIED ✓` (crossfade 0.2s), holds 2s, then swaps back." with "The readout text swaps to `Copied ✓` instantly, holds 2s, then swaps back; if the Clipboard API fails, the address is selected and the readout explains how to copy it."

- [ ] **Step 7: Run the full check**

Run: `npm run check` → Expected: success.

- [ ] **Step 8: BC with contact and whole-page checks**

Snapshot shows `heading "Credentials"` with 5 rows (each with `Verify` or an `ID`), `heading "B.Tech, Computer Science & Engineering"`, `CGPA 7.83 / 10`, and `heading "Hiring, or need a website or an automation built?"` with the email button and links LinkedIn, GitHub, Write an email, Download resume. Before `close`, at 1440px:

```bash
playwright-cli run-code "async page => { await page.context().grantPermissions(['clipboard-read','clipboard-write']); }"
playwright-cli find "kankantipraneeth@gmail.com"
playwright-cli click <ref>
playwright-cli eval "document.querySelector('#contact [aria-live]').textContent"
playwright-cli run-code "async page => { await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('denied')) } }); }); }"
playwright-cli click <ref>
playwright-cli eval "[document.querySelector('#contact [aria-live]').textContent, String(window.getSelection())]"
playwright-cli eval "document.body.innerText.includes('6305')"
playwright-cli eval "window.__ScrollTrigger.getAll().length"
playwright-cli set-reduced-motion reduce
playwright-cli reload
playwright-cli eval "[...document.querySelectorAll('[data-reveal],[data-cell],[data-sheet]')].every(el => getComputedStyle(el).opacity === '1' && getComputedStyle(el).visibility !== 'hidden')"
playwright-cli clear-reduced-motion
```

Expected: `Copied ✓`; with clipboard rejected, `["Selected. Press Ctrl+C (⌘+C on Mac) to copy", "kankantipraneeth@gmail.com"]` (Review Focus 5); `false` (no phone number); ScrollTrigger count ≤ 12 with the whole page assembled; `true` (everything visible under reduced motion). No console errors at 375px or 1440px.

- [ ] **Step 9: Commit**

```bash
git add components/credentials components/contact app/page.tsx MOTION.md
git commit -m "feat: credentials, education and contact with copy-email fallback and magnetic links" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## After the plan

Phases 8–10 of the build guide run as their own prompts on the finished site: `/impeccable critique` and `polish` (then `/impeccable document` to rewrite DESIGN.md from the shipped build), the web-quality / SEO / schema pass (sitemap, robots, home OG image, JSON-LD), then code review and Vercel deploy.
