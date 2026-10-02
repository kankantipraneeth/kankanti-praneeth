import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getProject, profile, projects } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Case study by Kankanti Praneeth";

// Pre-render one image per project at build time; any other slug is a 404 (never a generic "Project" card).
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0D0C0A", color: "#F2F0EA", padding: 72 }}>
        <div style={{ fontSize: 24, letterSpacing: 4, color: "#A7A49E" }}>{`${profile.name.toUpperCase()} · CASE STUDY`}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 92, fontWeight: 700, lineHeight: 1 }}>{project.title}</div>
          <div style={{ fontSize: 34, color: "#A7A49E" }}>{project.subtitle}</div>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ background: "#F8CC2F", color: "#130F06", fontSize: 26, padding: "10px 18px" }}>{project.stack.slice(0, 3).join(" · ")}</div>
        </div>
      </div>
    ),
    size,
  );
}
