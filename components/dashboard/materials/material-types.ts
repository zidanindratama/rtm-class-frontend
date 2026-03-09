export type MaterialType =
  | "PDF"
  | "VIDEO"
  | "DOC"
  | "DOCX"
  | "PPT"
  | "PPTX"
  | "LINK"
  | "URL"
  | "OTHER"
  | (string & {});

export type MaterialAiStatusKey = "PENDING" | "PROCESSING" | "DONE" | "FAILED";

export type MaterialAiStatus = {
  mcq?: MaterialAiStatusKey | null;
  essay?: MaterialAiStatusKey | null;
  summary?: MaterialAiStatusKey | null;
};

export type MaterialListItem = {
  id: string;
  classId: string;
  title: string;
  description: string | null;
  type: MaterialType;
  sourceUrl: string | null;
  createdAt: string;
  teacher?: {
    id: string;
    fullName: string;
  } | null;
  aiStatus?: MaterialAiStatus | null;
};

export type CreateMaterialPayload = {
  classId: string;
  title: string;
  fileUrl: string;
  description?: string;
  fileMimeType?: string;
};

export type MaterialCreateResponse = {
  id: string;
  classId: string;
  title: string;
  description: string | null;
  type: MaterialType;
  sourceUrl: string;
  createdBy: string;
  createdAt: string;
};

export type MaterialDetailResponse = {
  id: string;
  classId: string;
  title: string;
  description: string | null;
  type: MaterialType;
  sourceUrl: string;
  teacher?: {
    id: string;
    fullName: string;
  } | null;
  createdAt: string;
  updatedAt?: string;
};

export type MaterialSortByOption = "all" | "createdAt" | "title";
export type MaterialSortOrderOption = "all" | "asc" | "desc";
