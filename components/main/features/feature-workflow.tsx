const workflow = [
  {
    step: "01",
    title: "Upload and Configure",
    description:
      "Upload PDF, PPTX, or TXT files, then choose output mode, question type, and quality profile.",
  },
  {
    step: "02",
    title: "Asynchronous Processing",
    description:
      "RTM Class processes tasks in the background so your UI remains responsive while heavy generation runs.",
  },
  {
    step: "03",
    title: "Review and Approve",
    description:
      "Generated outputs pass through a review layer where teams can edit, validate, and approve content.",
  },
  {
    step: "04",
    title: "Deliver to Systems",
    description:
      "Final results are pushed to your connected destination through callbacks or internal workflows.",
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
            Each stage is designed for high-throughput teams that need control,
            traceability, and repeatable output quality.
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
