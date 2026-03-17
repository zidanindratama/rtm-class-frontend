import { UtilPagesHero } from "@/components/main/util-pages/util-pages-hero";
import { UtilPagesGrid } from "@/components/main/util-pages/util-pages-grid";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Utility Pages",
  description:
    "Browse utility states and fallback screens used across RTM Class frontend experiences.",
  path: "/util-pages",
  noIndex: true,
});

export default function UtilPagesPage() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <UtilPagesHero />
      <UtilPagesGrid />
    </div>
  );
}
