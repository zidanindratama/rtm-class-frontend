const governanceItems = [
  {
    title: "Permission Controls",
    description:
      "Define who can upload, generate, review, and publish content based on role and responsibility.",
  },
  {
    title: "Review Workflow",
    description:
      "Add approval steps before content is distributed, reducing quality risk in production environments.",
  },
  {
    title: "Operational Visibility",
    description:
      "Track generation activity, output status, and revision flow so teams can identify bottlenecks quickly.",
  },
];

export function FeatureGovernance() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_1fr]">
        <article className="rounded-3xl border border-border/45 bg-card/65 p-7 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Governance
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Enterprise-ready controls for high-trust educational content.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            RTM Class is designed for teams that need both speed and oversight.
            Governance tools help maintain consistency, accountability, and
            release quality at scale.
          </p>
        </article>

        <div className="space-y-4">
          {governanceItems.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-border/45 bg-card/65 p-6"
            >
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
