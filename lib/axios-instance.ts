import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_ROLE_KEY, type AuthRole } from "@/routes/auth-keys";

export const DEFAULT_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend.rtm-corndog.my.id/api/v1";
export const DEFAULT_CLIENT_DOMAIN = process.env.NEXT_PUBLIC_CLIENT_DOMAIN || "https://app.rtm-corndog.my.id" || "http://localhost:3000";

const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24;
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;
const USER_ROLE_MAX_AGE = 60 * 60 * 24 * 7;

type RefreshTokenResponse = {
  data?: {
    access_token?: string;
    refresh_token?: string;
  };
};

type RequestConfigWithRetry = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

const refreshClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

refreshClient.interceptors.request.use((config) => {
  config.headers = setHeader(config.headers, "x-client-domain", getClientDomain());
  return config;
});

const isBrowser = () => typeof window !== "undefined";

const setCookie = (key: string, value: string, maxAge: number) => {
  if (!isBrowser()) {
    return;
  }

  const securePart = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${key}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${securePart}`;
};

const clearCookie = (key: string) => {
  if (!isBrowser()) {
    return;
  }

  document.cookie = `${key}=; Path=/; Max-Age=0; SameSite=Lax`;
};

const getClientDomain = () => {
  if (process.env.NEXT_PUBLIC_CLIENT_DOMAIN) {
    return process.env.NEXT_PUBLIC_CLIENT_DOMAIN;
  }

  if (!isBrowser()) {
    return DEFAULT_CLIENT_DOMAIN;
  }

  return window.location.origin;
};

const getAccessToken = () => {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

const getRefreshToken = () => {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
};

const getUserRole = (): AuthRole | null => {
  if (!isBrowser()) {
    return null;
  }

  const role = window.localStorage.getItem(USER_ROLE_KEY);
  if (role === "ADMIN" || role === "TEACHER" || role === "STUDENT") {
    return role;
  }

  return null;
};

const setAuthTokens = (tokens: {
  accessToken?: string;
  refreshToken?: string;
  role?: AuthRole;
}) => {
  if (!isBrowser()) {
    return;
  }

  if (tokens.accessToken) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    setCookie(ACCESS_TOKEN_KEY, tokens.accessToken, ACCESS_TOKEN_MAX_AGE);
  }

  if (tokens.refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    setCookie(REFRESH_TOKEN_KEY, tokens.refreshToken, REFRESH_TOKEN_MAX_AGE);
  }

  if (tokens.role) {
    window.localStorage.setItem(USER_ROLE_KEY, tokens.role);
    setCookie(USER_ROLE_KEY, tokens.role, USER_ROLE_MAX_AGE);
  }
};

const clearAuthTokens = () => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(USER_ROLE_KEY);
  clearCookie(ACCESS_TOKEN_KEY);
  clearCookie(REFRESH_TOKEN_KEY);
  clearCookie(USER_ROLE_KEY);
};

const setHeader = (
  headers: InternalAxiosRequestConfig["headers"] | undefined,
  key: string,
  value: string
) => {
  const resolvedHeaders = headers ?? new AxiosHeaders();

  if (resolvedHeaders instanceof AxiosHeaders) {
    resolvedHeaders.set(key, value);
    return resolvedHeaders;
  }

  if (typeof (resolvedHeaders as AxiosHeaders).set === "function") {
    (resolvedHeaders as AxiosHeaders).set(key, value);
    return resolvedHeaders;
  }

  (resolvedHeaders as Record<string, string>)[key] = value;
  return resolvedHeaders;
};

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearAuthTokens();
      return null;
    }

    try {
      const response = await refreshClient.post<RefreshTokenResponse>("/auth/refresh", {
        refreshToken,
      });

      const accessToken = response.data?.data?.access_token ?? null;
      const newRefreshToken = response.data?.data?.refresh_token;

      if (!accessToken) {
        clearAuthTokens();
        return null;
      }

      setAuthTokens({
        accessToken,
        refreshToken: newRefreshToken ?? refreshToken,
      });

      return accessToken;
    } catch {
      clearAuthTokens();
      return null;
    }
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};

axiosInstance.interceptors.request.use((config) => {
  config.headers = setHeader(config.headers, "x-client-domain", getClientDomain());

  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers = setHeader(config.headers, "Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RequestConfigWithRetry | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const statusCode = error.response?.status;
    const isRefreshEndpoint = originalRequest.url?.includes("/auth/refresh");

    if (statusCode !== 401 || originalRequest._retry || isRefreshEndpoint) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const newAccessToken = await refreshAccessToken();

    if (!newAccessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers = setHeader(
      originalRequest.headers,
      "Authorization",
      `Bearer ${newAccessToken}`
    );
    return axiosInstance(originalRequest);
  }
);

export const authTokenStorage = {
  accessTokenKey: ACCESS_TOKEN_KEY,
  refreshTokenKey: REFRESH_TOKEN_KEY,
  userRoleKey: USER_ROLE_KEY,
  getAccessToken,
  getRefreshToken,
  getUserRole,
  setAuthTokens,
  clearAuthTokens,
};
