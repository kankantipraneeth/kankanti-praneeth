# MOTION.md — Praneeth Portfolio

Reads with DESIGN.md (the "Specimen" direction). Every animated element follows this file. When in doubt, don't animate.

## 1. Motion personality

**"Precise specimen": calm and sharp. Things arrive decisively, settle without bounce, then hold still so you can read them.**

On the tone matrix this is *calm × sharp* (between the Premium and Corporate presets). No overshoot, no bounce, no idle loops. The one expressive moment on the site is the **Role axis morphing the specimen glyph**. Everything else supports it.

## 2. Motion language (one of each)

| Property | Choice |
|---|---|
| Easing family | Decelerate into rest (`specimen-out`) for ~90% of moves |
| Base timing unit | **0.4s**. Durations are multiples: 0.2 · 0.4 · 0.8 · 1.2 |
| Transition family | Mask-reveal (lines rising out of a clip) + crossfade. No slides from off-screen, no spins, no scale pops |
| Stagger rhythm | Top-to-bottom, left-to-right, following reading order |
| Motion intensity | Travel ≤ 24px (mask reveals travel 100% of their own line height, inside the clip). Scale only 1.06 → 1 on images. Overshoot 0 |
| Hold discipline | ≥ 0.4s of stillness after a reveal before anything nearby moves |

### The three easing curves

Registered once with `CustomEase` in the GSAP setup module and used by name everywhere, including the Lenis `easing` function and CSS `--ease-*` tokens.

