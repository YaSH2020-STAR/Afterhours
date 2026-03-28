import type { Metadata } from "next";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export const metadata: Metadata = {
  title: "Full intake",
  description:
    "For young professionals who recently moved cities: tell us your metro, situation, availability, and comfort needs so we can match you into a small pod.",
};

export default function OnboardingPage() {
  return (
    <MarketingLayout>
      <OnboardingWizard />
    </MarketingLayout>
  );
}
