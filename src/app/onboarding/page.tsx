import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppOnboardingWizard } from "@/components/onboarding/AppOnboardingWizard";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Tell us your city, availability, and preferences for a thoughtful pod match.",
};

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/onboarding");
  }
  if (session.user.onboardingCompleted) {
    redirect("/dashboard");
  }

  return <AppOnboardingWizard />;
}
