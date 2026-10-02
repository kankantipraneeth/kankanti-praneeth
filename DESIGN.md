# DESIGN.md — Praneeth Portfolio

Status: Phase 2 design spec, written before the build because the build guide asks for it. Re-document from the shipped build at the end (impeccable `document`) so this file describes reality.

## 1. Direction: "Specimen"

1. The site is a live **variable-type specimen of a developer**: one axis, **Web ⟷ AI**, that the visitor drags and the page answers.
2. Ink-black page, paper-white type, a hairline grid of cells and rules, and **one Tangedu-yellow accent** (Telangana's state flower) reserved for the active axis and the primary action.
3. Enormous display type set against tiny monospace readouts. Hierarchy comes from **scale contrast**, not boxes, shadows or color.

What it refuses: the default dark hero + three project cards + skill-chip cloud, purple/blue gradients, glassmorphism, glowing edges, percentage skill bars.

Product facts always win over the metaphor. The specimen is the frame; every number and claim comes from `content/site.ts`.

## 2. Typography

All fonts via `next/font/google`, variable, `display: "swap"`.

| Role | Face | Axes used | Notes |
|---|---|---|---|
| Display + body | **Anek Latin** (Ek Type) | `wdth` 75–125, `wght` 100–800 | One family for everything readable. Display uses wide/heavy instances; body uses `wdth 100`. |
| Specimen glyph | **Anek Telugu** (`telugu` subset only) | same | Only for the hero/loader glyph "ప్ర" ("Pra" of ప్రణీత్, confirmed by Praneeth). |
| Readouts, labels, data | **Martian Mono** | `wdth` 75–112.5, `wght` 100–800 | Axis readouts, section labels, stack lists, scores, dates. Uppercase labels only. |

Why these: Anek is a variable family from an Indian foundry, built for Latin and Telugu together. It matches the bilingual (English/Telugu) client work and gives real `wdth` + `wght` axes for the specimen mechanic. Martian Mono has its own width axis, so readouts can track the hero axis too.

### Named instances (the specimen "presets")

| Instance | `wdth` | `wght` | Used for |
|---|---|---|---|
| `Web` | 125 | 300 | Hero glyph and role axis at the Web end |
| `Full-stack` | 100 | 600 | Default state |
| `AI` | 75 | 800 | Hero glyph and role axis at the AI end |
| `Display` | 112 | 700 | Name, project titles |
| `Text` | 100 | 400 | Body |
| `Strong` | 100 | 600 | Inline emphasis, buttons |

### Type scale (fluid, rem at 16px root)

| Token | Size | Line height | Tracking | Face / instance |
|---|---|---|---|---|
| `--text-glyph` | `clamp(14rem, 30vw, 36rem)` | 0.8 | 0 | Anek (Telugu for ప్ర) — decorative, `aria-hidden` |
| `--text-display-1` | `clamp(3.25rem, 7vw, 7.25rem)` | 0.92 | -0.02em | Anek `Display` — your name, 2 lines |
| `--text-display-2` | `clamp(2.5rem, 5.5vw, 5.5rem)` | 0.95 | -0.015em | Anek `Display` — project titles, case-study hero |
| `--text-h2` | `clamp(2rem, 3.4vw, 3.25rem)` | 1.05 | -0.01em | Anek 700 / wdth 100 |
| `--text-h3` | `1.5rem` | 1.2 | 0 | Anek 600 |
| `--text-lead` | `clamp(1.125rem, 1.6vw, 1.375rem)` | 1.45 | 0 | Anek 400 |
| `--text-body` | `1.0625rem` | 1.6 | 0 | Anek 400, max 68ch |
| `--text-small` | `0.9375rem` | 1.5 | 0 | Anek 400 |
| `--text-label` | `0.75rem` | 1.4 | 0.08em, uppercase | Martian Mono 500 |
| `--text-readout` | `0.8125rem` | 1.4 | 0, `tabular-nums` | Martian Mono 400 |

More space above a heading than below it. Body text never below 16px on mobile.

## 3. Color (OKLCH, dark-first)

Color strategy: **Restrained**, meaning neutrals plus one accent. The accent never decorates; it marks "this is active" or "this is the action". No gradients anywhere.

### Dark (default)

| Token | OKLCH | ≈ Hex | Use |
|---|---|---|---|
| `--ink` | `oklch(0.155 0.004 90)` | `#0D0C0A` | Page ground |
| `--ink-raised` | `oklch(0.195 0.005 90)` | `#161512` | Hovered / pinned cell, nav on scroll |
| `--rule` | `oklch(0.30 0.006 90)` | `#2F2E2A` | Hairlines, grid lines (decorative only) |
| `--muted` | `oklch(0.72 0.010 90)` | `#A7A49E` | Secondary text, slider track, inactive readouts |
| `--paper` | `oklch(0.955 0.008 95)` | `#F2F0EA` | Primary text, glyph |
| `--accent` | `oklch(0.86 0.165 92)` | `#F8CC2F` | Tangedu: slider thumb, active preset, primary button fill, focus ring |
| `--on-accent` | `oklch(0.17 0.02 90)` | `#130F06` | Text on accent fills |

Measured contrast: paper/ink 17.2:1 · muted/ink 7.9:1 · muted/raised 7.4:1 · accent/ink 12.8:1 · on-accent/accent 12.5:1. Rules (1.4:1) are never the only signal for anything interactive.

### Light (opt-in via `data-theme="light"`; the specimen's native paper look)

| Token | OKLCH | ≈ Hex |
|---|---|---|
| `--ink` | `oklch(0.975 0.004 95)` | `#F7F7F4` |
| `--ink-raised` | `oklch(0.945 0.005 95)` | `#EEEDE9` |
| `--rule` | `oklch(0.86 0.006 95)` | `#D2D1CD` |
| `--muted` | `oklch(0.48 0.010 90)` | `#605D57` (6.1:1) |
| `--paper` | `oklch(0.17 0.004 90)` | `#100F0D` (17.8:1) |
| `--accent` | `oklch(0.86 0.165 92)` | fills only (with `--on-accent` text) |
| `--accent-ink` | `oklch(0.50 0.10 80)` | accent as text/lines on light (≈5.7:1) |

Token names describe roles, not colors, so components never change between themes.

## 4. Spacing, grid, layout

- **Spacing scale (4px base):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192 → `--space-1` … `--space-11`.
- **Section rhythm:** `--section-y: clamp(96px, 14vw, 192px)` between sections; quiet sections may use the full value, dense ones (skills table) the minimum.
- **Grid:** 12 columns, `--gutter: clamp(16px, 2vw, 24px)`, page margin `--margin: clamp(16px, 4vw, 56px)`, max content width 1440px. Body copy max 68ch.
- **Hairline grid:** sections are separated by full-bleed 1px `--rule` lines, as on a specimen sheet. Cells (skills, glyph rows) share borders; they are never floating cards with gaps.
- **Radius:** 0 everywhere except the slider thumb (full circle). **Shadows:** none.
- **Breakpoints:** 375 (base), 768 (`md`), 1024 (`lg`), 1440 (`xl`). No pinning below 768px.

### First viewport (desktop ≥1024px)

| Columns | Content |
|---|---|
| 1–5 | `AXIS: ROLE · FULL-STACK` readout → name (display-1, 2 lines) → role line (lead) → positioning sentence (body, muted) → **Download resume** (primary) + **Get in touch** (secondary) |
| 6–9 | Giant specimen glyph (P / ప్ర) with a vertical axis slider beside it, live `wght 600 · wdth 100` readout |
| 10–12 | `AXIS CONTROLS` panel: Role slider (Web ⟷ AI) with min/max labels, three preset cells **Web / Full-stack / AI** |

Mobile (375): readout → name → role line → glyph (≈60vw) with a horizontal slider under it → presets as a 3-cell row → CTAs full width. The name stays the LCP element and paints before any animation.

## 5. The signature interaction: the Role axis

- One `<input type="range">` (0–100) labelled **"Role: Web to AI"**, with three named stops (Web 0, Full-stack 50, AI 100) also exposed as buttons.
- Moving it:
  1. interpolates the hero glyph's `wdth`/`wght` between the `Web` and `AI` instances and updates the readout;
  2. swaps the role line between three true statements taken from `content/site.ts` (web: client sites with CMS/CRM/SEO; full-stack: positioning line; AI: n8n + LLM automation, Auto-EDA, Viswam.AI);
  3. re-weights **Selected work**: projects that don't match the stop dim (screenshot to 35%, text to 75% so it stays at WCAG AA); they are never hidden or reordered. Tags: Koshetty, Sunshine, StuRequire = web; WhatsApp bot, Auto-EDA = AI.
- Keyboard: arrow keys step by 5, Home/End jump to the ends, the preset buttons are focusable. State is announced through `aria-valuetext` ("AI").
- **Reduced motion:** the slider snaps between the three named instances; no interpolation.

**Rule exception (approved, recorded in CLAUDE.md):** CLAUDE.md says to animate only `transform` and `opacity`. The specimen mechanic needs `font-variation-settings` on exactly **one** element: the hero/loader glyph. It sits in a fixed-size, `contain: strict` box, so changing it can't shift layout anywhere else. Everything else follows the transform/opacity rule.

## 6. Components

| Component | Specimen grammar | Notes |
|---|---|---|
| `Nav` | Top bar like a foundry header: name + mono subline "Full-stack + AI developer · Hyderabad"; links Work · About · Experience · Skills · Contact; **Resume ↓** outlined button | Sticky; gains `--ink-raised` + bottom rule after 24px of scroll. Mobile: name + menu button → full-screen list. |
| `Readout` | `LABEL  value` in Martian Mono | Used for axis values, dates, scores, stack, status. |
| `Button` | Primary: accent fill, `--on-accent` text, square, arrow glyph. Secondary: 1px `--paper` outline. Link: underline on hover | 48px min height, visible 2px accent focus ring offset 3px. |
| `AxisSlider` | Hairline track (`--muted`), round accent thumb, min/max mono labels, live value | Vertical next to the glyph on desktop, horizontal on mobile. |
| `PresetCells` | 3 bordered cells, two-line label (`Web` / "Sites · CMS · SEO") | Active cell: accent border + accent label. |
| `SpecimenGlyph` | One giant glyph, `aria-hidden` | The only element whose font axes animate. |
| `WorkSheet` | One project = one specimen sheet: title at display-2 in its own instance, subtitle, screenshot (next/image), readout block (stack · status · Lighthouse · links) | Desktop: sheets in a pinned horizontal sequence. Mobile: stacked. |
| `StatusMark` | Mono label: `LIVE`, `LOCAL ONLY`, `PRIVATE REPO`, `PUBLIC REPO` | Honest status from `content/site.ts`; never a fake link. |
| `ScoreReadout` | `PERF 90 · A11Y 100 · BP 96 · SEO 100` with `MOBILE / DESKTOP` toggle and measured date | Shows only scores in `content/site.ts` (Koshetty shows no SEO). |
| `GlyphTable` (skills) | 5 rows (one per group), each skill a cell in a shared-border table, like a glyph set | Pinning a cell (click/Enter) isolates the projects that used it and shows "Used in: …"; cells with empty `usedIn` show "Listed on resume". |
| `BaselineTimeline` (experience) | A vertical ruler with month ticks and labels (`MAY 2025`, `JUN 2025`) like baseline/cap-height metric lines | Line draws on scroll via `scaleY`. |
| `CredentialRows` | Table rows: name · kind · issuer · date · Verify → | Kind label keeps "Course completion" honest. Education as a final row block. |
| `CopyEmail` | Email set at display-2 size; click copies; readout flips to `COPIED ✓` for 2s | Plus LinkedIn and GitHub as large text links. |
| `CaseStudyLayout` | Sheet hero (title, subtitle, image) → numbered sections `01 PROBLEM`, `02 ROLE`, `03 WHAT I BUILT`, `04 STACK`, `05 RESULTS`, `06 GALLERY` → live link → next project | Image shares a view-transition name with its WorkSheet. |
| `Gallery` | Full-width images with mono captions | Only genuine screenshots (`gallery` in `content/site.ts`). |
| `Loader` | The glyph morphs from `wght 100` to `800` once, then hands off to the hero glyph | ≤1.5s, skippable (click/key), once per session, skipped under reduced motion. |
| `Footer` | Final rule, name, "Built with Next.js · GSAP", year, back-to-top | |

## 7. Section order (home)

Shipped work leads (PRODUCT.md principle 2). Changed in Phase 8 after the critique.

1. **Loader** (first visit per session only)
2. **Hero / specimen**: name, role line, proof line (2 live client sites · Sanity CMS + HubSpot CRM · Lighthouse accessibility 100 on mobile), resume + contact, work filter
3. **Selected work**: Koshetty Jewellers, Sunshine Overseas, Auto-EDA AI, WhatsApp Automation Bot, as specimen sheets, re-weighted by the work filter
4. **More projects**: StuRequire as a compact row with `LOCAL ONLY`
5. **About**: two summary paragraphs with the portrait in a single bordered cell; scroll-scrubbed opacity highlight
6. **Experience**: Viswam.AI internship on the baseline timeline
7. **Skills**: glyph table, 5 groups
8. **Certifications + Education**: credential rows
9. **Contact + footer**: availability line, copy-email, links

Case studies: `/work/[slug]` for the four featured projects and StuRequire.

## 8. Do / don't

- Do let one thing be huge per viewport. Don't make two things compete at display size.
- Do use rules and shared-border cells. Don't use floating cards, shadows, rounded boxes or gradients.
- Do use the accent only for active state, focus and the primary action. Don't use it for decoration or section backgrounds.
- Do show real screenshots and real scores. Don't invent metrics, logos or testimonials.
- Don't show the phone number anywhere.

## 9. Phase 8 refinements (critique → clarify, layout, adapt, bolder, distill, polish)

- **No eyebrows or section numbers** above headings: each heading carries its own weight and states a fact ("Shipped for real clients and real users", "From requirements to deployment", "AI engineering at Viswam.AI").
- **Hero proof line** from `heroProof` in `content/site.ts`, verified against project data by `lib/content.test.ts`.
- **Work filter** in plain language: "Filter my work", slider "Show my work" (announced as "Web/Full-stack/AI work"), presets under "Jump to" (stacked rows on desktop), a mobile-only mirror of the role line, and "See N projects" jumping to Selected Work. The decorative vertical gauge was removed.
- **Matches tag**: while a filter or skill pin is active, matching work sheets show an accent-outlined "Matches · …" status label.
- **Sheet titles** use `.sheet-title` (wdth 100, clamp 2.25–3.75rem) so long project names fit a 2/5 column.
- **Email** uses `.email-display` (clamp 1.375–5rem) and breaks only after the local part.
- **Portrait** is a background-free cutout (`public/praneeth-cutout.webp`) on `ink-raised`; origin recorded in its `.json` sidecar.
- **Icons**: one drawn arrow (`components/ui/Arrow.tsx`, 1.5px stroke) replaces Unicode arrows.
- **Touch targets** ≥ 44px everywhere; `scroll-padding-top: 4.5rem` keeps focus clear of the fixed nav; scrollbar themed; numerals tabular in labels and readouts.
- **Availability** line in Contact: "Open to full-time roles and freelance projects." (confirmed by Praneeth).

