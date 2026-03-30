import Link from "next/link";

const nav = [
  { href: "/#why-when-how", label: "Why & how" },
  { href: "/#rhythm", label: "The idea" },
  { href: "/#pods", label: "Pods" },
  { href: "/#inclusion", label: "Who it’s for" },
  { href: "/#ethnicity-inclusion", label: "Ethnicity & inclusion" },
  { href: "/safety", label: "Safety & trust" },
  { href: "/#difference", label: "Why not Meetup" },
  { href: "/#voices", label: "Stories" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ah-border bg-ah-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-ah-ink hover:text-ah-accent"
        >
          AfterHours
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm font-medium text-ah-muted max-[720px]:order-3 max-[720px]:w-full max-[720px]:border-t max-[720px]:border-ah-border max-[720px]:pt-3">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-ah-accent">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-2 max-[720px]:ml-auto">
          <Link
            href="/auth/signin"
            className="rounded-lg border-2 border-ah-border bg-transparent px-3 py-1.5 text-sm font-semibold text-ah-ink hover:border-ah-accent hover:text-ah-accent"
          >
            Sign in
          </Link>
          <Link
            href="/waitlist"
            className="rounded-lg border-2 border-ah-accent bg-ah-accent px-3 py-1.5 text-sm font-semibold text-white hover:border-ah-accent-soft hover:bg-ah-accent-soft"
          >
            Waitlist
          </Link>
        </div>
      </div>
    </header>
  );
}
