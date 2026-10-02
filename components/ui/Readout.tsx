import type { ReactNode } from "react";

export function Readout({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="label text-muted">{label}</span>
      <span className="font-mono text-readout">{children}</span>
    </div>
  );
}
