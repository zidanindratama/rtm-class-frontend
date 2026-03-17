import { HeroFeatures } from "@/components/main/features/hero-features";
import { FeatureCapabilities } from "@/components/main/features/feature-capabilities";
import { FeatureWorkflow } from "@/components/main/features/feature-workflow";
import { FeatureGovernance } from "@/components/main/features/feature-governance";
import { FeatureFaq } from "@/components/main/features/feature-faq";
import { FeatureCta } from "@/components/main/features/feature-cta";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Features",
  description:
    "Explore RTM Class features for live classes, content creation, assignments, and collaboration workflows.",
  path: "/features",
  keywords: ["rtm class features", "class management tools", "education workflow"],
});

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
