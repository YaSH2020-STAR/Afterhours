"use client";

import { motion, useReducedMotion } from "framer-motion";
import { easeOut, fadeUp, stagger } from "./motion";

const quotes = [
  {
    quote: "I finally have names I recognize—not another one-off happy hour.",
    name: "Alex",
    role: "Product designer",
  },
  {
    quote: "It’s the same slot every week. That alone made it feel real.",
    name: "Sam",
    role: "Remote engineer",
  },
  {
    quote: "No pitch. No weird energy. Just people showing up.",
    name: "Jordan",
    role: "Marketing",
  },
];

export function TestimonialsSection() {
  const reduce = useReducedMotion();

  return (
    <section id="testimonials" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="font-display text-3xl font-bold tracking-tight text-ah-ink sm:text-4xl"
        >
          Real people
        </motion.h2>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05, ease: easeOut }}
          className="mt-3 text-ah-muted"
        >
          Early feedback from pilots.
        </motion.p>

        <motion.ul
          variants={reduce ? undefined : stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-12 grid gap-5 md:grid-cols-3"
        >
          {quotes.map((q) => (
            <motion.li
              key={q.name}
              variants={reduce ? undefined : fadeUp}
              transition={{ duration: 0.5, ease: easeOut }}
              className="rounded-2xl border border-ah-border/80 bg-ah-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-sm leading-relaxed text-ah-ink">&ldquo;{q.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold text-ah-ink">{q.name}</p>
              <p className="text-xs text-ah-muted">{q.role}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
