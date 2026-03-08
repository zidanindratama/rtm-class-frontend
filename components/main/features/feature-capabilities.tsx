import {
  Blocks,
  FileCheck2,
  FileQuestion,
  FileText,
  Sparkles,
} from "lucide-react";

const capabilities = [
  {
    icon: FileQuestion,
    title: "Assessment Generator",
    description:
      "Generate MCQ and essay sets from source documents with configurable volume, difficulty, and answer-key format.",
    points: [
      "Difficulty tiers per batch",
      "Automatic answer key output",
      "Curriculum-aligned prompt templates",
    ],
  },
  {
    icon: FileText,
    title: "Contextual Summarization",
    description:
      "Convert long PDF or slide content into concise teaching summaries with controllable length and tone.",
    points: [
      "Short, medium, and extended summary modes",
      "Topic-focused extraction prompts",
      "Classroom-ready recap structure",
    ],
  },
  {
    icon: Blocks,
    title: "Modular Prompt System",
    description:
      "Build reusable prompt modules so teams can standardize output quality across departments and grade levels.",
    points: [
      "Reusable prompt presets",
      "Role-based prompt editing",
      "Consistent output formatting",
    ],
  },
  {
    icon: FileCheck2,
    title: "Quality Control Layer",
    description:
      "Run output checks before publishing to reduce factual drift and maintain instructional consistency.",
    points: [
      "Rubric-based quality checks",
      "Fact-sensitive content flags",
      "Review and approval workflow",
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
