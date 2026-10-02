// Single source of truth for all site copy. Taken from docs/resume.pdf.
// Rules: never invent facts or numbers. Anything missing is a string starting with "TODO".
// The phone number is deliberately excluded (it lives only in public/resume.pdf).

import type { RoleStop } from "@/lib/specimen";

/** Marker for data that still has to be filled in by Praneeth. */
export type Todo = `TODO${string}`;

export type Profile = {
  name: string;
  role: string;
  positioning: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  resumeUrl: string;
  photo: string | Todo;
  /** Confirmed by Praneeth (Phase 8). */
  availability: string;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  org: string;
  location: string;
  start: string; // YYYY-MM
  end: string; // YYYY-MM
  bullets: string[];
};

export type ProjectImage = { src: string; width: number; height: number; alt: string };

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  stack: string[];
  problem: string | Todo;
  role: string | Todo;
  built: string[];
  results: (string | Todo)[];
  liveUrl: string | null;
  githubUrl: string | null;
  /** Real Lighthouse runs against liveUrl. Raw reports are in docs/lighthouse/. */
  lighthouse?: Lighthouse;
  /** Genuine screenshots or recordings only. Paths are relative to public/. */
  gallery: { src: string; alt: string }[];
  featured: boolean;
  order: number;
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
};

export type LighthouseScores = {
  performance: number;
  accessibility: number;
  bestPractices: number;
  /** Omitted when the score reflects hosting config rather than the site's SEO work. */
  seo?: number;
};

export type Lighthouse = {
  measured: string; // YYYY-MM-DD
  tool: string;
  mobile: LighthouseScores;
  desktop: LighthouseScores;
};

export type SkillGroupName =
  | "AI & Agents"
  | "Frontend"
  | "Backend"
  | "CMS/CRM & SEO"
  | "Data & Tools";

export type Skill = {
  name: string;
  /** Project slugs where this skill was used. Empty means no resume project shows it yet. */
  usedIn: string[];
};

export type SkillGroup = {
  name: SkillGroupName;
  skills: Skill[];
};

export type Certification = {
  name: string;
  /** What kind of credential it is, so nothing reads as more than it is. */
  kind: "Certification" | "Course completion" | "Certificate of proficiency";
  issuer: string;
  issued: string; // YYYY-MM-DD, or YYYY-MM for a period that ended that month
  credentialId: string | null;
  /** Public verification page. null when the issuer has no public link. */
  verifyUrl: string | null;
};

export type Education = {
  degree: string;
  institution: string;
  start: string;
  end: string;
  cgpa: string;
  coursework: string[];
};

export const profile: Profile = {
  name: "Kankanti Praneeth",
  role: "Generative AI Engineer & Software Engineer",
  positioning: "Full-stack developer who builds production websites and AI automations",
  location: "Hyderabad, Telangana",
  email: "kankantipraneeth@gmail.com",
  linkedin: "https://www.linkedin.com/in/praneeth-kankanti-148317258",
  github: "https://github.com/kankantipraneeth",
  resumeUrl: "/resume.pdf",
  photo: "/praneeth.webp",
  availability: "Open to full-time roles and freelance projects.",
};

export const summary: [string, string] = [
  "I'm a full-stack developer who builds production websites and AI automations. I've delivered client projects end to end, from gathering requirements and building with Next.js and TypeScript to CMS and CRM integration, SEO and deployment.",
  "On the AI side I work with Python, LangChain, LLMs, MCP and n8n to build multi-agent systems and workflow automation, backed by an AI Engineering internship at Viswam.AI. I studied Computer Science (B.Tech, 2022–2026) in Hyderabad.",
];

/** Proof line in the hero. Every claim is checked against `projects` in lib/content.test.ts. */
export const heroProof = ["2 live client sites", "Sanity CMS + HubSpot CRM", "Lighthouse accessibility 100 on mobile"];

/** Role line under the name, one true statement per stop of the Web ⟷ AI axis. */
export const roleLines: Record<RoleStop, string> = {
  web: "I build production websites: Next.js front ends with Sanity CMS, HubSpot CRM, SEO and deployment.",
  fullstack: "I build production websites and AI automations, from requirements to deployment.",
  ai: "I build AI automations: n8n workflows that connect an LLM to WhatsApp, and an AI-powered data analysis platform.",
};

