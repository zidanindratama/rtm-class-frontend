const pipelineSteps = [
  {
    id: "A1",
    title: "Ingestion Gate",
    description:
      "Source files are uploaded and normalized before entering generation jobs.",
  },
  {
    id: "B2",
    title: "Instruction Layer",
    description:
      "Teams apply templates, output mode, difficulty targets, and curriculum scope.",
  },
  {
    id: "C3",
    title: "Generation Engine",
    description:
      "Asynchronous workers execute retrieval and generation while UI stays responsive.",
  },
  {
    id: "D4",
    title: "Validation Pass",
    description:
      "Outputs are checked for structure, clarity, and quality before release.",
  },
  {
    id: "E5",
    title: "Delivery Channel",
    description:
      "Approved results are delivered to callback endpoints or internal distribution flows.",
  },
];

export function WorkflowPipelineMap() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl rounded-3xl border border-border/50 bg-card/70 p-7 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Pipeline Map
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          A staged system designed for reliability at scale.
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {pipelineSteps.map((step, index) => (
            <article
              key={step.id}
              className="relative rounded-2xl border border-border/45 bg-background/80 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {step.id}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
              {index < pipelineSteps.length - 1 ? (
                <span className="pointer-events-none absolute -right-2 top-1/2 hidden h-[2px] w-4 -translate-y-1/2 bg-primary/60 md:block" />
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
