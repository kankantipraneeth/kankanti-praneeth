import { describe, expect, it } from "vitest";
import { education, getProject, profile, skills } from "@/content/site";
import { caseStudyJsonLd, jsonLdScript, personJsonLd } from "./structured-data";

const SITE = "https://praneeth.dev";

describe("Person JSON-LD", () => {
  const person = personJsonLd(profile, education, skills, SITE);

  it("describes Praneeth with the required fields", () => {
    expect(person["@context"]).toBe("https://schema.org");
    expect(person["@type"]).toBe("Person");
    expect(person.name).toBe("Kankanti Praneeth");
    expect(person.jobTitle).toBe(profile.role);
    expect(person.address).toEqual({ "@type": "PostalAddress", addressLocality: "Hyderabad", addressRegion: "Telangana", addressCountry: "IN" });
    expect(person.sameAs).toEqual([profile.linkedin, profile.github]);
  });

  it("uses absolute URLs only", () => {
    expect(person.url).toBe(`${SITE}/`);
    expect(person.image).toBe(`${SITE}${profile.photo}`);
  });

  it("never includes the phone number", () => {
    expect(JSON.stringify(person).replace(/\D/g, "")).not.toContain("6305538759");
    expect(person).not.toHaveProperty("telephone");
  });
});

describe("CreativeWork JSON-LD", () => {
  it("describes a case study with absolute URLs and its creator", () => {
    const project = getProject("koshetty-jewellers");
    if (!project) throw new Error("missing project");
    const work = caseStudyJsonLd(project, profile, SITE);
    expect(work["@type"]).toBe("CreativeWork");
    expect(work.name).toBe("Koshetty Jewellers");
    expect(work.url).toBe(`${SITE}/work/koshetty-jewellers`);
    expect(work.image).toBe(`${SITE}/work/koshetty-jewellers.webp`);
    expect(work.creator).toEqual({ "@type": "Person", name: profile.name, url: `${SITE}/` });
    expect(work.keywords).toContain("Next.js");
  });

  it("omits the image when a project has no screenshot", () => {
    const project = getProject("whatsapp-automation-bot");
    if (!project) throw new Error("missing project");
    expect(caseStudyJsonLd(project, profile, SITE)).not.toHaveProperty("image");
  });
});

describe("jsonLdScript", () => {
  it("escapes < so content can never close the script tag", () => {
    expect(jsonLdScript({ name: "</script><script>alert(1)</script>" })).not.toContain("</script>");
  });
});
