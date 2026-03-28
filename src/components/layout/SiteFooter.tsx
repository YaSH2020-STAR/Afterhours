import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-ah-border bg-ah-bg-alt py-8 text-center text-ah-muted">
      <div className="mx-auto max-w-[1100px] px-4">
        <p className="text-ah-ink">
          <strong>AfterHours</strong> — rhythm, reciprocity, continuity.
        </p>
        <p className="mt-2 text-sm">
          <Link href="/demo/phoenix" className="text-ah-accent underline-offset-2 hover:underline">
            Demo dataset (Phoenix, AZ)
          </Link>
        </p>
        <p className="mt-1 text-sm">© {year} AfterHours.</p>
      </div>
    </footer>
  );
}
