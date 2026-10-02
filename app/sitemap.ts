import type { MetadataRoute } from "next";
import { projects } from "@/content/site";
import { SITE_URL } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    ...projects
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((project) => ({ url: `${SITE_URL}/work/${project.slug}`, lastModified, changeFrequency: "yearly" as const, priority: project.featured ? 0.8 : 0.5 })),
  ];
}
