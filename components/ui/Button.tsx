import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "link";
  download?: boolean;
  external?: boolean;
  className?: string;
};

const VARIANTS = {
  primary: "bg-accent px-6 text-on-accent",
  secondary: "border border-paper px-6 text-paper hover:bg-ink-raised",
  link: "text-paper underline decoration-rule underline-offset-[6px] hover:decoration-accent",
} as const;

export function Button({ href, children, variant = "primary", download, external, className = "" }: ButtonProps) {
  const classes = `group inline-flex min-h-12 items-center gap-3 text-small font-semibold ${VARIANTS[variant]} ${className}`;
  const arrow = (
    <span aria-hidden="true" className="arrow">
      {download ? "↓" : external ? "↗" : "→"}
    </span>
  );
  if (download || external) {
    return (
      <a href={href} className={classes} download={download || undefined} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
        {children}
        {arrow}
        {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
      {arrow}
    </Link>
  );
}
