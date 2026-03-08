export type ArticleStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type Article = {
  id: string;
  title: string;
  author: string;
  category: string;
  status: ArticleStatus;
  publishedAt: string;
};

export const mockArticles: Article[] = [
  {
    id: "ART-001",
    title: "Designing Better Quiz Prompts with AI",
    author: "Teacher One",
    category: "Pedagogy",
    status: "PUBLISHED",
    publishedAt: "2026-03-01",
  },
  {
    id: "ART-002",
    title: "How to Review Essay Responses Faster",
    author: "Teacher Two",
    category: "Assessment",
    status: "DRAFT",
    publishedAt: "2026-03-03",
  },
  {
    id: "ART-003",
    title: "Student-Centered Rubrics in Modern Classes",
    author: "Teacher Three",
    category: "Rubrics",
    status: "ARCHIVED",
    publishedAt: "2026-02-18",
  },
  {
    id: "ART-004",
    title: "Using Learning Analytics Without Bias",
    author: "Teacher One",
    category: "Analytics",
    status: "PUBLISHED",
    publishedAt: "2026-02-25",
  },
  {
    id: "ART-005",
    title: "Practical Workflow for Weekly Material Planning",
    author: "Teacher Four",
    category: "Operations",
    status: "DRAFT",
    publishedAt: "2026-03-05",
  },
];
