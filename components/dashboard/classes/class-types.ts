// types/class-types.ts
export type ClassDetailResponse = {
  id: string;
  name: string;
  classCode: string;
  institutionName?: string;
  classLevel?: string;
  academicYear?: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  teacher?: {
    id: string;
    fullName: string;
    email?: string;
  };
  _count?: {
    members: number;
    forumThreads: number;
  };
  memberCount?: number; // fallback based on your first JSON example
};

export type SortByOption = "all" | "createdAt" | "name" | "classCode";
export type SortOrderOption = "all" | "asc" | "desc";

export type CreateClassPayload = {
  name: string;
  institutionName?: string;
  classLevel?: string;
  academicYear?: string;
  description?: string;
};
