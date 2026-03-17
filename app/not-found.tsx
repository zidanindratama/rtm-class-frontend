import { UtilPageDetail } from "@/components/main/util-pages/util-page-detail";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Page Not Found",
  description: "The page you requested could not be found on RTM Class.",
  path: "/404",
  noIndex: true,
});

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <UtilPageDetail id="not-found" />
    </div>
  );
}
