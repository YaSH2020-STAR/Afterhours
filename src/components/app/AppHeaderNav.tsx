"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Discover" },
  { href: "/open-tables", label: "Tables" },
  { href: "/groups", label: "Meetups" },
  { href: "/create", label: "Host" },
  { href: "/plans", label: "Plans" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
] as const;

export function AppHeaderNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="scrollbar-none -mx-1 flex snap-x snap-mandatory items-center gap-1 overflow-x-auto pb-0.5 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:pb-0 sm:pl-0"
    >
      {links.map((l) => {
        const active =
          pathname === l.href ||
          (l.href !== "/dashboard" && pathname.startsWith(l.href)) ||
          (l.href === "/groups" && pathname.startsWith("/group/")) ||
          (l.href === "/plans" && pathname.startsWith("/plans"));
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`snap-start whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition ${
              active
                ? "bg-white text-ah-ink shadow-[0_2px_12px_-4px_rgba(20,24,22,0.18)] ring-1 ring-black/[0.06]"
                : "text-ah-muted hover:bg-black/[0.04] hover:text-ah-ink"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
