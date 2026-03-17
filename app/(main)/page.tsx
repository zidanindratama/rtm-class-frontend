import { HeroSection } from "@/components/main/landing/hero-section";
import { ClientLogos } from "@/components/main/landing/client-logos";
import { FeaturesSection } from "@/components/main/landing/features-section";
import { HowItWorks } from "@/components/main/landing/how-it-works";
import { InteractiveDemo } from "@/components/main/landing/interactive-demo";
import { BenefitsSection } from "@/components/main/landing/benefits-section";
import { Testimonials } from "@/components/main/landing/testimonials";
import { CtaSection } from "@/components/main/landing/cta-section";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Modern Classroom, Simplified",
  description:
    "Run live classes, manage assignments, publish materials, and collaborate faster with RTM Class.",
  path: "/",
  keywords: [
    "classroom platform",
    "learning management system",
    "online class tools",
    "teacher workflow",
  ],
});

export default function Home() {
  return (
    <main className="flex-1 w-full">
      <HeroSection />
      <ClientLogos />
      <FeaturesSection />
      <HowItWorks />
      <InteractiveDemo />
      <BenefitsSection />
      <Testimonials />
      <CtaSection
        title="Ready to Run Your Class in One Platform?"
        description="Plan lessons, publish assignments, run discussions, and manage learning content with a faster, cleaner workflow."
        primaryBtnText="Get Started for Free"
        primaryBtnHref="/auth/sign-up"
        secondaryBtnText="Sign In"
        secondaryBtnHref="/auth/sign-in"
      />
    </main>
  );
}
