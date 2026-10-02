"use client";

import { useSpecimen } from "@/components/specimen/SpecimenProvider";
import { nearestStop, STOP_LABELS } from "@/lib/specimen";

export function AxisLabel() {
  const { axis } = useSpecimen();
  return (
    <p className="label flex items-center gap-3 text-muted">
      <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
      Axis: Role · {STOP_LABELS[nearestStop(axis)]}
    </p>
  );
}
