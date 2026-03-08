import { HeroFeatures } from "@/components/main/features/hero-features";
import { FeatureCapabilities } from "@/components/main/features/feature-capabilities";
import { FeatureWorkflow } from "@/components/main/features/feature-workflow";
import { FeatureGovernance } from "@/components/main/features/feature-governance";
import { FeatureFaq } from "@/components/main/features/feature-faq";
import { FeatureCta } from "@/components/main/features/feature-cta";

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <HeroFeatures />
      <FeatureCapabilities />
      <FeatureWorkflow />
      <FeatureGovernance />
      <FeatureFaq />
      <FeatureCta />
    </div>
  );
}
