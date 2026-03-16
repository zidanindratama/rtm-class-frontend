"use client";

import type { EssayQuestionDraft, McqQuestionDraft } from "./assignment-form-utils";

export type AiJobStatus =
  | "accepted"
  | "processing"
  | "succeeded"
  | "failed_processing"
  | "failed_delivery";

export type AiTransformJobType = "MCQ" | "ESSAY";

export type AiTransformJob = {
  id: string;
  materialId: string;
  requestedById: string;
  type: AiTransformJobType;
  status: AiJobStatus;
  externalJobId?: string | null;
  lastError?: string | null;
  createdAt: string;
  updatedAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
};

export type AiTransformResponse = {
  materialId: string;
  jobs: AiTransformJob[];
};

export type MaterialAiOutput = {
  id: string;
  materialId: string;
  jobId: string;
  type: AiTransformJobType;
  content: unknown;
  editedContent?: unknown | null;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  job?: {
    id: string;
    type: AiTransformJobType;
    status: AiJobStatus;
    createdAt: string;
    completedAt?: string | null;
  };
};

export type AssignmentAiDraft = {
  title: string;
  type: "QUIZ_MCQ" | "QUIZ_ESSAY";
  materialId: string;
  sourceMaterialTitle: string;
  sourceMaterialUrl: string;
  contentHtml: string;
  mcqQuestions: McqQuestionDraft[];
  essayQuestions: EssayQuestionDraft[];
};

type GenericRecord = Record<string, unknown>;
type McqOption = "A" | "B" | "C" | "D";

const OPTION_KEYS: McqOption[] = ["A", "B", "C", "D"];

const isRecord = (value: unknown): value is GenericRecord =>
  typeof value === "object" && value !== null;

const getString = (source: GenericRecord, keys: string[]) => {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const textToHtml = (value: string) =>
  value
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br />")}</p>`)
    .join("");

const normalizePayload = (output: MaterialAiOutput) => {
  const preferred = output.editedContent ?? output.content;
  return isRecord(preferred) ? preferred : {};
};

const resolveInstructionsHtml = (payload: GenericRecord) => {
  const directHtml = getString(payload, ["richTextHtml", "contentHtml", "html"]);
  if (directHtml) {
    return directHtml;
  }

  const plainText = getString(payload, ["instructions", "instruction", "summary", "description"]);
  if (plainText) {
    return textToHtml(plainText);
  }

  return "";
};

const resolveQuestions = (payload: GenericRecord) => {
  const directQuestions = payload.questions;
  if (Array.isArray(directQuestions)) {
    return directQuestions;
  }

  const nestedContent = payload.content;
  if (Array.isArray(nestedContent)) {
    return nestedContent;
  }

  if (isRecord(nestedContent) && Array.isArray(nestedContent.questions)) {
    return nestedContent.questions;
  }

  return [];
};

const resolveOptions = (value: unknown): [string, string, string, string] | null => {
  if (Array.isArray(value)) {
    const normalized = value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter((item) => item.length > 0);

    if (normalized.length === 4) {
      return [
        normalized[0] ?? "",
        normalized[1] ?? "",
        normalized[2] ?? "",
        normalized[3] ?? "",
      ];
    }
  }

  if (isRecord(value)) {
    const normalized = OPTION_KEYS.map((key) => {
      const option = value[key];
      return typeof option === "string" ? option.trim() : "";
    });

    if (normalized.every((option) => option.length > 0)) {
      return [
        normalized[0] ?? "",
        normalized[1] ?? "",
        normalized[2] ?? "",
        normalized[3] ?? "",
      ];
    }
  }

  return null;
};

const resolveCorrectOption = (
  row: GenericRecord,
  options: [string, string, string, string],
): McqOption | null => {
  const directAnswer = getString(row, ["correctOption", "answer", "correct_answer"]);
  const normalizedDirect = directAnswer.toUpperCase();

  if (OPTION_KEYS.includes(normalizedDirect as McqOption)) {
    return normalizedDirect as McqOption;
  }

  const answerByTextIndex = options.findIndex(
    (option) => option.trim().toLowerCase() === directAnswer.trim().toLowerCase(),
  );
  if (answerByTextIndex >= 0) {
    return OPTION_KEYS[answerByTextIndex] ?? null;
  }

  return null;
};

export function mapAiOutputToAssignmentDraft(params: {
  output: MaterialAiOutput;
  assignmentTitle: string;
  materialId: string;
  sourceMaterialTitle: string;
  sourceMaterialUrl: string;
}): AssignmentAiDraft {
  const { output, assignmentTitle, materialId, sourceMaterialTitle, sourceMaterialUrl } = params;
  const payload = normalizePayload(output);
  const instructionsHtml = resolveInstructionsHtml(payload);
  const questions = resolveQuestions(payload);

  if (output.type === "MCQ") {
    const mcqQuestions = questions
      .map((item, index) => {
        if (!isRecord(item)) {
          return null;
        }

        const question = getString(item, ["question", "text", "prompt"]);
        const options = resolveOptions(item.options);
        if (!question || !options) {
          return null;
        }

        const correctOption = resolveCorrectOption(item, options);
        if (!correctOption) {
          return null;
        }

        const points = typeof item.points === "number" && Number.isFinite(item.points)
          ? Math.max(0, Math.round(item.points))
          : 10;

        return {
          id: typeof item.id === "string" && item.id.trim() ? item.id.trim() : `mcq-${index + 1}`,
          question,
          optionA: options[0],
          optionB: options[1],
          optionC: options[2],
          optionD: options[3],
          correctOption,
          points: String(points),
        } satisfies McqQuestionDraft;
      })
      .filter((item): item is McqQuestionDraft => Boolean(item));

    if (mcqQuestions.length === 0) {
      throw new Error("AI output did not contain usable MCQ questions.");
    }

    return {
      title: assignmentTitle,
      type: "QUIZ_MCQ",
      materialId,
      sourceMaterialTitle,
      sourceMaterialUrl,
      contentHtml: instructionsHtml,
      mcqQuestions,
      essayQuestions: [],
    };
  }

  const essayQuestions = questions
    .map((item, index) => {
      if (!isRecord(item)) {
        return null;
      }

      const question = getString(item, ["question", "text", "prompt"]);
      if (!question) {
        return null;
      }

      const points = typeof item.points === "number" && Number.isFinite(item.points)
        ? Math.max(0, Math.round(item.points))
        : 10;

      return {
        id: typeof item.id === "string" && item.id.trim() ? item.id.trim() : `essay-${index + 1}`,
        question,
        answerGuide: getString(item, ["answerGuide", "rubric", "guide"]),
        points: String(points),
      } satisfies EssayQuestionDraft;
    })
    .filter((item): item is EssayQuestionDraft => Boolean(item));

  if (essayQuestions.length === 0) {
    throw new Error("AI output did not contain usable essay questions.");
  }

  return {
    title: assignmentTitle,
    type: "QUIZ_ESSAY",
    materialId,
    sourceMaterialTitle,
    sourceMaterialUrl,
    contentHtml: instructionsHtml,
    mcqQuestions: [],
    essayQuestions,
  };
}
