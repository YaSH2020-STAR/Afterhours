"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#why-afterhours", label: "Why AfterHours" },
  { href: "/safety", label: "Safety" },
  { href: "/#get-started", label: "Get started" },
] as const;

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-[100] border-b border-ah-border/60 bg-ah-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-ah-ink transition-colors hover:text-ah-accent"
        >
          AfterHours
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group relative rounded-lg px-3 py-2 text-sm font-medium text-ah-muted transition-colors hover:text-ah-ink"
            >
              <span className="relative z-10">{l.label}</span>
              {!reduce && (
                <span className="absolute inset-x-2 -bottom-px h-px origin-left scale-x-0 bg-ah-accent transition-transform duration-300 ease-out group-hover:scale-x-100" />
              )}
            </Link>
          ))}
          <Link
            href="/auth/signup"
            className="ml-2 rounded-full border border-ah-accent bg-ah-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-ah-accent-soft active:translate-y-0"
          >
            Sign up
          </Link>
          <Link
            href="/auth/signin"
            className="rounded-full border border-ah-border bg-ah-card px-4 py-2 text-sm font-semibold text-ah-ink shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-ah-accent/40 hover:shadow-md active:translate-y-0"
          >
            Sign in
          </Link>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-ah-border/80 text-ah-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className="flex flex-col gap-1.5">
            <motion.span
              animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-5 rounded-full bg-current"
            />
            <motion.span
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              className="block h-0.5 w-5 rounded-full bg-current"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-5 rounded-full bg-current"
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-ah-border/60 bg-ah-bg md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-3 py-3 text-base font-medium text-ah-ink hover:bg-ah-bg-alt"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/auth/signup"
                className="mt-2 rounded-full border border-ah-accent bg-ah-accent py-3 text-center text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                Sign up
              </Link>
              <Link
                href="/auth/signin"
                className="rounded-full border border-ah-border bg-ah-card py-3 text-center text-sm font-semibold text-ah-ink"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
