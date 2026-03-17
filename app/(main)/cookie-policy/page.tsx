import { LegalPageContent } from "@/components/main/legal/legal-page-content";
import { cookiePolicyContent } from "@/lib/mock-legal-content";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Cookie Policy",
  description: "Learn how RTM Class uses cookies and similar technologies.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <LegalPageContent document={cookiePolicyContent} />
    </div>
  );
}
