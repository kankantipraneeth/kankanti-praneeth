import { GlyphTable } from "./GlyphTable";

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="border-b border-rule py-section">
      <div className="mx-auto max-w-page px-margin">
        <h2 id="skills-title" className="text-h2">
          Skills, and where I used them
        </h2>
        <div className="mt-12">
          <GlyphTable />
        </div>
      </div>
    </section>
  );
}
