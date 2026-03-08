import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import { getMockBlogById } from "@/lib/mock-blogs";

type BlogDetailHeroProps = {
  id: string;
};

export function BlogDetailHero({ id }: BlogDetailHeroProps) {
  const blog = getMockBlogById(id);

  if (!blog) {
    return (
      <section className="px-4 pb-12 pt-28 md:px-8 md:pt-34">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border/50 bg-card/70 p-8 text-center md:p-12">
          <p className="text-sm uppercase tracking-[0.18em] text-primary">
            Article Not Found
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            We could not find this blog post.
          </h1>
          <Link
            href="/blogs"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blogs
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden border-b border-border/40 px-4 pb-12 pt-28 md:px-8 md:pb-16 md:pt-34">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,hsl(var(--primary)/0.14),transparent_35%)]" />

      <div className="mx-auto max-w-4xl">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all blogs
        </Link>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {blog.category}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-6xl">
          {blog.title}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
          {blog.excerpt}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {blog.publishedAt}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock3 className="h-4 w-4" />
            {blog.readTime}
          </span>
          <span>By {blog.author}</span>
        </div>
      </div>
    </section>
  );
}
