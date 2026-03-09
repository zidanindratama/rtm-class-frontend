export type PublicBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: {
    id: string;
    fullName: string;
    email: string;
  } | null;
};

export type PublicBlogSortBy = "createdAt" | "publishedAt" | "title";
export type PublicBlogSortOrder = "asc" | "desc";
