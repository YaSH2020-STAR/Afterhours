import { MarketingNav } from "./MarketingNav";
import { HeroSection } from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { ComparisonSection } from "./ComparisonSection";
import { PodPreviewSection } from "./PodPreviewSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { GetStartedFinalSection } from "./GetStartedFinalSection";
import { MarketingFooter } from "./MarketingFooter";

export function MarketingLanding() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <MarketingNav />
      <main id="main" className="marketing-grain min-h-screen">
        <HeroSection />
        <HowItWorksSection />
        <ComparisonSection />
        <PodPreviewSection />
        <TestimonialsSection />
        <GetStartedFinalSection />
      </main>
      <MarketingFooter />
    </>
  );
}
