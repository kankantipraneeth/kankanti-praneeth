# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally:

- **Recruiters and hiring managers** screening early-career candidates for full-stack, frontend or GenAI roles. They arrive from a resume, LinkedIn or GitHub link, skim in under a minute, and need proof the candidate has shipped real work. Their job: decide whether to shortlist and where to find the resume.
- **Freelance clients** (small businesses like the existing jewellery and education-consultancy clients) who need a website, lead capture or an automation. Their job: judge whether Praneeth can deliver a working, editable, findable site, and how to get in touch.

## Product Purpose

Personal portfolio for Kankanti Praneeth that proves Praneeth ships production websites and AI features. Success: a recruiter downloads the resume or reaches out; a prospective client sends an enquiry.

## Positioning

Full-stack developer who builds production websites and AI automations. What sets Praneeth apart from typical 2026 freshers: two live client websites delivered end to end (requirements → Next.js build → Sanity CMS / HubSpot CRM → SEO → deploy), plus working AI automation (n8n + LLM WhatsApp bot, Auto-EDA platform). Headline role: "Generative AI Engineer & Software Engineer".

## Operating Context

- Visitors land on the home page from resume/LinkedIn/GitHub links, often on mobile.
- Two calls to action carry equal weight: "Download resume" (`/resume.pdf`, the only place the phone number appears) and contact by email/LinkedIn/GitHub.
- Case-study pages per project at `/work/[slug]`.
- Optional "Ask about Praneeth" AI chat answering only from site content (later phase).

## Capabilities and Constraints

- Stack: Next.js 16 App Router, TypeScript, Tailwind v4, GSAP (useGSAP, ScrollTrigger, SplitText), Lenis. No other animation library. Deploy on Vercel.
- All copy comes from `content/site.ts`. Never invent facts, metrics, clients or testimonials.
- Phone number never shown on the site.
- Private repos (Koshetty Jewellers, Sunshine Overseas, WhatsApp bot, StuRequire) are never linked. Only Auto-EDA AI has a public repo.
- Performance targets: Lighthouse performance ≥ 90, accessibility 100, LCP < 2.5s, CLS < 0.1.

## Brand Commitments

- Name: Kankanti Praneeth. Based in Hyderabad, Telangana.
- Voice: first person, plain and specific; claims backed by shipped work.
- Portrait (`public/praneeth.webp`) appears in the About section only, not the hero.

## Evidence on Hand

- Live client sites: koshetty-jewellers.vercel.app, sunshine-overseas.vercel.app. Live app: auto-eda-ai-assisted.streamlit.app.
- Real Lighthouse runs (2026-10-02, raw in `docs/lighthouse/`): Sunshine mobile perf 90 / a11y 100 / SEO 100; Koshetty mobile perf 87 / a11y 100; both desktop perf 99.
- StuRequire screenshots (June 2024) in `public/work/sturequire/`.
- Certificates with verification links (AWS Academy via Credly, ICT Academy) in `content/site.ts`.
- Absent, must not be fabricated: WhatsApp bot demo recording, StuRequire task/reminder screens, client testimonials, traffic or lead counts.

## Product Principles

1. Proof before claims: every skill points to a project that used it.
2. Shipped work leads; credentials support.
3. Serve both audiences in one pass: resume and contact are always one step away.
4. Honest labels: course completions are not called certifications; private work is not linked.

## Accessibility & Inclusion

WCAG 2.2 AA; Lighthouse accessibility 100. Full keyboard navigation and a complete `prefers-reduced-motion` fallback for all animation.
