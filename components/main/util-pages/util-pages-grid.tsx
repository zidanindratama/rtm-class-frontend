import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { mockUtilPages } from "@/lib/mock-util-pages";

export function UtilPagesGrid() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockUtilPages.map((page) => (
          <article
            key={page.id}
            className="group flex h-full flex-col rounded-3xl border border-border/45 bg-card/65 p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/10"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-primary">
              {page.statusCode}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
              {page.name}
            </h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              {page.summary}
            </p>

            <Link
              href={`/util-pages/${page.id}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary"
            >
              Open page
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
