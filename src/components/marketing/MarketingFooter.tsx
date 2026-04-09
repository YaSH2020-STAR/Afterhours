import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-ah-border/60 bg-ah-bg-alt/40 px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">
        <div>
          <p className="font-display text-lg font-semibold text-ah-ink">AfterHours</p>
          <p className="mt-1 text-sm text-ah-muted">Real friends after work.</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-ah-muted">
          <Link href="/#how-it-works" className="transition-colors hover:text-ah-ink">
            How it works
          </Link>
          <Link href="/safety" className="transition-colors hover:text-ah-ink">
            Safety
          </Link>
          <Link href="/auth/signin" className="transition-colors hover:text-ah-ink">
            Sign in
          </Link>
          <Link href="/auth/signup" className="transition-colors hover:text-ah-ink">
            Join
          </Link>
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-center text-xs text-ah-muted/90">
        © {new Date().getFullYear()} AfterHours
      </p>
    </footer>
  );
}
