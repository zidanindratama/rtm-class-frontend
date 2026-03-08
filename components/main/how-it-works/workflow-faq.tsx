const workflowFaq = [
  {
    question: "Is the workflow synchronous or asynchronous?",
    answer:
      "Job processing is asynchronous. The API acknowledges requests first, then generation continues in the background.",
  },
  {
    question: "Can we add review before release?",
    answer:
      "Yes. The validation stage is designed so teams can review, revise, and approve before final delivery.",
  },
  {
    question: "Can this fit enterprise operations?",
    answer:
      "Yes. The flow supports role-based lanes, monitoring, and controlled release practices for larger teams.",
  },
];

export function WorkflowFaq() {
  return (
    <section className="border-t border-border/35 px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Workflow FAQ
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
          Practical questions about implementation flow.
        </h2>

        <div className="mt-8 space-y-4">
          {workflowFaq.map((item) => (
            <article
              key={item.question}
              className="rounded-3xl border border-border/45 bg-card/65 p-6"
            >
              <h3 className="text-lg font-semibold text-foreground">
                {item.question}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
