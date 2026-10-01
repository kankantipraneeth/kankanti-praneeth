import { describe, expect, it } from "vitest";
import { axisToInstance, clampAxis, formatReadout, formatVariation, INSTANCES, nearestStop, snapAxis } from "./specimen";

describe("role axis", () => {
  it("clamps and repairs bad input", () => {
    expect(clampAxis(-10)).toBe(0);
    expect(clampAxis(140)).toBe(100);
    expect(clampAxis(Number.NaN)).toBe(50);
  });

  it("maps stops to their exact instances", () => {
    expect(axisToInstance(0)).toEqual(INSTANCES.web);
    expect(axisToInstance(50)).toEqual(INSTANCES.fullstack);
    expect(axisToInstance(100)).toEqual(INSTANCES.ai);
  });

  it("interpolates between neighbouring stops", () => {
    expect(axisToInstance(25)).toEqual({ wdth: 112.5, wght: 450 });
    expect(axisToInstance(75)).toEqual({ wdth: 87.5, wght: 700 });
  });

  it("finds the nearest named stop, ties going to full-stack", () => {
    expect(nearestStop(0)).toBe("web");
    expect(nearestStop(24)).toBe("web");
    expect(nearestStop(25)).toBe("fullstack");
    expect(nearestStop(75)).toBe("fullstack");
    expect(nearestStop(76)).toBe("ai");
    expect(snapAxis(90)).toBe(100);
    expect(snapAxis(40)).toBe(50);
  });

  it("formats CSS and readout strings", () => {
    expect(formatVariation({ wdth: 100, wght: 600 })).toBe('"wdth" 100, "wght" 600');
    expect(formatReadout({ wdth: 112.5, wght: 449.6 })).toBe("wght 450 · wdth 113");
  });
});
