import type { Education, Profile, Project, SkillGroup } from "@/content/site";

// Schema.org JSON-LD built only from content/site.ts. Never add a telephone field (PRODUCT.md: phone stays off the site).

export function personJsonLd(profile: Profile, education: Education[], skills: SkillGroup[], siteUrl: string) {
  const [locality, region] = profile.location.split(",").map((part) => part.trim());
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    description: "Full-stack developer who builds production websites and AI automations.",
    url: `${siteUrl}/`,
    image: `${siteUrl}${profile.photo}`,
    email: `mailto:${profile.email}`,
    address: { "@type": "PostalAddress", addressLocality: locality, addressRegion: region, addressCountry: "IN" },
    sameAs: [profile.linkedin, profile.github],
    alumniOf: education.map((item) => ({ "@type": "CollegeOrUniversity", name: item.institution })),
    knowsAbout: skills.flatMap((group) => group.skills.map((skill) => skill.name)),
  };
}

export function caseStudyJsonLd(project: Project, profile: Profile, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: `${project.title}: ${project.subtitle}`,
    description: project.problem,
    url: `${siteUrl}/work/${project.slug}`,
    ...(project.image ? { image: `${siteUrl}${project.image.src}` } : {}),
    creator: { "@type": "Person", name: profile.name, url: `${siteUrl}/` },
    keywords: project.stack.join(", "),
    ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
  };
}

/** Serialises JSON-LD for a <script> tag, escaping "<" so content can never close the tag (Next.js JSON-LD guide). */
export const jsonLdScript = (data: object): string => JSON.stringify(data).replace(/</g, "\\u003c");
