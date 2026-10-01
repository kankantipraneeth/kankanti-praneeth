@AGENTS.md

# Praneeth Portfolio

## Goal
Premium, animated personal portfolio that proves to recruiters I ship production websites and AI features.

## Source of truth
- Resume: docs/resume.pdf. Content lives in content/site.ts.
- Never invent facts, metrics or clients. Mark missing data as TODO.
- Do not publish my phone number.
- Design rules: DESIGN.md. Motion rules: MOTION.md. Task list: PLAN.md.

## Stack
Next.js App Router, TypeScript, Tailwind v4, GSAP (@gsap/react useGSAP, ScrollTrigger, SplitText), Lenis. No other animation library.

## Code rules
- Pages are server components. Animation code only in small "use client" components.
- Animate transform and opacity only. Clean up every ScrollTrigger.
- Respect prefers-reduced-motion. No pinning below 768px.
- Use next/image and next/font. Keep JS per route small.

## Working rules
- Work on one PLAN.md task at a time. Stop and summarise after each task.
- Do not rewrite files outside the current task.

## Browser testing (token budget)
- Use playwright-cli only. Never Playwright MCP or Claude in Chrome.
- Headless by default. Check console errors and the accessibility snapshot first.
- Screenshots only for failures, or when I ask, at 375px and 1440px.
