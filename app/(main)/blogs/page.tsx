import { BlogsHero } from "@/components/main/blogs/blogs-hero";
import { BlogsGrid } from "@/components/main/blogs/blogs-grid";

export default function BlogsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <BlogsHero />
      <BlogsGrid />
    </div>
  );
}
