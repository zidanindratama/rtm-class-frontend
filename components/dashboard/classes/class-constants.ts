import { SortByOption, SortOrderOption } from "./class-types";

// constants/class-constants.ts
export const SORT_BY_LABELS: Record<SortByOption, string> = {
  all: "Sort by...",
  createdAt: "Date Created",
  name: "Class Name",
  classCode: "Class Code",
};

export const SORT_ORDER_LABELS: Record<SortOrderOption, string> = {
  all: "Order...",
  asc: "Ascending",
  desc: "Descending",
};