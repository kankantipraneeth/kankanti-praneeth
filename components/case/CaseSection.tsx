import type { ReactNode } from "react";

export function CaseSection({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  const id = `case-${title.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  return (
    <section aria-labelledby={id} className="grid grid-cols-4 gap-x-gutter border-t border-rule py-12 lg:grid-cols-12">
      <p className="label col-span-4 text-muted lg:col-span-3">{number}</p>
      <div className="col-span-4 mt-4 lg:col-span-8 lg:mt-0">
        <h2 id={id} data-case-heading className="text-h2">
          {title}
        </h2>
        <div className="mt-6 max-w-[68ch]">{children}</div>
      </div>
    </section>
  );
}
