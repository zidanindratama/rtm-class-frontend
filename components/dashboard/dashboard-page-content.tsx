type DashboardPageContentProps = {
  title: string;
  description: string;
};

export function DashboardPageContent({
  title,
  description,
}: DashboardPageContentProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-border/70 bg-card p-5">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border/70 bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Activity</p>
          <p className="mt-2 text-2xl font-semibold">248</p>
        </div>
        <div className="rounded-xl border border-border/70 bg-card p-4">
          <p className="text-sm text-muted-foreground">Pending Items</p>
          <p className="mt-2 text-2xl font-semibold">17</p>
        </div>
        <div className="rounded-xl border border-border/70 bg-card p-4">
          <p className="text-sm text-muted-foreground">Completion Rate</p>
          <p className="mt-2 text-2xl font-semibold">92%</p>
        </div>
      </div>
    </section>
  );
}
