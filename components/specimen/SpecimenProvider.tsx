"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { STOP_VALUES } from "@/lib/specimen";

type SpecimenState = {
  axis: number;
  setAxis: (value: number) => void;
  pinnedSkill: string | null;
  setPinnedSkill: (skill: string | null) => void;
};

const SpecimenContext = createContext<SpecimenState | null>(null);

export function SpecimenProvider({ children }: { children: ReactNode }) {
  const [axis, setAxis] = useState(STOP_VALUES.fullstack);
  const [pinnedSkill, setPinnedSkill] = useState<string | null>(null);
  const value = useMemo(() => ({ axis, setAxis, pinnedSkill, setPinnedSkill }), [axis, pinnedSkill]);
  return <SpecimenContext.Provider value={value}>{children}</SpecimenContext.Provider>;
}

export function useSpecimen(): SpecimenState {
  const value = useContext(SpecimenContext);
  if (!value) throw new Error("useSpecimen must be used inside <SpecimenProvider>");
  return value;
}
