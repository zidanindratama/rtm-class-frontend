import { Navbar } from "@/components/main/common/navbar";
import { Footer } from "@/components/main/common/footer";
import { HeroSection } from "@/components/main/landing/hero-section";
import { ClientLogos } from "@/components/main/landing/client-logos";
import { FeaturesSection } from "@/components/main/landing/features-section";
import { HowItWorks } from "@/components/main/landing/how-it-works";
import { InteractiveDemo } from "@/components/main/landing/interactive-demo";
import { BenefitsSection } from "@/components/main/landing/benefits-section";
import { Testimonials } from "@/components/main/landing/testimonials";
import { CtaSection } from "@/components/main/landing/cta-section";

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
        title="Ready to Transform Your Workflow?"
        description="Create better learning materials faster with AI-powered workflows. No credit card required to get started."
        primaryBtnText="Get Started for Free"
        primaryBtnHref="/auth/sign-up"
        secondaryBtnText="Sign In"
        secondaryBtnHref="/auth/sign-in"
      />
    </main>
  );
}
