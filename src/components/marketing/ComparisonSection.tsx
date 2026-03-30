"use client";

import { motion, useReducedMotion } from "framer-motion";
import { easeOut, fadeUp, stagger } from "./motion";

const rows = [
  { left: "Meetup gives you events.", right: "AfterHours gives you continuity." },
  { left: "Dating apps give you pressure.", right: "AfterHours gives you comfort." },
  { left: "Networking apps give you performance.", right: "AfterHours gives you presence." },
];

export function ComparisonSection() {
  const reduce = useReducedMotion();

  return (
    <section id="why-afterhours" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="font-display text-3xl font-bold tracking-tight text-ah-ink sm:text-4xl"
        >
          Why it’s different
        </motion.h2>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05, ease: easeOut }}
          className="mt-3 max-w-lg text-ah-muted"
        >
          Same people. Same evening. Six weeks.
        </motion.p>

        <motion.div
          variants={reduce ? undefined : stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-12 space-y-3"
        >
          {rows.map((r) => (
            <motion.div
              key={r.left}
              variants={reduce ? undefined : fadeUp}
              transition={{ duration: 0.45, ease: easeOut }}
              className="grid gap-3 rounded-2xl border border-ah-border/70 bg-gradient-to-r from-ah-bg-alt/90 to-ah-card p-5 sm:grid-cols-2 sm:items-center sm:gap-8 sm:p-6"
            >
              <p className="text-sm text-ah-muted line-through decoration-ah-border decoration-1">{r.left}</p>
              <p className="text-base font-medium text-ah-ink">{r.right}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
