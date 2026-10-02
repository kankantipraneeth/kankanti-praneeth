import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import * as site from "@/content/site";

const { projects, skills, certifications } = site;

describe("content integrity", () => {
  it("never contains the phone number", () => {
    const text = JSON.stringify(site);
    expect(text).not.toMatch(/6305\s?538\s?759/);
    expect(text).not.toMatch(/\+91/);
  });

  it("has no TODO left in project copy", () => {
    expect(JSON.stringify(projects)).not.toContain("TODO");
  });

  it("keeps repo flags consistent with links", () => {
    for (const project of projects) {
      expect(project.repo === "public", project.slug).toBe(project.githubUrl !== null);
      expect(project.deployment === "live", project.slug).toBe(project.liveUrl !== null);
    }
  });

  it("only references real projects from skills", () => {
    const slugs = new Set(projects.map((p) => p.slug));
    for (const group of skills) for (const skill of group.skills) for (const slug of skill.usedIn) expect(slugs.has(slug), `${skill.name} → ${slug}`).toBe(true);
  });

  it("has unique skill names and slugs", () => {
    const names = skills.flatMap((g) => g.skills.map((s) => s.name));
    expect(new Set(names).size).toBe(names.length);
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
  });

  it("has four featured projects ordered 1-4", () => {
    expect(site.featuredProjects.map((p) => p.order)).toEqual([1, 2, 3, 4]);
  });

  it("gives every certificate a way to verify it", () => {
    for (const cert of certifications) expect(cert.verifyUrl !== null || cert.credentialId !== null, cert.name).toBe(true);
  });

  it("only points at screenshots that exist in public/", () => {
    for (const project of projects) {
      if (project.image) expect(existsSync(`public${project.image.src}`), project.image.src).toBe(true);
      for (const shot of project.gallery) expect(existsSync(`public${shot.src}`), shot.src).toBe(true);
    }
  });

  it("has a flow panel for every project without an image", () => {
    for (const project of projects) if (project.image === null) expect(project.flow?.length, project.slug).toBeGreaterThan(0);
  });
});
