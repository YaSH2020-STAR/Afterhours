"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { easeOut } from "./motion";

export function GetStartedFinalSection() {
  const reduce = useReducedMotion();

  return (
    <section id="get-started" className="scroll-mt-24 px-4 pb-24 pt-8 sm:px-6 sm:pb-32">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: easeOut }}
        className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-ah-border/70 bg-gradient-to-br from-ah-accent/10 via-ah-card to-ah-bg-alt/90 p-8 shadow-[0_40px_100px_-48px_rgba(45,90,74,0.35)] sm:p-12 lg:p-14"
      >
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ah-ink sm:text-4xl">
            Start in your city
          </h2>
          <p className="mt-3 text-ah-muted">
            Create a free account, add your area, then browse meetups nearby or host one. Open tables and small
            groups are live—no invite code.
          </p>
        </div>
        <div className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center rounded-full bg-ah-accent px-8 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-ah-accent/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-ah-accent-soft hover:shadow-xl"
          >
            Create free account
          </Link>
          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center rounded-full border border-ah-border bg-ah-card px-8 py-4 text-center text-sm font-semibold text-ah-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-ah-accent/40"
          >
            Sign in
          </Link>
        </div>
        <p className="mx-auto mt-8 max-w-lg text-center text-sm text-ah-muted">
          After sign-in you&apos;ll set city and availability once, then open{" "}
          <strong className="text-ah-ink">Meetups</strong> for nearby activity and{" "}
          <strong className="text-ah-ink">Host</strong> to create a group.
        </p>
      </motion.div>
    </section>
  );
}