| Name | Curve | Use |
|---|---|---|
| `specimen-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances, reveals, landings, magnetic follow |
| `specimen-in` | `cubic-bezier(0.7, 0, 0.84, 0)` | Exits: loader leaving, role line out, nav hiding |
| `specimen-move` | `cubic-bezier(0.65, 0, 0.35, 1)` | Things that stay on screen and change: glyph axis morph, Flip reorder, anchor scroll, view-transition morph |

Scroll-scrubbed tweens use `ease: "none"`, because the scroll position is the easing. Lenis smooths the input. `linear` is never used for discrete events.

### Durations

| Token | Value | Use |
|---|---|---|
| `--dur-micro` | 0.2s | Hover, underline, arrow nudge, readout text swap, exits |
| `--dur-base` | 0.4s | Line reveals, row fades, axis morph per input step, nav show/hide |
| `--dur-large` | 0.8s | Image reveals, Flip reorder, case-study morph, anchor scroll |
| `--dur-hero` | 1.2s | Total loader sequence (hard cap 1.5s including exit) |

### Stagger values

| Group | Stagger | Cap on total |
|---|---|---|
| Masked text lines (hero name, headings) | 0.08s | 0.4s |
| Rows (experience bullets, credentials, more projects) | 0.05s | 0.6s |
| Glyph-table cells (skills) | 0.02s, `grid: "auto"`, `from: "start"` | 0.6s |
| About words (scrubbed) | distributed across scroll distance, `each` from progress | — |

## 3. Motion hierarchy

| Tier | Elements |
|---|---|
| **Hero (primary)** | The specimen glyph responding to the Role axis. The loader's single morph. |
| **Support (secondary)** | Masked heading reveals, the horizontal Selected Work track, the timeline line drawing, readout values updating, role line crossfade |
| **Texture (ambient)** | None. The page has no ambient loops. Stillness is the texture. |

One thing moves per viewport. If two compete, demote one to an instant state.

## 4. Per-section plan → GSAP feature

All GSAP code runs inside `useGSAP()` (from `@gsap/react`) with a `scope` ref, inside a `gsap.matchMedia()` block with conditions `{ desktop: "(min-width: 1024px)", motion: "(prefers-reduced-motion: no-preference)" }`. Hidden start states are only ever set by GSAP inside the `motion` branch, so without JS, or with reduced motion, all content is visible.

### 4.1 Loader (first visit per session)

- A tiny inline script in `<head>` sets `html[data-loader]` before first paint when `sessionStorage` has no `seen` flag and reduced motion is off. CSS only shows the overlay when that attribute exists, so there is no flash and no layout shift.
- Sequence (`gsap.timeline`):
  1. 0.0s: the overlay shows the Telugu glyph "ప్ర" at `wght 100, wdth 125`. A Martian Mono readout shows `wght 100 · wdth 125`.
  2. 0.0–0.8s: a proxy object `{wght, wdth}` tweens to `{800, 100}` with `specimen-move`; `onUpdate` writes `font-variation-settings` to the glyph (the approved exception) and the rounded numbers to the readout.
  3. 0.8–1.2s: the overlay fades out (`autoAlpha 0`, 0.4s, `specimen-in`). The hero name lines reveal at the same time (see 4.2).
- Skippable: any `keydown`, `pointerdown` or `wheel` calls `tl.progress(1)`. On complete: set the `seen` flag, remove `data-loader`, `tl.kill()`.
- Features: `gsap.timeline`, proxy tween + `onUpdate`, `autoAlpha`, `CustomEase`.

### 4.2 Hero

- **The hero text is the LCP element and is never hidden on first paint.** The name's line reveal only plays as the loader hands off, while the overlay still covers the hero: `SplitText.create(name, { type: "lines", mask: "lines", autoSplit: true, onSplit })` with lines `yPercent: 100 → 0`, 0.4s, stagger 0.08, `specimen-out`. On visits without the loader, the name is simply there.
- Role line, positioning sentence and CTAs: `autoAlpha 0 → 1`, `y 12 → 0`, 0.4s, starting 0.2s after the name (loader visits only).
- **Role axis (signature interaction):**
  - `<input type="range">` 0–100 plus Web / Full-stack / AI preset buttons.
  - On input, `gsap.quickTo` on a proxy `{wght, wdth}` (0.4s, `specimen-move`) interpolates between `Web (wdth 125, wght 300)` and `AI (wdth 75, wght 800)`. `onUpdate` writes `font-variation-settings` to the glyph and updates the readout text. Feature: `gsap.quickTo`, `gsap.utils.interpolate`, `gsap.utils.snap` (reduced motion).
  - The glyph's box is fixed-size with `contain: strict`, so the axis change never shifts layout.
  - The role line crossfades when the nearest named stop changes: out 0.2s `specimen-in` (`autoAlpha 0`, `y -8`), in 0.4s `specimen-out`. Feature: a short `gsap.timeline`, `overwrite: "auto"`.
  - Selected Work re-weights: `Flip.getState(sheets)` → reorder the DOM so matching projects come first → `Flip.from(state, { duration: 0.8, ease: "specimen-move", absolute: false })`. Non-matching sheets go to `opacity 0.45` (0.4s). Afterwards `ScrollTrigger.refresh()`. Flip only animates sheets in view; off-screen it applies instantly. Feature: `Flip` plugin.
- **No idle loop on the glyph.** It only moves when the visitor moves the axis.

### 4.3 About

- The two summary paragraphs: `SplitText` `type: "words"`. Words scrub from `opacity 0.25 → 1` as the section crosses the viewport (`scrollTrigger: { trigger, start: "top 75%", end: "bottom 55%", scrub: true }`, `stagger` spread over the timeline, `ease: "none"`). Words stay readable at 0.25, so nothing is ever unreadable.
- Portrait cell: the image goes `scale 1.06 → 1` and `autoAlpha 0 → 1`, 0.8s, `specimen-out`, once on enter (`start: "top 80%"`, `once: true`).
- Features: `SplitText`, `ScrollTrigger` scrub, `once`.

### 4.4 Selected work

- **Desktop ≥1024px:** pinned horizontal track. `gsap.to(track, { x: () => -(track.scrollWidth - window.innerWidth + margin), ease: "none", scrollTrigger: { trigger: section, pin: true, scrub: true, end: () => "+=" + distance, invalidateOnRefresh: true, anticipatePin: 1 } })`.
  - Each sheet's screenshot drifts `xPercent -6 → 0` using `containerAnimation` (support-tier parallax inside the image frame only; text never parallaxes).
  - The progress readout `01 / 04` updates in `onUpdate` (text swap, no tween).
- **Below 1024px:** no pin. Sheets stack vertically; each reveals once with `ScrollTrigger.batch` (`autoAlpha 0 → 1`, `y 24 → 0`, 0.4s, stagger 0.05).
- Features: `ScrollTrigger` pin + scrub, `containerAnimation`, `ScrollTrigger.batch`, `matchMedia` (pin only in the `desktop && motion` branch).

### 4.5 Case-study transition (`/work/[slug]`)

- The sheet screenshot morphs into the case-study hero image with the **View Transitions API** (React `<ViewTransition>` / Next's view-transition support, confirmed against the Next 16 docs in that phase). Shared name: `work-<slug>`. Duration 0.4s, `specimen-move` (via `::view-transition-group(*)` CSS). The rest of the page crossfades 0.2s.
- Back navigation reverses the morph.
- This is browser-native CSS, not a second animation library. GSAP is not used for the route change.
- Case-study page content: section labels and headings use the masked line reveal (0.4s, stagger 0.08) once on enter; gallery images `autoAlpha` + `scale 1.06 → 1` once.

### 4.6 Experience

- A vertical baseline rule draws with `scaleY 0 → 1` (`transform-origin: top`), scrubbed across the section (`start: "top 70%"`, `end: "bottom 60%"`, `scrub: true`).
- Month ticks and labels (`MAY 2025`, `JUN 2025`) `autoAlpha 0 → 1` as the line passes them (positioned on the same scrubbed timeline).
- The 3 bullets reveal as rows: `autoAlpha` + `y 12`, stagger 0.05, `once`.
- Features: `ScrollTrigger` scrub, timeline position parameter.

### 4.7 Skills (glyph table)

- Cells reveal once: `ScrollTrigger.batch` → `autoAlpha 0 → 1`, stagger `{ each: 0.02, grid: "auto", from: "start" }`, capped at 0.6s.
- **Pinning a skill** (click or Enter): the other cells go to `opacity 0.35` (0.2s). The pinned cell's highlight is a pseudo-element overlay fading in (opacity, not background-color). The "Used in: …" readout crossfades in (0.2s). Unpin reverses. Matching Selected Work sheets get the same `0.45` dim as the Role axis (shared helper).
- Features: `ScrollTrigger.batch`, simple `gsap.to` with `overwrite: "auto"`.

### 4.8 Certifications + education

- Rows reveal once: `autoAlpha` + `y 12`, stagger 0.05, `ScrollTrigger.batch`. Nothing else.

### 4.9 Contact + footer

- **Magnetic buttons** (email, LinkedIn, GitHub, Resume): on `pointermove` within the button's box, `gsap.quickTo(el, "x"|"y", { duration: 0.4, ease: "specimen-out" })` follows the pointer at 0.25× offset, max ±8px. On leave, return to 0 over 0.8s. Only when `(hover: hover) and (pointer: fine)` and motion is allowed.
- **Copy email:** click → `navigator.clipboard.writeText`. The readout swaps to `COPIED ✓` (crossfade 0.2s), holds 2s, then swaps back. An `aria-live="polite"` region announces it.
- Footer: static.

### 4.10 Global

- **Lenis** smooth scroll (desktop pointer devices; native on touch via the Lenis default `syncTouch: false`):
  `lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);` with `autoRaf: false`. Anchor links use `lenis.scrollTo(target, { offset: -navHeight, duration: 0.8, easing: specimenMove })`.
- **Nav:** hides on scroll down (`yPercent -100`, 0.4s, `specimen-in`), shows on scroll up (0.4s, `specimen-out`). The raised background after 24px is a pseudo-element opacity fade. Uses `ScrollTrigger.create({ onUpdate: self => self.direction })`.
- **Links/buttons:** underline `scaleX 0 → 1` from left (0.2s); arrow `x 0 → 4px` (0.2s). CSS transitions with `--ease-specimen-out`; no JS.
- **Focus rings:** never animated.

## 5. What must NOT animate

- Body text while it's being read: no loops, no typewriter, no scramble.
- The name after it has revealed; the CTAs' position (except the ±8px magnetic offset).
- Numbers: Lighthouse scores, dates and CGPA appear at their true value. No count-up.
- Layout properties: width, height, top/left, margin, padding, font-size, letter-spacing, line-height.
- `font-variation-settings` on anything except the hero/loader glyph.
- Colors directly (background-color, border-color, color). Use opacity on overlays or pseudo-elements instead.
- Section backgrounds, the hairline grid, the footer.
- No scroll-jacking or snapping. Lenis only smooths; the visitor controls position.
- No cursor followers, no parallax on text, no ambient particles or gradients.

## 6. prefers-reduced-motion

All motion setup lives in the `motion: "(prefers-reduced-motion: no-preference)"` branch of `gsap.matchMedia()`. Under `reduce`:

| Element | Reduced behaviour |
|---|---|
| Loader | Never shown (the head script checks the media query) |
| Lenis | Not started; native scroll; anchor links jump |
| Hero reveal | None; content is there at first paint |
| Role axis | Snaps between Web / Full-stack / AI (`gsap.utils.snap`); glyph axes set instantly with `gsap.set`; role line swaps without fade |
| Selected Work | No pin, no horizontal track, no Flip: sheets reorder instantly; dimming is instant |
| Scrubbed effects (About words, timeline line) | Final state: words fully opaque, line fully drawn |
| Reveals (batch, once) | None; everything visible |
| View transition | Disabled via `@media (prefers-reduced-motion: reduce) { ::view-transition-group(*) { animation: none } }` |
| Magnetic buttons, underline/arrow nudges | Off (CSS transitions wrapped in `no-preference`) |
| Copy-email feedback | Text swaps instantly; still announced |

## 7. Performance budget

- **Properties:** `transform` and `opacity` only (`x`, `y`, `xPercent`, `yPercent`, `scale`, `scaleX`, `scaleY`, `autoAlpha`). The single exception is `font-variation-settings` on the glyph inside its `contain: strict` box.
- **Frame rate:** 60fps on a mid-range Android phone. Test with 4× CPU throttling at 375px: no long tasks over 50ms during scroll; INP under 200ms on the Role slider (the input handler only calls `quickTo` and sets text).
- **Pinning:** one pinned section on the whole site (Selected Work), only at ≥1024px. **Never below 768px** (we are stricter: never below 1024px).
- **ScrollTriggers:** ≤ 12 on the home page. Use `ScrollTrigger.batch` instead of one trigger per element. `once: true` for every non-scrubbed reveal so triggers clean themselves up.
- **Cleanup:** every component uses `useGSAP` with `scope`; matchMedia and context revert on unmount. SplitText instances are created inside the context so they revert too. Lenis is destroyed and the ticker callback removed in the provider's cleanup.
- **`will-change`:** only on the horizontal track and the glyph, never on many elements.
- **LCP < 2.5s:** the hero text renders server-side and visible; animation never delays it. Fonts are preloaded through `next/font`, with `adjustFontFallback`.
- **CLS < 0.1:** the loader is `position: fixed`; the glyph box has fixed dimensions; SplitText uses `autoSplit` so lines re-split after fonts load without a visible jump.
- **JS:** GSAP core, ScrollTrigger, SplitText, Flip and CustomEase, plus Lenis (≈ 55 KB gzipped together), loaded only from `"use client"` components. Pages stay server components.

## 8. GSAP feature map (summary)

| Effect | GSAP feature |
|---|---|
| Easing vocabulary | `CustomEase.create("specimen-out" / "specimen-in" / "specimen-move")` |
| React lifecycle + cleanup | `useGSAP({ scope })`, `contextSafe` for event handlers |
| Responsive + reduced motion | `gsap.matchMedia()` with `desktop` / `motion` conditions |
| Loader morph | `gsap.timeline`, proxy tween with `onUpdate` |
| Name / heading reveals | `SplitText.create({ type: "lines", mask: "lines", autoSplit, onSplit })` |
| Role axis | `gsap.quickTo`, `gsap.utils.interpolate`, `gsap.utils.snap` |
| Work reorder | `Flip.getState` / `Flip.from` |
| Horizontal work track | `ScrollTrigger` `pin` + `scrub`, `containerAnimation`, `invalidateOnRefresh` |
| Group reveals | `ScrollTrigger.batch`, `stagger` (incl. `grid`) |
| About word highlight | `SplitText` words + scrubbed `ScrollTrigger` |
| Timeline line | scrubbed `scaleY` on a timeline with position parameters |
| Nav hide/show | `ScrollTrigger.create` + `self.direction` |
| Magnetic buttons | `gsap.quickTo` on `x` / `y` |
| Smooth scroll | Lenis + `gsap.ticker` + `ScrollTrigger.update` |
| Case-study morph | View Transitions API (CSS), not GSAP |
