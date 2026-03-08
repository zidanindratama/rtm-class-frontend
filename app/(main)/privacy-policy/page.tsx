import { LegalPageContent } from "@/components/main/legal/legal-page-content";
import { privacyPolicyContent } from "@/lib/mock-legal-content";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <LegalPageContent document={privacyPolicyContent} />
    </div>
  );
}
