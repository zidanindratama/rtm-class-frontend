const faqItems = [
  {
    question: "Can RTM Class support multiple roles in one institution?",
    answer:
      "Yes. The platform supports role-based workflows for admins, teachers, and students with tailored access paths.",
  },
  {
    question: "Can we manage classes and assignments in one system?",
    answer:
      "Yes. Class setup, assignment operations, submissions, grading, and progress tracking are handled in one connected dashboard flow.",
  },
  {
    question: "Does it include collaboration and publishing features?",
    answer:
      "Yes. RTM Class includes class forums, public blog publishing, and legal content pages for institutional communication.",
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
          Common questions from schools and implementation teams.
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
