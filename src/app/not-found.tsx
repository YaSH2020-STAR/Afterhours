import Link from "next/link";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

export default function NotFound() {
  return (
    <MarketingLayout>
      <div className="mx-auto max-w-[640px] px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-ah-ink">Page not found</h1>
        <p className="mt-3 text-ah-muted">That URL doesn’t exist. Try the home page or intake.</p>
        <p className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/" className="font-semibold text-ah-accent underline-offset-2 hover:underline">
            Home
          </Link>
          <Link href="/onboarding" className="font-semibold text-ah-accent underline-offset-2 hover:underline">
            Join waitlist
          </Link>
        </p>
      </div>
    </MarketingLayout>
  );
}
