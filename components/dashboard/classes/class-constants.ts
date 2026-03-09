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
 
function generateAcademicYears(count = 5): string[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => {
    const start = currentYear - 1 + i;
    return `${start}/${start + 1}`;
  });
}

export const ACADEMIC_YEARS = generateAcademicYears(5);
// e.g. ["2025/2026", "2026/2027", "2027/2028", ...]

export const CLASS_LEVELS = ["7", "8", "9", "10", "11", "12"];