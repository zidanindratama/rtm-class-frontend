const faqItems = [
  {
    question: "Can we customize generation rules for different subjects?",
    answer:
      "Yes. Prompt templates and output constraints can be configured per subject or team workflow.",
  },
  {
    question: "Does RTM Class support review before publication?",
    answer:
      "Yes. You can route generated content through reviewers before it is finalized or distributed.",
  },
  {
    question: "Can we use this for both worksheets and summaries?",
    answer:
      "Yes. The platform supports assessment generation and contextual summarization in one workflow.",
  },
];

export function FeatureFaq() {
  return (
    <section className="border-t border-border/35 px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Feature FAQ
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
          Common questions from product and curriculum teams.
        </h2>

        <div className="mt-8 space-y-4">
          {faqItems.map((item) => (
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
