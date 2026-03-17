export function HeroHowItWorks() {
  return (
    <section className="relative overflow-hidden border-b border-border/40 px-4 pb-14 md:pb-20 pt-24 md:pt-34 md:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_22%_14%,hsl(var(--primary)/0.16),transparent_35%),radial-gradient(circle_at_78%_80%,hsl(var(--primary)/0.08),transparent_38%)]" />

      <div className="mx-auto max-w-5xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Workflow
        </p>
        <h1 className="max-w-4xl text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Understand the operational flow from setup to learning outcomes.
        </h1>
        <p className="mt-5 md:mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          From class preparation to assignments, collaboration, and evaluation,
          RTM Class keeps every stage connected in one platform.
        </p>
      </div>
    </section>
  );
}
