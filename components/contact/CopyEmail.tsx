"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "copied" | "manual";

const MESSAGES: Record<Status, string> = {
  idle: "Tap or click the address to copy it",
  copied: "Copied ✓",
  manual: "Selected. Press Ctrl+C (⌘+C on Mac) to copy",
};

export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (status === "idle") return;
    const timer = window.setTimeout(() => setStatus("idle"), status === "copied" ? 2000 : 6000);
    return () => window.clearTimeout(timer);
  }, [status]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      const selection = window.getSelection();
      if (textRef.current && selection) {
        const range = document.createRange();
        range.selectNodeContents(textRef.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setStatus("manual");
    }
  };

  return (
    <div>
      <button type="button" onClick={copy} className="email-display min-h-11 py-2 text-left hover:text-accent">
        {/* <wbr> lets a narrow screen break after the local part, never mid-word. */}
        <span ref={textRef} translate="no">
          {email.split("@")[0]}
          <wbr />@{email.split("@")[1]}
        </span>
        <span className="sr-only"> (copy email address)</span>
      </button>
      <p aria-live="polite" className="label mt-4 text-muted">
        {MESSAGES[status]}
      </p>
    </div>
  );
}
