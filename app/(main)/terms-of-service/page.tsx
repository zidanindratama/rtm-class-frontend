import { LegalPageContent } from "@/components/main/legal/legal-page-content";
import { termsOfServiceContent } from "@/lib/mock-legal-content";

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <LegalPageContent document={termsOfServiceContent} />
    </div>
  );
}
