export type ForumAuthor = {
  id: string;
  fullName: string;
  email: string;
};

export type ForumThreadListItem = {
  id: string;
  classroomId: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: ForumAuthor;
  _count: {
    comments: number;
    upvotes: number;
  };
};

export type ForumThreadDetailComment = {
  id: string;
  threadId: string;
  authorId: string;
  parentId: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: ForumAuthor;
  upvoteCount: number;
  upvotedByMe: boolean;
  replies: ForumThreadDetailComment[];
};

export type ForumThreadDetail = {
  id: string;
  classroomId: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: ForumAuthor;
  classroom: {
    id: string;
    name: string;
    classCode: string;
  };
  upvoteCount: number;
  upvotedByMe: boolean;
  comments: ForumThreadDetailComment[];
};

export type ForumThreadFormPayload = {
  classId: string;
  title: string;
  content: string;
};
