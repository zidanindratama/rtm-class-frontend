import Link from "next/link";
import { getMockBlogById, mockBlogs } from "@/lib/mock-blogs";

type BlogDetailContentProps = {
  id: string;
};

export function BlogDetailContent({ id }: BlogDetailContentProps) {
  const blog = getMockBlogById(id);

  if (!blog) {
    return null;
  }

  const relatedBlogs = mockBlogs.filter((item) => item.id !== id).slice(0, 2);

  return (
    <section className="px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="rounded-3xl border border-border/45 bg-card/65 p-7 md:p-10">
          <div className="space-y-10">
            {blog.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-base leading-relaxed text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>

        <aside className="h-fit rounded-3xl border border-border/45 bg-card/65 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Related Reads
          </p>
          <div className="mt-4 space-y-5">
            {relatedBlogs.map((item) => (
              <Link
                key={item.id}
                href={`/blogs/${item.id}`}
                className="block rounded-2xl border border-border/40 p-4 transition-colors hover:border-primary/35"
              >
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="mt-2 text-xs text-muted-foreground">{item.readTime}</p>
              </Link>
            ))}
          </div>

          <div className="mt-7 border-t border-border/45 pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Tags
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/50 px-3 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
