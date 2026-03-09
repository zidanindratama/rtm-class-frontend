export type McqOption = "A" | "B" | "C" | "D";

export type AssignmentMcqQuestion = {
  id: string;
  type: "MCQ";
  question: string;
  options: [string, string, string, string];
  correctOption: McqOption;
  points: number;
};

export type AssignmentEssayQuestion = {
  id: string;
  type: "ESSAY";
  question: string;
  answerGuide: string;
  points: number;
};

export type AssignmentContentNormalized = {
  richTextHtml: string;
  mcq: AssignmentMcqQuestion[];
  essay: AssignmentEssayQuestion[];
};

export type McqSubmissionAnswers = {
  format: "MCQ";
  responses: Array<{
    questionId: string;
    answer: McqOption;
  }>;
};

export type EssaySubmissionAnswers = {
  format: "ESSAY";
  responses: Array<{
    questionId: string;
    answer: string;
  }>;
};

export type TextSubmissionAnswers = {
  format: "TEXT";
  text: string;
  attachments?: string[];
};

export type GenericSubmissionAnswers = {
  format: "GENERIC";
  payload: Record<string, unknown>;
};

export type SubmissionAnswersNormalized =
  | McqSubmissionAnswers
  | EssaySubmissionAnswers
  | TextSubmissionAnswers
  | GenericSubmissionAnswers
  | null;

const DEFAULT_OPTIONS: [string, string, string, string] = ["", "", "", ""];

const ensureMcqOption = (value: unknown): McqOption => {
  if (value === "A" || value === "B" || value === "C" || value === "D") {
    return value;
  }

  return "A";
};

const toNumber = (value: unknown, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

export function normalizeAssignmentContent(content: unknown): AssignmentContentNormalized {
  if (!content || typeof content !== "object") {
    return { richTextHtml: "", mcq: [], essay: [] };
  }

  const source = content as Record<string, unknown>;
  const questionSet =
    source.questionSet && typeof source.questionSet === "object"
      ? (source.questionSet as Record<string, unknown>)
      : {};

  const mcq = (Array.isArray(questionSet.mcq) ? questionSet.mcq : [])
    .map((row, index) => {
      if (!row || typeof row !== "object") return null;
      const item = row as Record<string, unknown>;
      const opts = Array.isArray(item.options)
        ? item.options.filter((entry): entry is string => typeof entry === "string")
        : [];

      return {
        id: typeof item.id === "string" ? item.id : `mcq-${index + 1}`,
        type: "MCQ" as const,
        question: typeof item.question === "string" ? item.question : "",
        options: [
          opts[0] ?? DEFAULT_OPTIONS[0],
          opts[1] ?? DEFAULT_OPTIONS[1],
          opts[2] ?? DEFAULT_OPTIONS[2],
          opts[3] ?? DEFAULT_OPTIONS[3],
        ] as [string, string, string, string],
        correctOption: ensureMcqOption(item.correctOption),
        points: toNumber(item.points, 0),
      };
    })
    .filter((row): row is AssignmentMcqQuestion => Boolean(row));

  const essay = (Array.isArray(questionSet.essay) ? questionSet.essay : [])
    .map((row, index) => {
      if (!row || typeof row !== "object") return null;
      const item = row as Record<string, unknown>;

      return {
        id: typeof item.id === "string" ? item.id : `essay-${index + 1}`,
        type: "ESSAY" as const,
        question: typeof item.question === "string" ? item.question : "",
        answerGuide: typeof item.answerGuide === "string" ? item.answerGuide : "",
        points: toNumber(item.points, 0),
      };
    })
    .filter((row): row is AssignmentEssayQuestion => Boolean(row));

  return {
    richTextHtml: typeof source.richTextHtml === "string" ? source.richTextHtml : "",
    mcq,
    essay,
  };
}

export function normalizeSubmissionAnswers(answers: unknown): SubmissionAnswersNormalized {
  if (!answers || typeof answers !== "object") {
    return null;
  }

  const source = answers as Record<string, unknown>;
  const format = source.format;

  if (format === "MCQ") {
    const responsesRaw = Array.isArray(source.responses) ? source.responses : [];
    const responses = responsesRaw
      .map((row) => {
        if (!row || typeof row !== "object") return null;
        const item = row as Record<string, unknown>;
        if (typeof item.questionId !== "string") return null;

        return {
          questionId: item.questionId,
          answer: ensureMcqOption(item.answer),
        };
      })
      .filter((row): row is { questionId: string; answer: McqOption } => Boolean(row));

    return {
      format,
      responses,
    };
  }

  if (format === "ESSAY") {
    const responsesRaw = Array.isArray(source.responses) ? source.responses : [];
    const responses = responsesRaw
      .map((row) => {
        if (!row || typeof row !== "object") return null;
        const item = row as Record<string, unknown>;
        if (typeof item.questionId !== "string") return null;

        return {
          questionId: item.questionId,
          answer: typeof item.answer === "string" ? item.answer : "",
        };
      })
      .filter((row): row is { questionId: string; answer: string } => Boolean(row));

    return {
      format,
      responses,
    };
  }

  if (format === "TEXT") {
    const attachments = Array.isArray(source.attachments)
      ? source.attachments.filter((entry): entry is string => typeof entry === "string")
      : undefined;

    return {
      format,
      text: typeof source.text === "string" ? source.text : "",
      attachments,
    };
  }

  if (format === "GENERIC") {
    return {
      format,
      payload:
        source.payload && typeof source.payload === "object"
          ? (source.payload as Record<string, unknown>)
          : {},
    };
  }

  return null;
}

export function formatDateTimeLabel(iso?: string | null): string {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatDateLabel(iso?: string | null): string {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}
