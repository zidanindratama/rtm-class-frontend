import {
  MaterialAiStatusKey,
  MaterialSortByOption,
  MaterialSortOrderOption,
} from "./material-types";

export const MATERIAL_SORT_BY_LABELS: Record<MaterialSortByOption, string> = {
  all: "All fields",
  createdAt: "Created date",
  title: "Title",
};

export const MATERIAL_SORT_ORDER_LABELS: Record<MaterialSortOrderOption, string> =
  {
    all: "All orders",
    asc: "Ascending",
    desc: "Descending",
  };

export const MATERIAL_TYPE_LABELS: Record<string, string> = {
  PDF: "PDF",
  VIDEO: "Video",
  DOC: "Document",
  DOCX: "Document",
  PPT: "Presentation",
  PPTX: "Presentation",
  LINK: "Link",
  URL: "Link",
  OTHER: "Other",
};

export const MATERIAL_AI_STATUS_LABELS: Record<
  MaterialAiStatusKey | "UNKNOWN",
  string
> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  DONE: "Done",
  FAILED: "Failed",
  UNKNOWN: "Unknown",
};
