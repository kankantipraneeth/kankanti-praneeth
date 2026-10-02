import type { Lighthouse, LighthouseScores } from "@/content/site";
import { formatIssued } from "@/lib/format";

const row = (scores: LighthouseScores) =>
  [`PERF ${scores.performance}`, `A11Y ${scores.accessibility}`, `BP ${scores.bestPractices}`, scores.seo === undefined ? null : `SEO ${scores.seo}`].filter(Boolean).join(" · ");

export function ScoreReadout({ lighthouse }: { lighthouse: Lighthouse }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="label text-muted">
        {lighthouse.tool} · measured {formatIssued(lighthouse.measured)}
      </span>
      <span className="font-mono text-readout">MOBILE {row(lighthouse.mobile)}</span>
      <span className="font-mono text-readout">DESKTOP {row(lighthouse.desktop)}</span>
    </div>
  );
}
