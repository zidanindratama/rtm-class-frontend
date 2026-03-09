"use client";

import Link from "next/link";
import { useGetData } from "@/hooks/use-get-data";
import { APIListResponse, APISingleResponse } from "@/types/api-response";
import { PublicBlogPost } from "./blog-public-types";
import { BlogCommentsSection } from "./blog-comments-section";

type BlogDetailContentProps = {
  id: string;
};

export function BlogDetailContent({ id }: BlogDetailContentProps) {
  const { data: detailResponse } = useGetData<APISingleResponse<PublicBlogPost>>({
    key: ["public", "blog-detail", id],
    endpoint: `/blogs/${id}`,
    extractData: false,
    errorMessage: "Failed to load blog detail.",
  });

  const { data: relatedResponse } = useGetData<APIListResponse<PublicBlogPost>>({
    key: ["public", "blogs", "related", id],
    endpoint: "/blogs",
    extractData: false,
    params: {
      page: 1,
      per_page: 4,
      sort_by: "publishedAt",
      sort_order: "desc",
    },
    errorMessage: "Failed to load related blogs.",
  });

  const blog = detailResponse?.data;
  if (!blog) {
    return null;
  }

  const relatedBlogs = (relatedResponse?.data ?? [])
    .filter((item) => item.slug !== id)
    .slice(0, 2);

  return (
    <section className="px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <article className="rounded-3xl border border-border/45 bg-card/65 p-7 md:p-10">
            <div
              className="blog-rich-text text-base leading-relaxed text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>

          <BlogCommentsSection slug={id} />
        </div>

        <aside className="h-fit rounded-3xl border border-border/45 bg-card/65 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Related Reads
          </p>
          <div className="mt-4 space-y-5">
            {relatedBlogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No related articles yet.</p>
            ) : (
              relatedBlogs.map((item) => (
                <Link
                  key={item.id}
                  href={`/blogs/${item.slug}`}
                  className="block rounded-2xl border border-border/40 p-4 transition-colors hover:border-primary/35"
                >
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {item.excerpt?.trim() || "No excerpt available."}
                  </p>
                </Link>
              ))
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
