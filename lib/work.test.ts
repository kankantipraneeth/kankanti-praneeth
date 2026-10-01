import { describe, expect, it } from "vitest";
import { getProject, projects, skills } from "@/content/site";
import { isEmphasized, nextProject, projectLinks, statusMarks } from "./work";

const p = (slug: string) => {
  const project = getProject(slug);
  if (!project) throw new Error(`missing ${slug}`);
  return project;
};

describe("emphasis", () => {
  it("emphasises everything at full-stack", () => {
    expect(projects.every((x) => isEmphasized(x, "fullstack", null, skills))).toBe(true);
  });

  it("emphasises only the matching track at the ends", () => {
    expect(isEmphasized(p("auto-eda-ai"), "ai", null, skills)).toBe(true);
    expect(isEmphasized(p("koshetty-jewellers"), "ai", null, skills)).toBe(false);
    expect(isEmphasized(p("koshetty-jewellers"), "web", null, skills)).toBe(true);
  });

  it("lets a pinned skill override the axis", () => {
    expect(isEmphasized(p("whatsapp-automation-bot"), "web", "n8n", skills)).toBe(true);
    expect(isEmphasized(p("auto-eda-ai"), "ai", "n8n", skills)).toBe(false);
  });
});

describe("honest labels and links", () => {
  it("labels deployment and repo truthfully", () => {
    expect(statusMarks(p("koshetty-jewellers"))).toEqual(["LIVE", "PRIVATE CLIENT REPO"]);
    expect(statusMarks(p("auto-eda-ai"))).toEqual(["LIVE", "PUBLIC REPO"]);
    expect(statusMarks(p("whatsapp-automation-bot"))).toEqual(["NO PUBLIC DEMO", "NO PUBLIC REPO"]);
    expect(statusMarks(p("sturequire"))).toEqual(["LOCAL ONLY", "NO PUBLIC REPO"]);
  });

  it("only links what exists", () => {
    expect(projectLinks(p("whatsapp-automation-bot"))).toEqual([
      { label: "Case study", href: "/work/whatsapp-automation-bot", external: false },
    ]);
    expect(projectLinks(p("auto-eda-ai")).map((l) => l.label)).toEqual(["Case study", "Live site", "GitHub"]);
    expect(projectLinks(p("sunshine-overseas")).map((l) => l.label)).toEqual(["Case study", "Live site"]);
  });

  it("cycles to the next project by order", () => {
    expect(nextProject("koshetty-jewellers", projects).slug).toBe("sunshine-overseas");
    expect(nextProject("sturequire", projects).slug).toBe("koshetty-jewellers");
  });
});
