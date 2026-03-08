import Link from "next/link";

export function WorkflowCta() {
  return (
    <section className="px-4 pb-16 pt-4 md:px-8 md:pb-20">
      <div className="mx-auto max-w-6xl rounded-3xl border border-border/50 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.18),transparent_44%)] p-8 md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Next Action
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          Need help mapping this flow into your system?
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Our team can help you define queue strategy, review checkpoints, and
          rollout stages for your implementation.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/auth/sign-up"
            className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Create Account
          </Link>
          <Link
            href="/auth/sign-in"
            className="inline-flex h-11 items-center rounded-full border border-border/60 px-6 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
