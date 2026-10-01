import { describe, expect, it } from "vitest";
import { formatIssued, formatMonth } from "./format";

describe("dates", () => {
  it("formats months", () => {
    expect(formatMonth("2025-05")).toBe("MAY 2025");
    expect(() => formatMonth("2025-13")).toThrow();
  });

  it("formats issue dates at their own precision", () => {
    expect(formatIssued("2025-10-29")).toBe("29 OCT 2025");
    expect(formatIssued("2025-10")).toBe("OCT 2025");
    expect(formatIssued("2022")).toBe("2022");
  });
});
