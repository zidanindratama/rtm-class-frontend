const lanes = [
  {
    lane: "Content Team",
    focus: "Defines learning goals and prompt constraints.",
    tasks: [
      "Choose source files and objective tags",
      "Set generation scope and question mix",
      "Review first-pass output quality",
    ],
  },
  {
    lane: "Platform Team",
    focus: "Maintains stability, queue health, and processing throughput.",
    tasks: [
      "Monitor asynchronous job lifecycle",
      "Handle retries and fallback behavior",
      "Tune queue and worker performance",
    ],
  },
  {
    lane: "Quality Team",
    focus: "Enforces consistency before content reaches classrooms.",
    tasks: [
      "Run rubric and factual checks",
      "Validate readability and instruction clarity",
      "Approve or return content for revision",
    ],
  },
];

export function WorkflowOperatingLanes() {
  return (
    <section className="border-y border-border/35 bg-muted/15 px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Operating Lanes
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
          Each team has a clear role inside the workflow.
        </h2>

        <div className="mt-8 space-y-4">
          {lanes.map((lane) => (
            <article
              key={lane.lane}
              className="grid gap-5 rounded-3xl border border-border/45 bg-background/70 p-6 md:grid-cols-[260px_1fr_1fr]"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Lane
                </p>
                <h3 className="mt-2 text-xl font-semibold text-foreground">
                  {lane.lane}
                </h3>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {lane.focus}
              </p>

              <ul className="space-y-2">
                {lane.tasks.map((task) => (
                  <li key={task} className="text-sm text-muted-foreground">
                    {task}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
