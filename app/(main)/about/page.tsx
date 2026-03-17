import { HeroAbout } from "@/components/main/about/hero-about";
import { OriginStory } from "@/components/main/about/origin-story";
import { CoreValues } from "@/components/main/about/core-values";
import { Architecture } from "@/components/main/about/architecture";
import { MeetTheTeam } from "@/components/main/about/meet-the-team";
import { Milestones } from "@/components/main/about/milestones";
import { ImpactStats } from "@/components/main/about/impact-stats";
import { CtaSection } from "@/components/main/landing/cta-section";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About RTM Class",
  description:
    "Learn how RTM Class helps schools and educators modernize classroom operations end-to-end.",
  path: "/about",
  keywords: ["about rtm class", "education platform", "classroom operations"],
});

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background overflow-hidden">
      <HeroAbout />
      <OriginStory />
      <CoreValues />
      <Architecture />
      <MeetTheTeam />
      <Milestones />
      <ImpactStats />
      <CtaSection
        title="Ready to Build Better Learning Operations?"
        description="Bring your team into a platform designed for class management, assignments, forums, blogs, and AI-assisted content workflows."
        primaryBtnText="Create Account"
        primaryBtnHref="/auth/sign-up"
        secondaryBtnText="Sign In"
        secondaryBtnHref="/auth/sign-in"
      />
    </div>
  );
}
