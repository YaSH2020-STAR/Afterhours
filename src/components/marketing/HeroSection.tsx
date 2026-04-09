"use client";

import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useCallback, useRef } from "react";
import { easeOut } from "./motion";

export function HeroSection() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(50);
  const y = useMotionValue(40);
  const sx = useSpring(x, { stiffness: 120, damping: 28 });
  const sy = useSpring(y, { stiffness: 120, damping: 28 });

  const spotlight = useMotionTemplate`radial-gradient(650px circle at ${sx}% ${sy}%, rgba(61, 122, 102, 0.18), rgba(196, 92, 62, 0.06) 38%, transparent 62%)`;

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduce || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      x.set(((e.clientX - r.left) / r.width) * 100);
      y.set(((e.clientY - r.top) / r.height) * 100);
    },
    [reduce, x, y],
  );

  const onLeave = useCallback(() => {
    x.set(50);
    y.set(42);
  }, [x, y]);

  return (
    <section ref={ref} className="relative overflow-hidden px-4 pb-20 pt-12 sm:px-6 sm:pb-28 sm:pt-16">
      {!reduce && (
        <motion.div
          className="pointer-events-none absolute inset-0 marketing-grain opacity-70"
          aria-hidden
        />
      )}
      <div
        className="relative mx-auto max-w-6xl rounded-[2rem] border border-ah-border/50 bg-ah-card/90 p-8 shadow-[0_24px_80px_-24px_rgba(20,24,22,0.12)] sm:p-12 lg:p-16"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {!reduce && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-100"
            style={{ background: spotlight }}
            aria-hidden
          />
        )}
        <div className="relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeOut }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-ah-warm"
            >
              AfterHours
            </motion.p>
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05, ease: easeOut }}
              className="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-tight text-ah-ink sm:text-5xl lg:text-[3.25rem]"
            >
              Make real friends after work.
            </motion.h1>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: easeOut }}
              className="mt-5 max-w-md text-lg text-ah-muted"
            >
              Small groups. One weekly hangout. Six weeks. Your city.
            </motion.p>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15, ease: easeOut }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                href="/auth/signup"
                className="group inline-flex items-center justify-center rounded-full bg-ah-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-ah-accent/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-ah-accent-soft hover:shadow-xl hover:shadow-ah-accent/30 active:translate-y-0"
              >
                Join
                <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
              <Link
                href="/#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-ah-border bg-ah-bg/80 px-7 py-3.5 text-sm font-semibold text-ah-ink backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-ah-accent/35 hover:bg-ah-card active:translate-y-0"
              >
                See how it works
              </Link>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-6 flex flex-wrap gap-2"
            >
              {["Not dating", "Not networking", "Not Meetup"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-ah-border/70 bg-ah-bg-alt/60 px-3 py-1 text-xs font-medium text-ah-muted"
                >
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          <HeroVisual reduce={!!reduce} />
        </div>
      </div>
    </section>
  );
}

function HeroVisual({ reduce }: { reduce: boolean }) {
  const nodes = [
    { x: 18, y: 22, d: 1 },
    { x: 52, y: 18, d: 1.2 },
    { x: 82, y: 38, d: 0.9 },
    { x: 30, y: 58, d: 1.1 },
    { x: 68, y: 62, d: 1 },
    { x: 48, y: 78, d: 0.85 },
  ];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.12, ease: easeOut }}
      className="relative aspect-[4/3] w-full max-lg:mx-auto max-lg:max-w-md"
      aria-hidden
    >
      <div className="absolute inset-0 rounded-3xl border border-ah-border/60 bg-gradient-to-br from-ah-bg-alt/90 to-ah-card" />
      <svg className="absolute inset-[12%] h-[76%] w-[76%] text-ah-border/80" viewBox="0 0 100 100" fill="none">
        <motion.path
          d="M20 25 L52 20 L80 40 L30 58 L68 62 L48 78"
          stroke="currentColor"
          strokeWidth="0.35"
          strokeLinecap="round"
          strokeDasharray="4 3"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: easeOut }}
        />
        {nodes.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={2.2}
            className="fill-ah-accent/90"
            initial={reduce ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 + i * 0.08, type: "spring", stiffness: 200, damping: 18 }}
          />
        ))}
      </svg>
      <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-ah-border/50 bg-ah-card/95 p-4 shadow-lg backdrop-blur-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ah-muted">Preview</p>
        <p className="mt-1 font-medium text-ah-ink">Your pod · one evening / week</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ah-bg-alt">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-ah-accent to-ah-accent-soft"
            initial={reduce ? false : { width: "0%" }}
            animate={{ width: "33%" }}
            transition={{ duration: 1.2, delay: 0.6, ease: easeOut }}
          />
        </div>
        <p className="mt-2 text-xs text-ah-muted">Season progress · week 2 of 6</p>
      </div>
    </motion.div>
  );
}