export const experience: Experience[] = [
  {
    id: "viswam-ai",
    role: "AI Engineering Intern",
    company: "Viswam.AI",
    org: "Swecha Telangana",
    location: "Hyderabad",
    start: "2025-05",
    end: "2025-06",
    // Rewritten from the resume bullets only. No metrics exist for this work, so none are claimed.
    bullets: [
      "Built Python workflows that automate data validation, cleaning and preprocessing, giving the team's AI automation pipelines clean, consistent input data.",
      "Worked with the team to develop and improve those AI automation pipelines and design AI-based solutions built to scale.",
      "Documented the workflows and supported deployment preparation, so the pipelines could be handed over and deployed.",
    ],
  },
];

export const projects: Project[] = [
  {
    slug: "koshetty-jewellers",
    title: "Koshetty Jewellers",
    subtitle: "Jewellery catalogue & enquiry platform",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Sanity CMS", "HubSpot", "next-intl", "GA4", "Vercel"],
    problem:
      "A jewellery store needed a mobile-first catalogue to showcase its collections, product details and certifications, capture enquiries, and let the owner update products without a developer.",
    role: "Client project, delivered end to end: requirements gathered directly from the client, design, development, CMS/CRM integration, SEO and deployment.",
    built: [
      "Built and deployed a mobile-first catalogue website to showcase collections, product details and certifications.",
      "Designed a Sanity CMS schema so the client can add products, images and descriptions without code changes.",
      "Added English/Telugu support, WhatsApp product enquiries, enquiry forms with HubSpot CRM lead capture, Google Maps and GA4 event tracking.",
      "Implemented SEO (Open Graph, hreflang, structured data), optimized images and an accessible responsive UI.",
      "Used AI-assisted workflows (Claude Code, MCP) to speed up delivery.",
    ],
    results: [
      "Live in production; the client manages products, images and descriptions without code changes.",
      "Bilingual site (English and Telugu).",
      "Enquiries are captured as leads in HubSpot CRM.",
      "Lighthouse accessibility 100 on mobile; performance 99 on desktop.",
    ],
    liveUrl: "https://koshetty-jewellers.vercel.app",
    lighthouse: {
      measured: "2026-10-02",
      tool: "Lighthouse 12",
      // SEO left out: the vercel.app domain sets noindex + robots.txt "Disallow: /", which drops the score to 69.
      mobile: { performance: 87, accessibility: 100, bestPractices: 100 },
      desktop: { performance: 99, accessibility: 99, bestPractices: 100 },
    },
    // Private repository. Never link it.
    githubUrl: null,
    gallery: [],
    featured: true,
    order: 1,
    track: "web",
    deployment: "live",
    repo: "private-client",
    image: { src: "/work/koshetty-jewellers.webp", width: 1440, height: 900, alt: "Koshetty Jewellers home page" },
  },
  {
    slug: "sunshine-overseas",
    title: "Sunshine Overseas",
    subtitle: "Client lead-generation web platform",
    stack: ["Next.js 14", "TypeScript", "Tailwind CSS", "Sanity CMS", "HubSpot", "Vercel"],
    problem:
      "An overseas education consultancy needed a lead-generation website that routes enquiries into its CRM and lets the team update content without code changes.",
    role: "Client project, delivered end to end: development, CMS/CRM integration, SEO and deployment.",
    built: [
      "Built and deployed a lead-generation website for an overseas education consultancy.",
      "Developed API routes to capture enquiry forms and integrated HubSpot CRM for lead management.",
      "Integrated Sanity CMS to enable dynamic content updates without code changes.",
      "Implemented form validation, SEO optimization and reusable UI components for performance and maintainability.",
    ],
    results: [
      "Live in production; enquiries flow into HubSpot CRM as leads.",
      "Content is editable by the client through Sanity CMS.",
      "Lighthouse accessibility 100 and SEO 100 on mobile and desktop; performance 99 on desktop.",
    ],
    liveUrl: "https://sunshine-overseas.vercel.app",
    lighthouse: {
      measured: "2026-10-02",
      tool: "Lighthouse 12",
      mobile: { performance: 90, accessibility: 100, bestPractices: 96, seo: 100 },
      desktop: { performance: 99, accessibility: 100, bestPractices: 96, seo: 100 },
    },
    // Client-owned private repository. Never link it.
    githubUrl: null,
    gallery: [],
    featured: true,
    order: 2,
    track: "web",
    deployment: "live",
    repo: "private-client",
    image: { src: "/work/sunshine-overseas.webp", width: 1440, height: 900, alt: "Sunshine Overseas home page" },
  },
  {
    slug: "auto-eda-ai",
    title: "Auto-EDA AI",
    subtitle: "Automated data analysis platform",
    stack: ["Python", "Pandas", "Matplotlib", "Streamlit"],
    problem:
      "Exploratory data analysis is repetitive manual work: every new dataset needs cleaning, preprocessing, summary statistics and charts before any real analysis starts.",
    role: "Solo project: designed, built and deployed the whole platform, from data cleaning and analysis to the Streamlit app.",
    built: [
      "Developed an AI-powered exploratory data analysis platform.",
      "Automated dataset cleaning and preprocessing workflows.",
      "Generated statistical summaries and visual insights.",
      "Deployed a live web application using Streamlit.",
    ],
    results: [
      "Live web app on Streamlit.",
      "Reduces manual analysis effort through automation.",
    ],
    liveUrl: "https://auto-eda-ai-assisted.streamlit.app",
    githubUrl: "https://github.com/kankantipraneeth/auto-eda-ai",
    gallery: [],
    featured: true,
    order: 3,
    track: "ai",
    deployment: "live",
    repo: "public",
    image: { src: "/work/auto-eda-ai.webp", width: 1440, height: 900, alt: "Auto-EDA AI Streamlit app" },
  },
  {
    slug: "whatsapp-automation-bot",
    title: "AI-Powered WhatsApp Automation Bot",
    subtitle: "Automation project",
    stack: ["n8n", "LLM", "WhatsApp", "REST APIs"],
    problem:
      "A client was answering repetitive WhatsApp queries by hand. Every reply needed a person, even for questions that had been answered many times before.",
    role: "Built the n8n automation workflow: connected incoming client queries to an LLM, configured the n8n nodes and workflow logic, and implemented the automated response flow.",
    built: [
      "Built an n8n workflow that receives client queries from WhatsApp in real time.",
      "Connected the workflow to an LLM through API nodes to process each query and generate a reply.",
      "Configured the node logic that routes each query and sends the generated response back to the client on WhatsApp.",
    ],
    results: ["Client queries on WhatsApp are answered automatically by the LLM instead of manually."],
    liveUrl: null,
    githubUrl: null,
    // No genuine screen recording exists yet, so there is no demo.
    gallery: [],
    featured: true,
    order: 4,
    track: "ai",
    deployment: "private",
    repo: "none",
    image: null,
    flow: ["Client query on WhatsApp", "n8n workflow", "LLM", "Automated reply"],
  },
  {
    slug: "sturequire",
    title: "StuRequire",
    subtitle: "Student task & reminder web app",
    stack: ["Node.js", "Express.js", "SQL"],
    problem: "Students forget daily tasks and assignments. StuRequire lets them add tasks and sends a daily reminder to complete them.",
    role: "Built the application with Node.js and Express: task management for students and daily reminders.",
    built: [
      "Developed a full-stack web application where students add and track their tasks.",
      "Implemented daily reminders for pending tasks.",
      "Implemented authentication and validation.",
      "Built REST APIs and structured database workflows for data management.",
    ],
    results: ["Runs locally; not deployed."],
    liveUrl: null,
    // Source lives only on Praneeth's machine. Never add a repo link here.
    githubUrl: null,
    // Real screenshots from June 2024 (browser chrome cropped). The task/reminder screens were not captured.
    gallery: [
      { src: "/work/sturequire/home.webp", alt: "StuRequire home page with the student portal's feature list" },
      { src: "/work/sturequire/login.webp", alt: "StuRequire sign-in page with email, password and Google sign-in" },
      { src: "/work/sturequire/register.webp", alt: "StuRequire registration form with year, branch and section fields" },
    ],
    featured: false,
    order: 5,
    track: "web",
    deployment: "local",
    repo: "none",
    image: { src: "/work/sturequire/home.webp", width: 1266, height: 617, alt: "StuRequire home page with the student portal's feature list" },
  },
];

