const workflow = [
  {
    step: "01",
    title: "Initialize Class Context",
    description:
      "Set up class details, members, and role access so your team can run a consistent learning flow.",
  },
  {
    step: "02",
    title: "Deliver Learning Activities",
    description:
      "Publish assignments, materials, forum threads, and blog updates through dedicated role-aware interfaces.",
  },
  {
    step: "03",
    title: "Engage and Evaluate",
    description:
      "Track student submissions, score results, and class participation while keeping discussion and feedback centralized.",
  },
  {
    step: "04",
    title: "Scale With AI Assistance",
    description:
      "Generate supporting learning content from source material to speed up preparation cycles across classes.",
  },
];

export function FeatureWorkflow() {
  return (
    <section className="border-y border-border/35 bg-muted/15 px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Workflow Depth
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            Built for real operations, not single-click demos.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            Each stage is designed so schools can run daily operations with
            clearer ownership, faster execution, and measurable outcomes.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {workflow.map((item) => (
            <article
              key={item.step}
              className="rounded-3xl border border-border/45 bg-background/70 p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Step {item.step}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
