import { LegalPageContent } from "@/components/main/legal/legal-page-content";
import { cookiePolicyContent } from "@/lib/mock-legal-content";

export default function CookiePolicyPage() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <LegalPageContent document={cookiePolicyContent} />
    </div>
  );
}