export const skills: SkillGroup[] = [
  {
    name: "AI & Agents",
    skills: [
      { name: "LLMs", usedIn: [] },
      { name: "LangChain", usedIn: [] },
      { name: "AI Agents", usedIn: [] },
      { name: "Prompt Engineering", usedIn: [] },
      { name: "MCP", usedIn: ["koshetty-jewellers"] },
      { name: "n8n", usedIn: ["whatsapp-automation-bot"] },
    ],
  },
  {
    name: "Frontend",
    skills: [
      { name: "Next.js", usedIn: ["koshetty-jewellers", "sunshine-overseas"] },
      { name: "React.js", usedIn: ["koshetty-jewellers", "sunshine-overseas"] },
      { name: "TypeScript", usedIn: ["koshetty-jewellers", "sunshine-overseas"] },
      { name: "Tailwind CSS", usedIn: ["koshetty-jewellers", "sunshine-overseas"] },
      { name: "HTML", usedIn: ["koshetty-jewellers", "sunshine-overseas"] },
      { name: "CSS", usedIn: ["koshetty-jewellers", "sunshine-overseas"] },
    ],
  },
  {
    name: "Backend",
    skills: [
      { name: "Node.js", usedIn: ["sturequire"] },
      { name: "Express.js", usedIn: ["sturequire"] },
      { name: "REST APIs", usedIn: ["sunshine-overseas", "whatsapp-automation-bot", "sturequire"] },
      { name: "SQL", usedIn: ["sturequire"] },
      { name: "MySQL", usedIn: [] },
      { name: "SQL Server", usedIn: [] },
    ],
  },
  {
    name: "CMS/CRM & SEO",
    skills: [
      { name: "Sanity CMS", usedIn: ["koshetty-jewellers", "sunshine-overseas"] },
      { name: "Headless CMS", usedIn: ["koshetty-jewellers", "sunshine-overseas"] },
      { name: "HubSpot", usedIn: ["koshetty-jewellers", "sunshine-overseas"] },
      { name: "SEO", usedIn: ["koshetty-jewellers", "sunshine-overseas"] },
      { name: "GA4", usedIn: ["koshetty-jewellers"] },
    ],
  },
  {
    name: "Data & Tools",
    skills: [
      { name: "Python", usedIn: ["auto-eda-ai"] },
      { name: "Pandas", usedIn: ["auto-eda-ai"] },
      { name: "Matplotlib", usedIn: ["auto-eda-ai"] },
      { name: "Streamlit", usedIn: ["auto-eda-ai"] },
      { name: "Git", usedIn: [] },
      { name: "GitHub", usedIn: [] },
      { name: "Vercel", usedIn: ["koshetty-jewellers", "sunshine-overseas"] },
      { name: "Postman", usedIn: [] },
      { name: "Linux", usedIn: [] },
    ],
  },
];

