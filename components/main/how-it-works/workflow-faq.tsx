const workflowFaq = [
  {
    question: "Can this workflow support multiple classes at once?",
    answer:
      "Yes. RTM Class is designed so teams can manage several classes with clear structure and repeatable processes.",
  },
  {
    question: "Does the flow include grading and feedback loops?",
    answer:
      "Yes. Assignment submission, grading, and recap workflows are integrated so evaluation stays close to delivery.",
  },
  {
    question: "Can we combine collaboration and publishing in this flow?",
    answer:
      "Yes. Class forums and blog publishing are part of the same operational ecosystem.",
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
          Practical questions about day-to-day execution.
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
