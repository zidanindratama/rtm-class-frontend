import { BlogDetailHero } from "@/components/main/blogs/blog-detail-hero";
import { BlogDetailContent } from "@/components/main/blogs/blog-detail-content";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { getMockBlogById } from "@/lib/mock-blogs";

type BlogDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const blog = getMockBlogById(id);

  if (!blog) {
    return createPageMetadata({
      title: "Blog Not Found",
      description: "The requested blog article could not be found.",
      path: `/blogs/${id}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: blog.title,
    description: blog.excerpt,
    path: `/blogs/${blog.id}`,
    keywords: ["rtm class blog", blog.category, ...blog.tags],
    openGraphType: "article",
  });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <BlogDetailHero id={id} />
      <BlogDetailContent id={id} />
    </div>
  );
}
