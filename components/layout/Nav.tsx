"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { profile } from "@/content/site";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/components/motion/gsap-setup";
import { useScrollTo } from "@/components/motion/SmoothScroll";
import { Arrow } from "@/components/ui/Arrow";

const LINKS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

export function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const scrollTo = useScrollTo();
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav) return;
      const mm = gsap.matchMedia();
      // Two complementary conditions so the handler runs for every visitor; only the hide/show needs motion.
      mm.add({ motion: MQ.motion, reduce: "(prefers-reduced-motion: reduce)" }, (context) => {
        const { motion } = context.conditions as { motion: boolean };
        let hidden = false;
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            nav.dataset.raised = String(self.scroll() > 24);
            if (!motion) return;
            const hide = self.direction === 1 && self.scroll() > 120 && nav.dataset.open !== "true" && !nav.contains(document.activeElement);
            if (hide === hidden) return;
            hidden = hide;
            gsap.to(nav, { yPercent: hide ? -100 : 0, duration: 0.4, ease: hide ? "specimen-in" : "specimen-out", overwrite: "auto" });
          },
        });
      });
    },
    { scope: navRef },
  );

  // While the mobile menu is open: focus its first link, make the page behind it inert,
  // lock scroll, close on Escape (returning focus to the toggle) or when the viewport reaches desktop width.
  useEffect(() => {
    if (!open) return;
    const behind = [...document.querySelectorAll<HTMLElement>("#main, body > footer")];
    behind.forEach((el) => (el.inert = true));
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const desktop = window.matchMedia(MQ.desktop);
    const onDesktop = () => desktop.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      behind.forEach((el) => (el.inert = false));
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  const onLink = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    setOpen(false);
    if (!onHome) return;
    event.preventDefault();
    scrollTo(`#${id}`);
  };

  const links = (className: string) =>
    LINKS.map((link) => (
      <li key={link.id}>
        <Link href={`/#${link.id}`} onClick={(event) => onLink(event, link.id)} className={className}>
          {link.label}
        </Link>
      </li>
    ));

  return (
    <>
      <header ref={navRef} data-open={open} onFocus={() => gsap.to(navRef.current, { yPercent: 0, duration: 0.2, overwrite: "auto" })} className="nav fixed inset-x-0 top-0 z-40">
        <nav aria-label="Main" className="mx-auto flex h-18 max-w-page items-center justify-between gap-6 px-margin">
          <Link href="/" className="flex min-h-11 flex-col justify-center leading-tight">
            <span className="instance-display text-small">{profile.name}</span>
            <span className="label hidden text-muted sm:block">Full-stack + AI · {profile.location.split(",")[0]}</span>
          </Link>
          <ul className="hidden items-center gap-8 lg:flex">{links("label inline-flex min-h-11 items-center hover:text-accent")}</ul>
          <div className="flex items-center gap-4">
            <a href={profile.resumeUrl} download className="group label inline-flex min-h-11 items-center gap-2 border border-paper px-3 sm:px-4">
              Resume{" "}
              <span aria-hidden="true" className="arrow">
                <Arrow direction="down" />
              </span>
            </a>
            <button ref={toggleRef} type="button" className="label min-h-11 px-2 lg:hidden" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)}>
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </nav>
      </header>
      {/* Sibling of <header>, not a child: the header's GSAP transform would otherwise become this fixed panel's containing block. */}
      {open ? (
        <div ref={menuRef} id="mobile-menu" className="fixed inset-0 top-18 z-40 overflow-y-auto overscroll-contain bg-ink px-margin pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-10 lg:hidden">
          <ul className="flex flex-col gap-6">{links("instance-display text-display-2")}</ul>
          <a href={profile.resumeUrl} download className="label mt-12 inline-flex min-h-12 items-center gap-2 bg-accent px-6 text-on-accent">
            Download resume <Arrow direction="down" />
          </a>
        </div>
      ) : null}
    </>
  );
}
