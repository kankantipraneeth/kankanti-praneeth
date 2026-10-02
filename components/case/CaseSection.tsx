import type { ReactNode } from "react";

/** One case-study section: heading in the left columns, content beside it on desktop, stacked on mobile. */
export function CaseSection({ title, children }: { title: string; children: ReactNode }) {
  const id = `case-${title.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  return (
    <section aria-labelledby={id} className="grid grid-cols-4 gap-x-gutter gap-y-6 border-t border-rule py-12 lg:grid-cols-12">
      <h2 id={id} data-case-heading className="col-span-4 text-h2">
        {title}
      </h2>
      <div className="col-span-4 max-w-[68ch] lg:col-span-8">{children}</div>
    </section>
  );
}
