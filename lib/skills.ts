import type { Project, SkillGroup } from "@/content/site";

export function projectSlugsForSkill(skill: string, groups: SkillGroup[]): string[] {
  for (const group of groups) {
    const match = group.skills.find((s) => s.name === skill);
    if (match) return [...match.usedIn];
  }
  return [];
}

export function projectsUsingSkill(skill: string, groups: SkillGroup[], projects: Project[]): Project[] {
  const slugs = new Set(projectSlugsForSkill(skill, groups));
  return projects.filter((p) => slugs.has(p.slug)).sort((a, b) => a.order - b.order);
}
