import { UtilPagesHero } from "@/components/main/util-pages/util-pages-hero";
import { UtilPagesGrid } from "@/components/main/util-pages/util-pages-grid";

export default function UtilPagesPage() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <UtilPagesHero />
      <UtilPagesGrid />
    </div>
  );
}
