export function FlowPanel({ steps }: { steps: string[] }) {
  return (
    <ol aria-label="How it works" className="flex h-full flex-col justify-center gap-3 border border-rule p-6 lg:p-10">
      {steps.map((step, index) => (
        <li key={step} className="flex items-baseline gap-4">
          <span className="label text-muted">{String(index + 1).padStart(2, "0")}</span>
          <span className="instance-display text-h2">{step}</span>
          {index < steps.length - 1 ? (
            <span aria-hidden="true" className="text-h3 text-accent">
              ↓
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
