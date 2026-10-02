import { GlyphTable } from "./GlyphTable";

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="border-b border-rule py-section">
      <div className="mx-auto max-w-page px-margin">
        <p className="label text-muted">04 · Skills</p>
        <h2 id="skills-title" className="mt-4 text-h2">
          Skills, and where I used them
        </h2>
        <div className="mt-12">
          <GlyphTable />
        </div>
      </div>
    </section>
  );
}
