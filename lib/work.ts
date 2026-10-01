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
