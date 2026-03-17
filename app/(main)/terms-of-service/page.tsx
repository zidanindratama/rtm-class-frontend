import { LegalPageContent } from "@/components/main/legal/legal-page-content";
import { termsOfServiceContent } from "@/lib/mock-legal-content";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service",
  description:
    "Review the terms and conditions for using RTM Class services and applications.",
  path: "/terms-of-service",
});

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <LegalPageContent document={termsOfServiceContent} />
    </div>
  );
}
