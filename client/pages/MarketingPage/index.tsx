import { FeaturedEventsSection } from "@/components/marketing/featured-events-section";
import { FeatureSection } from "@/components/marketing/feature-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { WorkflowSection } from "@/components/marketing/workflow-section";
import { MarketingLayout } from "@/layouts/MarketingLayout";

export function MarketingPage() {
  return (
    <MarketingLayout>
      <HeroSection />
      <FeatureSection />
      <FeaturedEventsSection />
      <WorkflowSection />
    </MarketingLayout>
  );
}

export default MarketingPage;
