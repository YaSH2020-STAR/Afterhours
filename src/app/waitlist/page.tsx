import type { Metadata } from "next";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export const metadata: Metadata = {
  title: "Waitlist intake",
  description: "Email-only waitlist intake for cities as we open pods.",
};

export default function WaitlistPage() {
  return (
    <MarketingLayout>
      <OnboardingWizard />
    </MarketingLayout>
  );
}
