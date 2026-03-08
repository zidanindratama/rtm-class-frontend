export const ACCESS_TOKEN_KEY = "rtm_access_token";
export const REFRESH_TOKEN_KEY = "rtm_refresh_token";
export const USER_ROLE_KEY = "rtm_user_role";

export const AUTH_ROLES = ["ADMIN", "TEACHER", "STUDENT"] as const;

export type AuthRole = (typeof AUTH_ROLES)[number];

export const isAuthRole = (value: string | null | undefined): value is AuthRole =>
  Boolean(value && AUTH_ROLES.includes(value as AuthRole));
