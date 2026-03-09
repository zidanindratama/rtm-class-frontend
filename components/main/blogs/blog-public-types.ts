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

export type PublicBlogCommentAuthor = {
  id: string;
  fullName: string;
  email: string;
};

export type PublicBlogCommentReply = {
  id: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: PublicBlogCommentAuthor;
};

export type PublicBlogComment = {
  id: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: PublicBlogCommentAuthor;
  replies: PublicBlogCommentReply[];
};

export type PublicBlogCommentsResponse = {
  message: string;
  data: {
    post: {
      id: string;
      slug: string;
      title: string;
    };
    comments: PublicBlogComment[];
  };
  meta: {
    current_page: number;
    total_pages: number;
    total_items: number;
  } | null;
  error: unknown | null;
};
