import { PublishedFilterOption, SortByOption, SortOrderOption } from "./blog-types";

export const PUBLISHED_FILTER_LABELS: Record<PublishedFilterOption, string> = {
  all: "All Status",
  true: "Published",
  false: "Draft",
};

export const SORT_BY_LABELS: Record<SortByOption, string> = {
  all: "All Sort By",
  createdAt: "Created At",
  publishedAt: "Published At",
  title: "Title",
};

export const SORT_ORDER_LABELS: Record<SortOrderOption, string> = {
  all: "All Order",
  asc: "Ascending",
  desc: "Descending",
};