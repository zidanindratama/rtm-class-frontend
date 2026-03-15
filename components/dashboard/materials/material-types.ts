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

export type AiJobType =
  | "MCQ"
  | "ESSAY"
  | "SUMMARY"
  | "LKPD"
  | "REMEDIAL"
  | "DISCUSSION_TOPIC";

export type AiJobStatus =
  | "accepted"
  | "processing"
  | "succeeded"
  | "failed_processing"
  | "failed_delivery";

export type MaterialAiJob = {
  id: string;
  materialId: string;
  requestedById: string;
  type: AiJobType;
  status: AiJobStatus;
  attempts: number;
  parameters?: Record<string, unknown> | null;
  externalJobId?: string | null;
  lastError?: string | null;
  createdAt: string;
  updatedAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
  output?: {
    id: string;
    type: AiJobType;
    isPublished: boolean;
    publishedAt?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  requestedBy?: {
    id: string;
    fullName: string;
    email: string;
    role: "ADMIN" | "TEACHER" | "STUDENT";
  } | null;
};

export type MaterialAiOverview = {
  materialId: string;
  materialStatus: "UPLOADED" | "PROCESSING" | "READY" | "ARCHIVED" | string;
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  inProgressJobs: number;
  completionRate: number;
  hasPendingJobs: boolean;
  jobsByStatus: Record<AiJobStatus, number>;
  jobsByType: Record<AiJobType, number>;
  outputCount: number;
  publishedOutputCount: number;
};

export type MaterialJobsResponse = {
  materialId: string;
  materialStatus: "UPLOADED" | "PROCESSING" | "READY" | "ARCHIVED" | string;
  jobs: MaterialAiJob[];
  overview?: MaterialAiOverview;
};

export type MaterialOutputItem = {
  id: string;
  materialId: string;
  jobId: string;
  type: AiJobType;
  content: Record<string, unknown>;
  editedContent?: Record<string, unknown> | null;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  job?: {
    id: string;
    type: AiJobType;
    status: AiJobStatus;
    createdAt: string;
    completedAt?: string | null;
  } | null;
};
