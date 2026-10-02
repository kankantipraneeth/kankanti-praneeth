import { profile } from "@/content/site";

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-page flex-col gap-4 px-margin py-10 lg:flex-row lg:items-baseline lg:justify-between">
        <p className="instance-display text-h3">{profile.name}</p>
        <p className="label text-muted">Built with Next.js · GSAP · Anek & Martian Mono</p>
        <p className="label text-muted">© {YEAR}</p>
        <a href="#main" className="label hover:text-accent">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
