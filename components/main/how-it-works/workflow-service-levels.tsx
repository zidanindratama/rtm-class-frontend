const serviceLevels = [
  {
    metric: "3 Roles",
    label: "Admin, Teacher, Student experience",
    detail:
      "Each role gets a focused workspace so operations stay efficient and responsibilities stay clear.",
  },
  {
    metric: "1 Workspace",
    label: "Unified operational flow",
    detail:
      "Class setup, assignments, discussions, publishing, and profile operations live in one connected platform.",
  },
  {
    metric: "Continuous",
    label: "Iteration-ready delivery cycle",
    detail:
      "Teams can continuously review outcomes, apply feedback, and improve learning delivery over time.",
  },
];

export function WorkflowServiceLevels() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Service Behavior
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          Clear expectations for operational execution.
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {serviceLevels.map((item) => (
            <article
              key={item.metric}
              className="rounded-3xl border border-border/45 bg-card/65 p-6"
            >
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {item.metric}
              </p>
              <p className="mt-2 text-sm font-medium text-primary">{item.label}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
