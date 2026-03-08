export type TeacherProfile = {
  id: string;
  address: string | null;
  phoneNumber: string | null;
  pictureUrl: string | null;
};

export type TeacherUser = {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  isSuspended: boolean;
  profile: TeacherProfile | null;
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
  data: TeacherUser[];
  meta: UserListMeta | null;
  error: unknown;
};

export type UserDetailResponse = {
  message: string;
  data: TeacherUser;
  meta: unknown;
  error: unknown;
};

export type CreateTeacherPayload = {
  fullName: string;
  email: string;
  password: string;
  role: "TEACHER";
};

export type UpdateTeacherPayload = {
  fullName?: string;
  email?: string;
  isSuspended?: boolean;
};
