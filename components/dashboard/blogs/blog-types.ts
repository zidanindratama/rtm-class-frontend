export type BlogDetailResponse = {
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

export type CreateBlogPayload = {
  title: string;
  content: string;
  slug?: string;
  excerpt?: string;
  isPublished?: boolean;
};

export type SortByOption = "all" | "createdAt" | "publishedAt" | "title";
export type SortOrderOption = "all" | "asc" | "desc";
export type PublishedFilterOption = "all" | "true" | "false";

export type UpdateBlogPayload = Partial<CreateBlogPayload>;
