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

export type UpdateBlogPayload = Partial<CreateBlogPayload>;
