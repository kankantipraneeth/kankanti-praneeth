import { ImageResponse } from "next/og";
import { heroProof, profile, roleLines } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Kankanti Praneeth: full-stack developer who builds production websites and AI automations";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0D0C0A", color: "#F2F0EA", padding: 72 }}>
        <div style={{ fontSize: 24, letterSpacing: 4, color: "#A7A49E" }}>{`${profile.role.toUpperCase()} · HYDERABAD`}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 112, lineHeight: 1 }}>{profile.name}</div>
          <div style={{ fontSize: 36, color: "#A7A49E" }}>{roleLines.fullstack}</div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {heroProof.map((claim, index) => (
            <div key={claim} style={{ display: "flex", whiteSpace: "nowrap", fontSize: 22, padding: "10px 16px", ...(index === 0 ? { background: "#F8CC2F", color: "#130F06" } : { border: "1px solid #2F2E2A" }) }}>
              {claim}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
