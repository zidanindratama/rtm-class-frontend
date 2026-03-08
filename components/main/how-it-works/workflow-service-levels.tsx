const serviceLevels = [
  {
    metric: "202 Accepted",
    label: "Immediate API acknowledgment",
    detail:
      "The system acknowledges intake quickly while background workers continue processing.",
  },
  {
    metric: "< 24h",
    label: "Support response target",
    detail:
      "Operational and integration questions are routed to the support lane with a defined response window.",
  },
  {
    metric: "5-15s",
    label: "Typical short-job processing window",
    detail:
      "For lighter source files, output can be generated and delivered in near-real-time conditions.",
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
          Clear expectations for performance and delivery.
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
