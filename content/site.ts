// Single source of truth for all site copy. Taken from docs/resume.pdf.
// Rules: never invent facts or numbers. Anything missing is a string starting with "TODO".
// The phone number is deliberately excluded (it lives only in public/resume.pdf).

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
  githubUrl: string | Todo | null;
  featured: boolean;
  order: number;
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
  issuer: string;
  year: string | null;
  credentialUrl: string | Todo;
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
  photo: "TODO: add a portrait to public/ (e.g. public/praneeth.jpg)",
};

export const summary: [string, string] = [
  "I'm a full-stack developer who builds production websites and AI automations. I've delivered client projects end to end, from gathering requirements and building with Next.js and TypeScript to CMS and CRM integration, SEO and deployment.",
  "On the AI side I work with Python, LangChain, LLMs, MCP and n8n to build multi-agent systems and workflow automation, backed by an AI Engineering internship at Viswam.AI. I studied Computer Science (B.Tech, 2022–2026) in Hyderabad.",
];

export const experience: Experience[] = [
  {
    id: "viswam-ai",
    role: "AI Engineering Intern",
    company: "Viswam.AI",
    org: "Swecha Telangana",
    location: "Hyderabad",
    start: "2025-05",
    end: "2025-06",
    // TODO: rewrite as 2-3 concrete outcomes (what you built, for whom, what changed).
    bullets: [
      "Built AI-driven workflows using Python for automation and data processing.",
      "Performed data validation, cleaning and preprocessing.",
      "Assisted in developing and improving AI automation pipelines.",
      "Collaborated with teams to design scalable AI-based solutions.",
      "Documented workflows and supported deployment preparation.",
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
      "TODO: one number (Lighthouse score, number of products/pages, or enquiries captured).",
    ],
    liveUrl: "https://koshetty-jewellers.vercel.app",
    githubUrl: "TODO: GitHub repo link (or null if the client repo is private)",
    featured: true,
    order: 1,
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
      "TODO: one number (Lighthouse score, pages, or leads captured).",
    ],
    liveUrl: "https://sunshine-overseas.vercel.app",
    githubUrl: "TODO: GitHub repo link (or null if the client repo is private)",
    featured: true,
    order: 2,
  },
  {
    slug: "auto-eda-ai",
    title: "Auto-EDA AI",
    subtitle: "Automated data analysis platform",
    stack: ["Python", "Pandas", "Matplotlib", "Streamlit"],
    problem:
      "Exploratory data analysis is repetitive manual work: every new dataset needs cleaning, preprocessing, summary statistics and charts before any real analysis starts.",
    role: "TODO: solo or team project? Your role.",
    built: [
      "Developed an AI-powered exploratory data analysis platform.",
      "Automated dataset cleaning and preprocessing workflows.",
      "Generated statistical summaries and visual insights.",
      "Deployed a live web application using Streamlit.",
    ],
    results: [
      "Live web app on Streamlit.",
      "Reduces manual analysis effort through automation.",
      "TODO: one number (e.g. time from upload to report, dataset sizes handled).",
    ],
    liveUrl: "https://auto-eda-ai-assisted.streamlit.app",
    githubUrl: "TODO: GitHub repo link",
    featured: true,
    order: 3,
  },
  {
    slug: "whatsapp-automation-bot",
    title: "AI-Powered WhatsApp Automation Bot",
    subtitle: "Automation project",
    stack: ["n8n", "REST APIs", "AI Automation"],
    problem: "TODO: who used the bot and what problem it solved (e.g. answering enquiries, booking, notifications).",
    role: "TODO: solo or team project? Your role.",
    built: [
      "Built workflow automation systems using n8n.",
      "Integrated APIs for automated messaging.",
      "Designed intelligent response workflows.",
      "Implemented real-time communication automation.",
    ],
    results: [
      "TODO: one number (messages handled, response time, workflows automated).",
      "TODO: 20-40s demo video/GIF of the bot in action.",
    ],
    liveUrl: null,
    githubUrl: "TODO: GitHub repo link (or exported n8n workflow)",
    featured: true,
    order: 4,
  },
  {
    slug: "sturequire",
    title: "StuRequire",
    subtitle: "Student requirement tracking system",
    stack: ["Node.js", "Express.js", "SQL"],
    problem: "TODO: one line on what student requirements it tracks and for whom.",
    role: "TODO: solo or team project? Your role.",
    built: [
      "Developed a full-stack web application.",
      "Implemented authentication and validation.",
      "Built REST APIs for data management.",
      "Designed structured database workflows.",
    ],
    results: ["TODO: one outcome or number."],
    liveUrl: null,
    githubUrl: "TODO: GitHub repo link",
    featured: false,
    order: 5,
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
  { name: "OCI AI Foundations Associate", issuer: "Oracle Cloud Infrastructure", year: "2025", credentialUrl: "TODO: credential link" },
  { name: "Azure AI Engineer Associate", issuer: "Microsoft Azure", year: null, credentialUrl: "TODO: credential link" },
  { name: "Machine Learning Foundations", issuer: "AWS Academy", year: null, credentialUrl: "TODO: credential link" },
  { name: "Cloud Foundations", issuer: "AWS Academy", year: null, credentialUrl: "TODO: credential link" },
  { name: "Data Science", issuer: "Wipro TalentNext", year: null, credentialUrl: "TODO: credential link" },
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
