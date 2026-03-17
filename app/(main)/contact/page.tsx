import { HeroContact } from "@/components/main/contact/hero-contact";
import { DirectConnect } from "@/components/main/contact/direct-connect";
import { ContactForm } from "@/components/main/contact/contact-form";
import { SystemStatus } from "@/components/main/contact/system-status";
import { Faq } from "@/components/main/contact/faq";
import { LocationHq } from "@/components/main/contact/location-hq";
import { CtaSection } from "@/components/main/landing/cta-section";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact RTM Class for onboarding, support, and partnership discussions for your institution.",
  path: "/contact",
  keywords: ["contact rtm class", "education platform support", "school onboarding"],
});

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background overflow-hidden">
      <HeroContact />
      <DirectConnect />
      <ContactForm />
      <SystemStatus />
      <Faq />
      <LocationHq />
      <CtaSection
        title="Ready to Launch With RTM Class?"
        description="Our team can help you onboard faster and align the platform with your academic operations."
        primaryBtnText="Create Account"
        primaryBtnHref="/auth/sign-up"
        secondaryBtnText="Sign In"
        secondaryBtnHref="/auth/sign-in"
      />
    </div>
  );
}
