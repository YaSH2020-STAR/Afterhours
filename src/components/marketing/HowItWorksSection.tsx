"use client";

import { motion, useReducedMotion } from "framer-motion";
import { easeOut, fadeUp, stagger } from "./motion";

const steps = [
  {
    title: "Tell us your vibe",
    body: "City, availability, what feels low-pressure for you.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.375 9 9.75 9s.75.336.75.75zm5.25 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75z" />
      </svg>
    ),
  },
  {
    title: "Join a pod",
    body: "We match you with a small group—same people, same slot.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.09 9.09 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    title: "Meet weekly for 6 weeks",
    body: "Same evening. Real continuity—then you choose what’s next.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
      </svg>
    ),
  },
];

export function HowItWorksSection() {
  const reduce = useReducedMotion();

  return (
    <section id="how-it-works" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="font-display text-3xl font-bold tracking-tight text-ah-ink sm:text-4xl"
        >
          How it works
        </motion.h2>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05, ease: easeOut }}
          className="mt-3 max-w-xl text-ah-muted"
        >
          Three steps. No feed. No performance.
        </motion.p>

        <motion.ul
          variants={reduce ? undefined : stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-14 grid gap-5 md:grid-cols-3"
        >
          {steps.map((s) => (
            <motion.li
              key={s.title}
              variants={reduce ? undefined : fadeUp}
              transition={{ duration: 0.5, ease: easeOut }}
              className="group rounded-2xl border border-ah-border/80 bg-ah-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-ah-accent/25 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ah-bg-alt text-ah-accent transition-colors duration-300 group-hover:bg-ah-accent/10">
                {s.icon}
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-ah-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ah-muted">{s.body}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
