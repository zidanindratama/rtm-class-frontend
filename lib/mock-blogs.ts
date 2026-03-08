export type BlogSection = {
  title: string;
  paragraphs: string[];
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  author: string;
  tags: string[];
  sections: BlogSection[];
};

export const mockBlogs: BlogPost[] = [
  {
    id: "designing-calm-ai-learning-flow",
    title: "Designing A Calm AI Learning Flow For Busy Educators",
    excerpt:
      "A practical framework for reducing cognitive noise in AI-assisted lesson generation without sacrificing quality.",
    category: "Product Design",
    publishedAt: "March 1, 2026",
    readTime: "7 min read",
    author: "RTM Product Team",
    tags: ["ux", "education", "ai-workflow"],
    sections: [
      {
        title: "The Cost Of Interface Noise",
        paragraphs: [
          "Most teachers do not struggle with capability. They struggle with context switching. If a flow asks for too many decisions too early, the system feels powerful but exhausting.",
          "A calmer AI workflow limits branching at the first touchpoint. The user should always understand what the next action is and what output quality to expect.",
        ],
      },
      {
        title: "Progressive Prompting",
        paragraphs: [
          "Instead of exposing all knobs upfront, progressive prompting reveals deeper controls only after the first result. This keeps first-run interactions fast and understandable.",
          "In our internal tests, users who received a structured prompt progression completed worksheet generation faster and edited less.",
        ],
      },
      {
        title: "Design Heuristics You Can Reuse",
        paragraphs: [
          "Use one primary action per screen, show confidence level for generated output, and provide a lightweight review checklist before publishing.",
          "These patterns work because they reduce uncertainty. When uncertainty drops, adoption rises.",
        ],
      },
    ],
  },
  {
    id: "from-document-to-worksheet-in-minutes",
    title: "From Document To Worksheet In Minutes: A Practical Pipeline",
    excerpt:
      "How to structure your content pipeline so AI output stays consistent across subjects, levels, and curriculum standards.",
    category: "Engineering",
    publishedAt: "February 22, 2026",
    readTime: "9 min read",
    author: "Platform Engineering",
    tags: ["pipeline", "rag", "content-generation"],
    sections: [
      {
        title: "Start With Clean Inputs",
        paragraphs: [
          "Your prompt quality will never outperform your source quality. Before generation, normalize headings, remove duplicated blocks, and enforce metadata tags.",
          "Simple preprocessing can improve retrieval relevance and reduce hallucination inside downstream tasks.",
        ],
      },
      {
        title: "Stabilize Output Through Templates",
        paragraphs: [
          "Templates are not about limiting creativity. They are about guaranteeing structure. Define expected sections, difficulty distribution, and answer-key formatting.",
          "With stable templates, reviewers focus on pedagogical quality rather than formatting corrections.",
        ],
      },
      {
        title: "Close The Loop With Evaluation",
        paragraphs: [
          "Add quick checks such as language level, rubric alignment, and concept coverage before delivery. Evaluation should happen automatically where possible.",
          "The result is a predictable pipeline that scales with teachers, not against them.",
        ],
      },
    ],
  },
  {
    id: "operational-playbook-for-school-ai-rollout",
    title: "Operational Playbook For Rolling Out AI In Schools",
    excerpt:
      "A field-tested rollout plan covering stakeholder onboarding, quality governance, and day-one implementation metrics.",
    category: "Operations",
    publishedAt: "February 10, 2026",
    readTime: "8 min read",
    author: "Education Success Team",
    tags: ["operations", "adoption", "governance"],
    sections: [
      {
        title: "Map Stakeholders Early",
        paragraphs: [
          "Successful rollout starts with role clarity: school leaders set policy, teachers shape classroom usage, and IT ensures integration continuity.",
          "When ownership is explicit, training sessions become actionable instead of generic.",
        ],
      },
      {
        title: "Define Quality Guardrails",
        paragraphs: [
          "Create a short quality rubric that teams can run in under five minutes. Include factual validity, instructional clarity, and curriculum alignment.",
          "Guardrails should be specific enough for consistency but lightweight enough for daily use.",
        ],
      },
      {
        title: "Track Adoption Signals",
        paragraphs: [
          "Measure weekly active educators, generation-to-publish ratio, and average revision count. These metrics reveal friction faster than broad satisfaction surveys.",
          "A strong rollout is not measured by launch day excitement. It is measured by consistent usage in week four.",
        ],
      },
    ],
  },
  {
    id: "teaching-with-ai-without-losing-your-voice",
    title: "Teaching With AI Without Losing Your Voice",
    excerpt:
      "How educators can keep instructional identity while delegating repetitive drafting work to generative tools.",
    category: "Teaching",
    publishedAt: "January 29, 2026",
    readTime: "6 min read",
    author: "Learning Design Team",
    tags: ["teaching", "prompting", "best-practices"],
    sections: [
      {
        title: "AI As Draft Partner",
        paragraphs: [
          "Use AI to generate first drafts quickly, then refine tone and pedagogy with your own classroom context.",
          "The fastest teams treat AI output as a proposal, not as a final artifact.",
        ],
      },
      {
        title: "Protect Your Teaching Style",
        paragraphs: [
          "Save example prompts that encode your style rules so each generation starts in your preferred voice.",
          "Consistency comes from reusable constraints, not from manual rewrites every time.",
        ],
      },
    ],
  },
  {
    id: "quality-checks-that-catch-hallucinations-early",
    title: "Quality Checks That Catch Hallucinations Early",
    excerpt:
      "A practical QA checklist to identify factual drift and citation gaps before AI-generated content reaches students.",
    category: "Quality",
    publishedAt: "January 20, 2026",
    readTime: "5 min read",
    author: "Academic QA",
    tags: ["quality", "fact-checking", "evaluation"],
    sections: [
      {
        title: "Where Errors Usually Hide",
        paragraphs: [
          "Hallucinations often appear in specific numbers, historical dates, and references that look plausible but lack sources.",
          "A focused review pass on these fields catches most critical errors fast.",
        ],
      },
      {
        title: "Fast Validation Workflow",
        paragraphs: [
          "Require at least one sourceable evidence point for each key statement in a worksheet.",
          "If evidence is missing, flag the item for regeneration with tighter prompt constraints.",
        ],
      },
    ],
  },
  {
    id: "building-a-school-ready-ai-governance-model",
    title: "Building A School-Ready AI Governance Model",
    excerpt:
      "A lightweight governance blueprint for institutions adopting AI content workflows at scale.",
    category: "Operations",
    publishedAt: "January 13, 2026",
    readTime: "10 min read",
    author: "Policy and Compliance",
    tags: ["governance", "policy", "operations"],
    sections: [
      {
        title: "Define Risk Levels",
        paragraphs: [
          "Classify content by risk so teams know which outputs need manual review and which can be auto-published.",
          "Risk-based workflows keep quality high without slowing every request.",
        ],
      },
      {
        title: "Operational Ownership",
        paragraphs: [
          "Assign policy maintenance, tool administration, and audit response to named roles.",
          "Governance fails when accountability is diffuse.",
        ],
      },
    ],
  },
  {
    id: "prompt-patterns-for-better-assessment-items",
    title: "Prompt Patterns For Better Assessment Items",
    excerpt:
      "Reusable prompt structures for producing diverse, curriculum-aligned assessments in less time.",
    category: "Teaching",
    publishedAt: "January 5, 2026",
    readTime: "7 min read",
    author: "Pedagogy Lab",
    tags: ["assessment", "prompting", "curriculum"],
    sections: [
      {
        title: "Constrain Before You Expand",
        paragraphs: [
          "Start with clear learning objectives and difficulty tiers before asking for item variations.",
          "Constraint-first prompting improves coherence across the full assessment set.",
        ],
      },
      {
        title: "Variation Without Drift",
        paragraphs: [
          "Ask for changes in context and phrasing while preserving target competency and cognitive level.",
          "This produces variety without diluting assessment intent.",
        ],
      },
    ],
  },
  {
    id: "faster-feedback-loops-for-instructional-teams",
    title: "Faster Feedback Loops For Instructional Teams",
    excerpt:
      "How to shorten review cycles between content creators, reviewers, and school coordinators.",
    category: "Engineering",
    publishedAt: "December 22, 2025",
    readTime: "6 min read",
    author: "Workflow Systems",
    tags: ["workflow", "collaboration", "review"],
    sections: [
      {
        title: "Design For Parallel Review",
        paragraphs: [
          "Split review into pedagogy, language, and compliance tracks that can run at the same time.",
          "Parallel review reduces lead time significantly without reducing rigor.",
        ],
      },
      {
        title: "Use Structured Feedback",
        paragraphs: [
          "Require reviewers to tag each note as factual, stylistic, or alignment-related.",
          "Structured feedback speeds up revision and avoids repeated misunderstandings.",
        ],
      },
    ],
  },
  {
    id: "minimal-ui-principles-for-education-platforms",
    title: "Minimal UI Principles For Education Platforms",
    excerpt:
      "A visual and interaction checklist for teams aiming to ship calmer interfaces for teachers.",
    category: "Product Design",
    publishedAt: "December 14, 2025",
    readTime: "8 min read",
    author: "Design Systems",
    tags: ["design-system", "ux", "accessibility"],
    sections: [
      {
        title: "Reduce Decision Load",
        paragraphs: [
          "Every screen should have one dominant action and one clear exit path.",
          "When users know what to do next, confidence increases and error rates drop.",
        ],
      },
      {
        title: "Visual Rhythm Matters",
        paragraphs: [
          "Use consistent spacing, restrained color accents, and predictable typography scales.",
          "Minimal interfaces feel premium when rhythm is consistent across sections.",
        ],
      },
    ],
  },
  {
    id: "what-we-learned-from-1000-generated-worksheets",
    title: "What We Learned From 1000 Generated Worksheets",
    excerpt:
      "A data-backed summary of common failure modes, success patterns, and optimization opportunities.",
    category: "Research",
    publishedAt: "December 2, 2025",
    readTime: "11 min read",
    author: "Applied Research",
    tags: ["research", "evaluation", "dataset"],
    sections: [
      {
        title: "Patterns In Strong Outputs",
        paragraphs: [
          "High-quality worksheets had explicit objectives, age-appropriate language, and consistent answer key formatting.",
          "These features can be encoded as pre-generation checks.",
        ],
      },
      {
        title: "Frequent Failure Modes",
        paragraphs: [
          "Weak outputs commonly lacked context alignment and included ambiguous instructions.",
          "Adding context constraints and acceptance tests reduced these failures over time.",
        ],
      },
    ],
  },
];

export function getMockBlogById(id: string) {
  return mockBlogs.find((blog) => blog.id === id);
}
