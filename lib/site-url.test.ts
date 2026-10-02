import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "./site-url";

describe("resolveSiteUrl", () => {
  it("prefers the explicit custom domain", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://praneeth.dev", VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app" })).toBe("https://praneeth.dev");
  });

  it("strips a trailing slash", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://praneeth.dev/" })).toBe("https://praneeth.dev");
  });

  it("falls back to Vercel's production domain over https", () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "kankanti-praneeth.vercel.app" })).toBe("https://kankanti-praneeth.vercel.app");
  });

  it("uses localhost only when nothing is configured", () => {
    expect(resolveSiteUrl({})).toBe("http://localhost:3000");
  });
});
