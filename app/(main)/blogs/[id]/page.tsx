import { BlogDetailHero } from "@/components/main/blogs/blog-detail-hero";
import { BlogDetailContent } from "@/components/main/blogs/blog-detail-content";

type BlogDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <BlogDetailHero id={id} />
      <BlogDetailContent id={id} />
    </div>
  );
}
