import {
  Blocks,
  FileCheck2,
  FileQuestion,
  FileText,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

const capabilities = [
  {
    icon: LayoutDashboard,
    title: "Role-Based Dashboard",
    description:
      "Separate experiences for admins, teachers, and students keep each workflow focused and easier to operate.",
    points: [
      "Admin, teacher, and student navigation",
      "Access control by role",
      "Centralized profile and account context",
    ],
  },
  {
    icon: FileQuestion,
    title: "Assignment Lifecycle",
    description:
      "Run complete assignment operations from drafting and publishing to submission review and grading.",
    points: [
      "Draft, publish, close, and delete actions",
      "Submission and grading workflow",
      "Class gradebook and progress recap",
    ],
  },
  {
    icon: Blocks,
    title: "Class Collaboration Stack",
    description:
      "Keep communication and content activity connected to each class context.",
    points: [
      "Class forums with replies and upvotes",
      "Members management per class",
      "Shared materials and class detail pages",
    ],
  },
  {
    icon: FileText,
    title: "Publishing and Knowledge Flow",
    description:
      "Publish institutional content through blog and legal pages to support communication and governance.",
    points: [
      "Public blog listing and article detail",
      "Admin blog CMS operations",
      "Structured legal and policy pages",
    ],
  },
  {
    icon: FileCheck2,
    title: "AI-Assisted Content Pipeline",
    description:
      "Generate MCQ, essay prompts, and summaries from learning material to accelerate content preparation.",
    points: [
      "Multiple output modes from one material",
      "Queue-based processing architecture",
      "Output storage and status tracking",
    ],
  },
];

export function FeatureCapabilities() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Core Modules
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            A complete feature stack for AI-assisted educational production.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {capabilities.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-border/50 bg-card/65 p-7 backdrop-blur-sm"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <ul className="mt-5 space-y-2">
                {item.points.map((point) => (
                  <li
                    key={point}
                    className="inline-flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {point}
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
