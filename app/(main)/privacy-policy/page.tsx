import { LegalPageContent } from "@/components/main/legal/legal-page-content";
import { privacyPolicyContent } from "@/lib/mock-legal-content";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "Read how RTM Class collects, uses, and protects user data.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <LegalPageContent document={privacyPolicyContent} />
    </div>
  );
}
