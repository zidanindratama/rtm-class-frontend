import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getMockUtilPageById } from "@/lib/mock-util-pages";

type UtilPageDetailProps = {
  id: string;
};

export function UtilPageDetail({ id }: UtilPageDetailProps) {
  const page = getMockUtilPageById(id);

  if (!page) {
    return (
      <section className="px-4 pb-12 pt-28 md:px-8 md:pt-34">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border/45 bg-card/70 p-8 text-center md:p-12">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">
            Invalid Utility Page
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            This utility page does not exist.
          </h1>
          <div className="mt-8 space-y-3">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border/60 px-6 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to landing page
            </Link>
            <p className="text-xs text-muted-foreground">
              Looking for another utility page?{" "}
              <Link
                href="/util-pages"
                className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
              >
                Browse utility index
              </Link>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-28 md:px-8 md:pb-20 md:pt-34">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,hsl(var(--primary)/0.16),transparent_34%)]" />

      <div className="mx-auto max-w-4xl rounded-3xl border border-border/50 bg-card/70 p-8 md:p-12">
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border/60 px-5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to landing page
          </Link>
          <p className="text-xs text-muted-foreground">
            Need another page?{" "}
            <Link
              href="/util-pages"
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
            >
              Browse utility index
            </Link>
          </p>
        </div>

        <p className="mt-8 text-xs uppercase tracking-[0.2em] text-primary">
          {page.eyebrow}
        </p>
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          Status {page.statusCode}
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          {page.title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {page.description}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href={page.primaryCtaHref}
            className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {page.primaryCtaLabel}
          </Link>
          <Link
            href={page.secondaryCtaHref}
            className="inline-flex h-11 items-center rounded-full border border-border/60 px-6 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
          >
            {page.secondaryCtaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