export const certifications: Certification[] = [
  // Details copied from the certificate PDFs.
  {
    name: "OCI 2025 Certified AI Foundations Associate",
    kind: "Certification",
    issuer: "Oracle University",
    issued: "2025-10-29",
    credentialId: "323394931OCI25AICFA",
    verifyUrl: null, // TODO: paste the Oracle CertView / Credly share link if you have one
  },
  {
    name: "Microsoft Azure AI Engineer Associate",
    kind: "Certificate of proficiency",
    issuer: "ICT Academy (in association with Microsoft), Grade A",
    issued: "2025-03-06",
    credentialId: "S25-36458",
    verifyUrl: "https://verify.ictacademy.in",
  },
  {
    name: "AWS Academy Machine Learning Foundations",
    kind: "Course completion",
    issuer: "AWS Academy",
    issued: "2023-10-25",
    credentialId: null,
    verifyUrl: "https://www.credly.com/go/ykbyds04",
  },
  {
    name: "AWS Academy Cloud Foundations",
    kind: "Course completion",
    issuer: "AWS Academy",
    issued: "2023-10-25",
    credentialId: null,
    verifyUrl: "https://www.credly.com/go/kWiPtD7j",
  },
  {
    name: "Data Science (Digital Skills Readiness Program)",
    kind: "Course completion",
    issuer: "Wipro TalentNext",
    issued: "2025-10",
    credentialId: "TNext_SE_25_DS_252460229",
    verifyUrl: null,
  },
];

export const education: Education[] = [
  {
    degree: "B.Tech, Computer Science & Engineering",
    institution: "Vignana Bharathi Institute of Technology",
    start: "2022",
    end: "2026",
    cgpa: "7.83 / 10",
    coursework: ["Data Structures", "Database Management Systems", "Software Engineering", "Statistics"],
  },
];

export const isTodo = (value: unknown): value is Todo =>
  typeof value === "string" && value.startsWith("TODO");

export const featuredProjects = projects
  .filter((p) => p.featured)
  .sort((a, b) => a.order - b.order);

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
