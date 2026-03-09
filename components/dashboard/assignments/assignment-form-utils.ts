import {
  AssignmentEssayQuestion,
  AssignmentMcqQuestion,
  normalizeAssignmentContent,
} from "./assignment-content-utils";

type McqOption = "A" | "B" | "C" | "D";

export type McqQuestionDraft = {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: McqOption;
  points: string;
};

export type EssayQuestionDraft = {
  id: string;
  question: string;
  answerGuide: string;
  points: string;
};

export type AssignmentQuestionPayload = {
  mcq: Array<{
    id: string;
    type: "MCQ";
    question: string;
    options: [string, string, string, string];
    correctOption: McqOption;
    points: number;
  }>;
  essay: Array<{
    id: string;
    type: "ESSAY";
    question: string;
    answerGuide: string;
    points: number;
  }>;
};

const toMcqDraft = (row: AssignmentMcqQuestion): McqQuestionDraft => ({
  id: row.id,
  question: row.question,
  optionA: row.options[0] ?? "",
  optionB: row.options[1] ?? "",
  optionC: row.options[2] ?? "",
  optionD: row.options[3] ?? "",
  correctOption: row.correctOption,
  points: String(row.points),
});

const toEssayDraft = (row: AssignmentEssayQuestion): EssayQuestionDraft => ({
  id: row.id,
  question: row.question,
  answerGuide: row.answerGuide,
  points: String(row.points),
});

export function parseAssignmentContentToDrafts(content: unknown): {
  richTextHtml: string;
  mcq: McqQuestionDraft[];
  essay: EssayQuestionDraft[];
} {
  const normalized = normalizeAssignmentContent(content);

  return {
    richTextHtml: normalized.richTextHtml,
    mcq: normalized.mcq.map(toMcqDraft),
    essay: normalized.essay.map(toEssayDraft),
  };
}

export function createEmptyMcqQuestion(): McqQuestionDraft {
  return {
    id: crypto.randomUUID(),
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "A",
    points: "10",
  };
}

export function createEmptyEssayQuestion(): EssayQuestionDraft {
  return {
    id: crypto.randomUUID(),
    question: "",
    answerGuide: "",
    points: "10",
  };
}

export function buildQuestionPayload(params: {
  isMcqType: boolean;
  isEssayType: boolean;
  mcqQuestions: McqQuestionDraft[];
  essayQuestions: EssayQuestionDraft[];
}): AssignmentQuestionPayload {
  const { isMcqType, isEssayType, mcqQuestions, essayQuestions } = params;

  return {
    mcq: (isMcqType ? mcqQuestions : [])
      .filter((item) => item.question.trim())
      .map((item, index) => ({
        id: `mcq-${index + 1}`,
        type: "MCQ" as const,
        question: item.question.trim(),
        options: [
          item.optionA.trim(),
          item.optionB.trim(),
          item.optionC.trim(),
          item.optionD.trim(),
        ] as [string, string, string, string],
        correctOption: item.correctOption,
        points: Number(item.points || 0),
      })),
    essay: (isEssayType ? essayQuestions : [])
      .filter((item) => item.question.trim())
      .map((item, index) => ({
        id: `essay-${index + 1}`,
        type: "ESSAY" as const,
        question: item.question.trim(),
        answerGuide: item.answerGuide.trim(),
        points: Number(item.points || 0),
      })),
  };
}
