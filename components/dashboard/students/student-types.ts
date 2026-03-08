export type StudentProfile = {
  id: string;
  address: string | null;
  phoneNumber: string | null;
  pictureUrl: string | null;
};

export type StudentUser = {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  isSuspended: boolean;
  profile: StudentProfile | null;
  createdAt: string;
  updatedAt: string;
};

export type UserListMeta = {
  current_page: number;
  total_pages: number;
  total_items: number;
};

export type UsersListResponse = {
  message: string;
  data: StudentUser[];
  meta: UserListMeta | null;
  error: unknown;
};

export type UserDetailResponse = {
  message: string;
  data: StudentUser;
  meta: unknown;
  error: unknown;
};

export type CreateStudentPayload = {
  fullName: string;
  email: string;
  password: string;
  role: "STUDENT";
};

export type UpdateStudentPayload = {
  fullName?: string;
  email?: string;
  isSuspended?: boolean;
};
