import { describe, expect, it } from "vitest";
import { projects, skills } from "@/content/site";
import { projectSlugsForSkill, projectsUsingSkill } from "./skills";

describe("skills → projects", () => {
  it("returns the slugs a skill was used in", () => {
    expect(projectSlugsForSkill("n8n", skills)).toEqual(["whatsapp-automation-bot"]);
  });

  it("returns [] for unknown or unused skills", () => {
    expect(projectSlugsForSkill("COBOL", skills)).toEqual([]);
    expect(projectSlugsForSkill("LangChain", skills)).toEqual([]);
  });

  it("returns full projects in site order", () => {
    expect(projectsUsingSkill("REST APIs", skills, projects).map((p) => p.slug)).toEqual([
      "sunshine-overseas",
      "whatsapp-automation-bot",
      "sturequire",
    ]);
  });
});
