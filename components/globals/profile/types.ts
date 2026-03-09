export type UserProfile = {
  id: string;
  address: string | null;
  phoneNumber: string | null;
  pictureUrl: string | null;
};

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isSuspended: boolean;
  profile: UserProfile;
  createdAt: string;
  updatedAt: string;
};