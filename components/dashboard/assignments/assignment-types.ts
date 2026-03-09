export type AssignmentType =
  | "QUIZ_MCQ"
  | "QUIZ_ESSAY"
  | "TASK"
  | "REMEDIAL";

export type AssignmentStatus = "DRAFT" | "PUBLISHED" | "CLOSED";
export type SubmissionStatus = "SUBMITTED" | "GRADED";
export type AssignmentQuestionType = "MCQ" | "ESSAY" | "TASK" | "REMEDIAL" | "GENERIC";

export type SubmissionAttachment = {
  id: string;
  submissionId: string;
  attemptId: string | null;
  fileUrl: string;
  fileName: string | null;
  fileMimeType: string | null;
  createdAt: string;
};

export type SubmissionQuestionGrade = {
  id: string;
  submissionId: string;
  attemptId: string | null;
  questionId: string;
  questionType: AssignmentQuestionType;
  score: number;
  maxScore: number;
  isCorrect: boolean | null;
  feedback: string | null;
  gradedById: string | null;
  gradedAt: string;
  createdAt: string;
  gradedBy?: {
    id: string;
    fullName: string;
    email: string;
  } | null;
};

export type SubmissionAttempt = {
  id: string;
  submissionId: string;
  attemptNumber: number;
  answers: unknown;
  status: SubmissionStatus;
  score: number | null;
  feedback: string | null;
  submittedAt: string;
  createdAt: string;
  attachments?: SubmissionAttachment[];
  questionGrades?: SubmissionQuestionGrade[];
};

export type AssignmentListItem = {
  id: string;
  classroomId: string;
  materialId: string | null;
  createdById: string;
  title: string;
  description: string | null;
  type: AssignmentType;
  status: AssignmentStatus;
  content: unknown;
  passingScore: number;
  maxScore: number;
  dueAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  classroom: {
    id: string;
    name: string;
    classCode: string;
  };
  createdBy: {
    id: string;
    fullName: string;
    email: string;
    role: "ADMIN" | "TEACHER" | "STUDENT";
  };
  _count: {
    submissions: number;
  };
};

export type AssignmentDetail = AssignmentListItem;

export type AssignmentSubmission = {
  id: string;
  assignmentId: string;
  studentId: string;
  answers: unknown;
  score: number | null;
  feedback: string | null;
  status: SubmissionStatus;
  submittedAt: string;
  gradedAt: string | null;
  gradedById: string | null;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    fullName: string;
    email: string;
  };
  gradedBy?: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  attachments?: SubmissionAttachment[];
  questionGrades?: SubmissionQuestionGrade[];
  attempts?: SubmissionAttempt[];
  _count?: {
    attempts: number;
    attachments: number;
    questionGrades: number;
  };
};

export type GradebookRow = {
  student: {
    id: string;
    fullName: string;
    email: string;
    role: "STUDENT";
  };
  totalAssignments: number;
  submittedCount: number;
  gradedCount: number;
  avgScore: number | null;
  submissionRate: number;
};

export const ASSIGNMENT_TYPE_LABELS: Record<AssignmentType, string> = {
  QUIZ_MCQ: "Quiz (MCQ)",
  QUIZ_ESSAY: "Quiz (Essay)",
  TASK: "Task",
  REMEDIAL: "Remedial",
};

export const ASSIGNMENT_STATUS_LABELS: Record<AssignmentStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  CLOSED: "Closed",
};
