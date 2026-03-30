import Link from "next/link";
import { AppHeaderNav } from "./AppHeaderNav";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 shadow-[0_1px_0_0_rgba(20,24,22,0.05)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="group flex shrink-0 flex-col gap-0.5 sm:min-w-[10rem]"
        >
          <span className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-ah-ink">
            <span
              className="inline-block h-2 w-2 rounded-full bg-gradient-to-br from-ah-accent to-ah-accent-soft shadow-[0_0_12px_rgba(45,90,74,0.35)] transition group-hover:scale-110"
              aria-hidden
            />
            AfterHours
          </span>
          <span className="hidden text-[11px] font-medium tracking-wide text-ah-muted/90 sm:block">
            Open tables & meetups near you
          </span>
        </Link>
        <AppHeaderNav />
      </div>
    </header>
  );
}
