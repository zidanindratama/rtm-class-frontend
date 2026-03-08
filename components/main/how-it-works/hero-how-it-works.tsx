export function HeroHowItWorks() {
  return (
    <section className="relative overflow-hidden border-b border-border/40 px-4 pb-16 pt-28 md:px-8 md:pb-20 md:pt-34">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_22%_14%,hsl(var(--primary)/0.16),transparent_35%),radial-gradient(circle_at_78%_80%,hsl(var(--primary)/0.08),transparent_38%)]" />

      <div className="mx-auto max-w-5xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Workflow
        </p>
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          Understand the end-to-end delivery flow in three steps.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          From document upload to asynchronous processing and webhook delivery,
          this flow is designed to keep product experience fast and reliable.
        </p>
      </div>
    </section>
  );
}
