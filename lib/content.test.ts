import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import * as site from "@/content/site";

const { projects, skills, certifications } = site;

const PHONE_DIGITS = "6305538759";
const digitsOnly = (text: string) => text.replace(/\D/g, "");

/** Every source file the site renders copy from. */
function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx|css)$/.test(name) && !name.endsWith(".test.ts") ? [path] : [];
  });
}

describe("content integrity", () => {
  it("never contains the phone number, in any formatting", () => {
    const text = JSON.stringify(site);
    expect(digitsOnly(text)).not.toContain(PHONE_DIGITS);
    expect(text).not.toMatch(/\+91/);
  });

  it("never hard-codes the phone number in rendered source", () => {
    for (const file of ["app", "components", "content"].flatMap(sourceFiles)) {
      expect(digitsOnly(readFileSync(file, "utf8")), file).not.toContain(PHONE_DIGITS);
    }
  });

  it("runs these checks before every production build", () => {
    const { scripts } = JSON.parse(readFileSync("package.json", "utf8")) as { scripts: Record<string, string> };
    expect(scripts.prebuild ?? "").toContain("vitest run lib/content.test.ts");
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
