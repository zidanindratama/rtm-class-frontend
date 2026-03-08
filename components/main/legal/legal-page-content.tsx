import { LegalDocument } from "@/lib/mock-legal-content";

type LegalPageContentProps = {
  document: LegalDocument;
};

export function LegalPageContent({ document }: LegalPageContentProps) {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-28 md:px-8 md:pb-20 md:pt-34">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_12%,hsl(var(--primary)/0.15),transparent_34%)]" />

      <div className="mx-auto max-w-4xl rounded-3xl border border-border/45 bg-card/70 p-8 md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Legal
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          {document.title}
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: {document.lastUpdated}
        </p>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
          {document.intro}
        </p>

        <div className="mt-10 space-y-8">
          {document.sections.map((section) => (
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
      </div>
    </section>
  );
}
