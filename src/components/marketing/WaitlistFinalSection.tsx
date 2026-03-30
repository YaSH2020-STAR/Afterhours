"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { easeOut } from "./motion";

export function WaitlistFinalSection() {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      email: String(fd.get("email") ?? ""),
      city: String(fd.get("city") ?? ""),
      timezone: "",
      situations: [] as string[],
      availability: [] as string[],
      affinity: [] as string[],
      comfortNotes: String(fd.get("vibe") ?? ""),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
    };
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok) {
        setStatus("err");
        setMsg(typeof data.message === "string" ? data.message : "Try again.");
        return;
      }
      setStatus("ok");
      setMsg(typeof data.message === "string" ? data.message : "You’re on the list.");
      e.currentTarget.reset();
    } catch {
      setStatus("err");
      setMsg("Network error.");
    }
  }

  return (
    <section id="waitlist" className="scroll-mt-24 px-4 pb-24 pt-8 sm:px-6 sm:pb-32">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: easeOut }}
        className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-ah-border/70 bg-gradient-to-br from-ah-accent/10 via-ah-card to-ah-bg-alt/90 p-8 shadow-[0_40px_100px_-48px_rgba(45,90,74,0.35)] sm:p-12 lg:p-14"
      >
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ah-ink sm:text-4xl">Get early access</h2>
          <p className="mt-3 text-ah-muted">We’re opening cities in small waves.</p>
        </div>
        <form
          onSubmit={onSubmit}
          className="relative mx-auto mt-10 grid max-w-lg gap-4 sm:grid-cols-2"
          noValidate
        >
          <label className="sm:col-span-2">
            <span className="sr-only">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Email"
              className="w-full rounded-xl border border-ah-border/80 bg-ah-card px-4 py-3.5 text-ah-ink placeholder:text-ah-muted/70 shadow-inner transition-shadow focus:border-ah-accent/50 focus:outline-none focus:ring-2 focus:ring-ah-accent/20"
            />
          </label>
          <label className="sm:col-span-2">
            <span className="sr-only">City</span>
            <input
              name="city"
              type="text"
              autoComplete="address-level2"
              placeholder="City"
              className="w-full rounded-xl border border-ah-border/80 bg-ah-card px-4 py-3.5 text-ah-ink placeholder:text-ah-muted/70 shadow-inner transition-shadow focus:border-ah-accent/50 focus:outline-none focus:ring-2 focus:ring-ah-accent/20"
            />
          </label>
          <label className="sm:col-span-2">
            <span className="sr-only">Vibe or availability (optional)</span>
            <input
              name="vibe"
              type="text"
              placeholder="Optional: weeknights, introvert-friendly…"
              className="w-full rounded-xl border border-ah-border/80 bg-ah-card px-4 py-3.5 text-sm text-ah-ink placeholder:text-ah-muted/70 shadow-inner transition-shadow focus:border-ah-accent/50 focus:outline-none focus:ring-2 focus:ring-ah-accent/20"
            />
          </label>
          <label className="sm:col-span-2 flex cursor-pointer items-start gap-3 text-left text-sm text-ah-muted">
            <input name="consent" type="checkbox" required className="mt-1 h-4 w-4 rounded border-ah-border text-ah-accent" />
            <span>I’m ok being contacted about AfterHours in my area.</span>
          </label>
          <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden>
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-full bg-ah-accent py-4 text-sm font-semibold text-white shadow-lg shadow-ah-accent/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-ah-accent-soft hover:shadow-xl disabled:opacity-60"
            >
              {status === "loading" ? "Joining…" : "Join waitlist"}
            </button>
          </div>
          {msg && (
            <p
              role="status"
              className={`sm:col-span-2 text-center text-sm font-medium ${status === "err" ? "text-red-700" : "text-ah-accent"}`}
            >
              {msg}
            </p>
          )}
        </form>
      </motion.div>
    </section>
  );
}
