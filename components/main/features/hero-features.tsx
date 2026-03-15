export function HeroFeatures() {
  return (
    <section className="relative overflow-hidden border-b border-border/40 px-4 pb-16 pt-28 md:px-8 md:pb-20 md:pt-34">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,hsl(var(--primary)/0.16),transparent_35%),radial-gradient(circle_at_82%_75%,hsl(var(--primary)/0.08),transparent_38%)]" />

      <div className="mx-auto max-w-5xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Product Features
        </p>
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          Core capabilities designed for complete learning operations.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Explore how RTM Class supports class management, assignment delivery,
          collaboration, publishing, and AI-assisted content workflows.
        </p>
      </div>
    </section>
  );
}
