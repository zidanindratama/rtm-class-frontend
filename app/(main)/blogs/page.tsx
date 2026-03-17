import { BlogsHero } from "@/components/main/blogs/blogs-hero";
import { BlogsGrid } from "@/components/main/blogs/blogs-grid";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Blogs",
  description:
    "Read practical guides on AI-assisted teaching, classroom operations, and education workflows.",
  path: "/blogs",
  keywords: ["education blog", "ai teaching blog", "rtm class articles"],
});

export default function BlogsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <BlogsHero />
      <BlogsGrid />
    </div>
  );
}
