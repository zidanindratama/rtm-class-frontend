export type APIListMeta = {
  current_page: number;
  total_pages: number;
  total_items: number;
};

export type APIListResponse<T> = {
  message: string;
  data: Array<T>;
  meta: APIListMeta | null;
  error: unknown | null;
};

export type APISingleResponse<T> = {
  message: string;
  data: T;
  meta: unknown;
  error: unknown | null;
};
