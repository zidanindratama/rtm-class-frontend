export type AdminProfile = {
  id: string;
  address: string | null;
  phoneNumber: string | null;
  pictureUrl: string | null;
};

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  isSuspended: boolean;
  profile: AdminProfile | null;
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
  data: AdminUser[];
  meta: UserListMeta | null;
  error: unknown;
};

export type UserDetailResponse = {
  message: string;
  data: AdminUser;
  meta: unknown;
  error: unknown;
};

export type CreateAdminPayload = {
  fullName: string;
  email: string;
  password: string;
  role: "ADMIN";
};

export type UpdateAdminPayload = {
  fullName?: string;
  email?: string;
  isSuspended?: boolean;
};
