export type AdminBlogAuthor = {
  id: string;
  fullName: string;
  email: string;
};

export type AdminBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: AdminBlogAuthor;
};

 

 

export const mockAdminBlogs: AdminBlogPost[] = [
  {
    id: "1c5fba4e-92c3-4d41-8c9c-1a2a8f000001",
    title: "Designing AI Workflows For Modern Classrooms",
    slug: "designing-ai-workflows-for-modern-classrooms",
    excerpt:
      "A practical overview of how educators can integrate AI tools into everyday classroom workflows. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore cum cupiditate optio accusamus sit, enim consequuntur consectetur nostrum vitae amet, odio porro reprehenderit. Alias quos voluptatem corrupti omnis ea modi ex. Quos!",
    content: `Artificial intelligence is becoming a powerful assistant in education. 
Teachers can now generate lesson materials, worksheets, and assessments faster than ever before.

However, the key challenge is designing workflows that keep educators in control. AI should support teachers rather than replace their decision making.

By structuring prompts and review steps carefully, schools can ensure generated materials stay aligned with curriculum standards.`,
    isPublished: true,
    publishedAt: "2025-06-12T10:21:15.000Z",
    createdAt: "2026-03-04T12:53:50.451Z",
    updatedAt: "2026-03-05T10:11:10.000Z",
    authorId: "admin-001",
    author: {
      id: "admin-001",
      fullName: "Alec Beer",
      email: "admin.1@rtmclass.test",
    },
  },
  {
    id: "c2e3b8ab-8823-44d9-9a2c-1a2a8f000002",
    title: "Improving Worksheet Quality With Prompt Templates",
    slug: "improving-worksheet-quality-with-prompt-templates",
    excerpt:
      "Reusable prompt templates help teachers generate more consistent learning materials. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore cum cupiditate optio accusamus sit, enim consequuntur consectetur nostrum vitae amet, odio porro reprehenderit. Alias quos voluptatem corrupti omnis ea modi ex. Quos!",
    content: `Prompt templates provide a structured way to communicate with AI systems.

Instead of writing a new prompt every time, teachers can define reusable formats that include learning objectives, difficulty levels, and expected outputs.

This approach dramatically reduces editing time and ensures worksheets follow consistent patterns.`,
    isPublished: true,
    publishedAt: "2025-07-02T09:40:22.000Z",
    createdAt: "2026-03-04T12:53:50.451Z",
    updatedAt: "2026-03-05T10:11:10.000Z",
    authorId: "teacher-002",
    author: {
      id: "teacher-002",
      fullName: "Misty Thiel Jr.",
      email: "teacher.9@rtmclass.test",
    },
  },
  {
    id: "8b4fd8b3-6f0c-4d4f-9f8c-1a2a8f000003",
    title: "Why Schools Need AI Governance Policies",
    slug: "why-schools-need-ai-governance-policies",
    excerpt:
      "Governance frameworks ensure AI tools are used responsibly across educational institutions. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore cum cupiditate optio accusamus sit, enim consequuntur consectetur nostrum vitae amet, odio porro reprehenderit. Alias quos voluptatem corrupti omnis ea modi ex. Quos!",
    content: `AI adoption in schools requires more than just new tools.

Institutions must define policies around data privacy, content validation, and teacher oversight.

A simple governance framework helps ensure AI-generated materials remain accurate, ethical, and aligned with educational standards.`,
    isPublished: true,
    publishedAt: "2025-05-21T14:10:00.000Z",
    createdAt: "2026-03-04T12:53:50.451Z",
    updatedAt: "2026-03-05T10:11:10.000Z",
    authorId: "admin-003",
    author: {
      id: "admin-003",
      fullName: "Queen Ward",
      email: "admin.3@rtmclass.test",
    },
  },
  {
    id: "72d8f4a4-6a45-4b0d-92a2-1a2a8f000004",
    title: "Reducing Teacher Workload With Smart Automation",
    slug: "reducing-teacher-workload-with-smart-automation",
    excerpt:
      "Automation tools can eliminate repetitive preparation tasks for educators. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore cum cupiditate optio accusamus sit, enim consequuntur consectetur nostrum vitae amet, odio porro reprehenderit. Alias quos voluptatem corrupti omnis ea modi ex. Quos!",
    content: `Teachers spend a large portion of their time preparing materials rather than teaching.

AI-powered automation can generate draft worksheets, quizzes, and answer keys automatically.

This allows educators to focus on what matters most: guiding students and improving learning outcomes.`,
    isPublished: true,
    publishedAt: "2025-08-01T11:10:11.000Z",
    createdAt: "2026-03-04T12:53:50.451Z",
    updatedAt: "2026-03-05T10:11:10.000Z",
    authorId: "teacher-001",
    author: {
      id: "teacher-001",
      fullName: "Ciara Stroman",
      email: "teacher.1@rtmclass.test",
    },
  },
  {
    id: "6baf5e21-6d23-4f6c-9a9b-1a2a8f000005",
    title: "Design Principles For Education Platforms",
    slug: "design-principles-for-education-platforms",
    excerpt:
      "Minimal interfaces help teachers focus on teaching rather than navigating complex software. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore cum cupiditate optio accusamus sit, enim consequuntur consectetur nostrum vitae amet, odio porro reprehenderit. Alias quos voluptatem corrupti omnis ea modi ex. Quos!",
    content: `Education platforms should prioritize clarity and simplicity.

A clean interface with clear actions helps teachers complete tasks faster and reduces cognitive load.

Good design is not about adding features, but about removing unnecessary complexity.`,
    isPublished: true,
    publishedAt: "2025-04-12T16:20:22.000Z",
    createdAt: "2026-03-04T12:53:50.451Z",
    updatedAt: "2026-03-05T10:11:10.000Z",
    authorId: "admin-002",
    author: {
      id: "admin-002",
      fullName: "Conrad Reinger",
      email: "admin.2@rtmclass.test",
    },
  },

  /* Draft posts */

  {
    id: "b50f5f2e-90e0-47e4-bc9a-1a2a8f000006",
    title: "Building A School Content Generation Pipeline",
    slug: "building-a-school-content-generation-pipeline",
    excerpt:
      "A structured pipeline ensures AI-generated materials remain accurate and useful. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore cum cupiditate optio accusamus sit, enim consequuntur consectetur nostrum vitae amet, odio porro reprehenderit. Alias quos voluptatem corrupti omnis ea modi ex. Quos!",
    content: `A content generation pipeline helps schools manage large volumes of educational materials.

The pipeline typically includes document ingestion, prompt generation, AI output, and review stages.

By designing this pipeline carefully, institutions can scale content production without sacrificing quality.`,
    isPublished: false,
    publishedAt: null,
    createdAt: "2026-03-04T12:53:50.451Z",
    updatedAt: "2026-03-04T12:53:50.451Z",
    authorId: "teacher-004",
    author: {
      id: "teacher-004",
      fullName: "Alexa Christiansen",
      email: "teacher.11@rtmclass.test",
    },
  },
  {
    id: "c9f6dcb8-bd7c-49b2-a73c-1a2a8f000007",
    title: "Future Trends In AI Assisted Education",
    slug: "future-trends-in-ai-assisted-education",
    excerpt:
      "Exploring how AI tools may reshape classrooms over the next decade. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore cum cupiditate optio accusamus sit, enim consequuntur consectetur nostrum vitae amet, odio porro reprehenderit. Alias quos voluptatem corrupti omnis ea modi ex. Quos!",
    content: `AI will likely become an invisible assistant inside educational workflows.

Teachers may rely on AI to analyze student performance data, suggest personalized exercises, and generate learning materials instantly.

The challenge will be maintaining the human connection that defines great teaching.`,
    isPublished: false,
    publishedAt: null,
    createdAt: "2026-03-04T12:53:50.451Z",
    updatedAt: "2026-03-04T12:53:50.451Z",
    authorId: "admin-001",
    author: {
      id: "admin-001",
      fullName: "Alec Beer",
      email: "admin.1@rtmclass.test",
    },
  },
];

export function getMockBlogAdminById(id: string) {
  return mockAdminBlogs.find((blog) => blog.id === id);
}