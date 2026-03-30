"use client";

import { motion, useReducedMotion } from "framer-motion";
import { easeOut } from "./motion";

const members = ["A", "S", "J", "R", "C", "M"];
const tags = ["chill", "weeknights", "new in town"];

export function PodPreviewSection() {
  const reduce = useReducedMotion();

  return (
    <section id="pod-preview" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="font-display text-3xl font-bold tracking-tight text-ah-ink sm:text-4xl"
        >
          Inside a pod
        </motion.h2>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05, ease: easeOut }}
          className="mt-3 text-ah-muted"
        >
          What you’ll see in the app—nothing noisy.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="relative mt-12 overflow-hidden rounded-3xl border border-ah-border/80 bg-ah-card p-6 shadow-[0_32px_80px_-32px_rgba(20,24,22,0.12)] sm:p-8"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-ah-accent/5 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ah-warm">Pod 14 · Phoenix</p>
              <p className="mt-2 font-display text-2xl font-bold text-ah-ink">Thursday · 7:00 PM</p>
              <p className="mt-1 text-sm text-ah-muted">Week 2 of 6 · 6 members</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-ah-border/80 bg-ah-bg-alt/80 px-3 py-1 text-xs font-medium text-ah-muted transition-colors hover:border-ah-accent/30"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex -space-x-2">
              {members.map((m, i) => (
                <motion.div
                  key={m}
                  initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 + i * 0.05, ease: easeOut }}
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ah-card bg-gradient-to-br from-ah-bg-alt to-ah-border/50 text-xs font-semibold text-ah-ink shadow-sm"
                >
                  {m}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="relative mt-8 rounded-2xl border border-ah-border/60 bg-ah-bg/85 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ah-muted">Tonight</p>
            <p className="mt-1 text-ah-ink">Coffee + short walk · low stakes</p>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-ah-muted">
                <span>Season</span>
                <span>2 / 6</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-ah-border/50">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-ah-accent to-ah-accent-soft"
                  initial={reduce ? false : { width: 0 }}
                  whileInView={{ width: "33.333%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: easeOut }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
