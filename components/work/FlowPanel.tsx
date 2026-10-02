import { Arrow } from "@/components/ui/Arrow";

/** Typographic stand-in for a screenshot: the project's real steps, each with its connector directly beneath it. */
export function FlowPanel({ steps }: { steps: string[] }) {
  return (
    <ol aria-label="How it works" className="flex h-full flex-col justify-center gap-2 border border-rule p-6 lg:p-10">
      {steps.map((step, index) => (
        <li key={step} className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-2">
          <span className="label tabular-nums text-muted">{String(index + 1).padStart(2, "0")}</span>
          <span className="instance-display text-h2">{step}</span>
          {index < steps.length - 1 ? (
            <span aria-hidden="true" className="col-start-2 mt-2 text-h3 text-accent">
              <Arrow direction="down" />
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
