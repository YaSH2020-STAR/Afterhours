import Link from "next/link";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-ah-border bg-ah-bg/90">
        <div className="mx-auto flex max-w-[960px] items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/dashboard" className="font-display text-lg font-bold text-ah-ink">
            AfterHours
          </Link>
          <Link href="/" className="text-sm font-medium text-ah-muted hover:text-ah-accent">
            About
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
