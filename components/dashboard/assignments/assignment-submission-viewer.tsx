"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AssignmentQuestionType,
  AssignmentType,
  SubmissionQuestionGrade,
} from "./assignment-types";
import {
  normalizeAssignmentContent,
  normalizeSubmissionAnswers,
} from "./assignment-content-utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { alphaToIndex } from "@/lib/utils";

type AssignmentSubmissionViewerProps = {
  assignmentType: AssignmentType;
  content: unknown;
  answers: unknown;
  questionGrades?: SubmissionQuestionGrade[];
};

const QUESTION_TYPE_LABELS: Record<AssignmentQuestionType, string> = {
  MCQ: "MCQ",
  ESSAY: "Essay",
  TASK: "Task",
  REMEDIAL: "Remedial",
  GENERIC: "Generic",
};

const ANSWER_LABELS: Record<"A" | "B" | "C" | "D", string> = {
  A: "Option A",
  B: "Option B",
  C: "Option C",
  D: "Option D",
};

export function AssignmentSubmissionViewer({
  assignmentType,
  content,
  answers,
  questionGrades,
}: AssignmentSubmissionViewerProps) {
  const normalizedContent = normalizeAssignmentContent(content);
  const normalizedAnswers = normalizeSubmissionAnswers(answers);

  const mcqMap = new Map(normalizedContent.mcq.map((row) => [row.id, row]));
  const essayMap = new Map(normalizedContent.essay.map((row) => [row.id, row]));

  return (
    <div className="space-y-3">
      {normalizedAnswers?.format === "MCQ" ? (
        <div className="space-y-3">
          {normalizedAnswers.responses.map((response, index) => {
            const question = mcqMap.get(response.questionId);
            const answerIndex = alphaToIndex(response.answer);
            const optionText =
              answerIndex >= 0 ? (question?.options[answerIndex] ?? "") : "";
            const correctOptionIndex = question
              ? alphaToIndex(question.correctOption)
              : -1;
            const correctOptionText =
              correctOptionIndex >= 0
                ? question?.options[correctOptionIndex] ?? ""
                : "";

            return (
              <Card
                key={`${response.questionId}-${index}`}
                className="border-border/60"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">
                    {index + 1}. {question?.question || "Question not found"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p>
                    Student answer:{" "}
                    <span className="font-medium">
                      {ANSWER_LABELS[response.answer]}
                    </span>
                  </p>
                  {optionText ? (
                    <p className="text-muted-foreground">{optionText}</p>
                  ) : null}
                  {question ? (
                    <p className="text-xs text-muted-foreground">
                      Correct key: {ANSWER_LABELS[question.correctOption]} (
                      {correctOptionText}
                      )
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}

          {normalizedAnswers.responses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No MCQ responses.</p>
          ) : null}
        </div>
      ) : null}

      {normalizedAnswers?.format === "ESSAY" ? (
        <div className="space-y-3">
          {normalizedAnswers.responses.map((response, index) => {
            const question = essayMap.get(response.questionId);

            return (
              <Card
                key={`${response.questionId}-${index}`}
                className="border-border/60"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">
                    {index + 1}. {question?.question || "Question not found"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Student answer
                    </p>
                    <p className="whitespace-pre-wrap">
                      {response.answer || "-"}
                    </p>
                  </div>
                  {question?.answerGuide ? (
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Answer guide
                      </p>
                      <p className="whitespace-pre-wrap text-muted-foreground">
                        {question.answerGuide}
                      </p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}

          {normalizedAnswers.responses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No essay responses.</p>
          ) : null}
        </div>
      ) : null}

      {normalizedAnswers?.format === "TEXT" ? (
        <Card className="border-border/60">
          <CardContent className="space-y-2 pt-4 text-sm">
            <p className="text-xs text-muted-foreground">Submitted text</p>
            <p className="whitespace-pre-wrap">
              {normalizedAnswers.text || "-"}
            </p>
            {normalizedAnswers.attachments &&
            normalizedAnswers.attachments.length > 0 ? (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Attachment URLs</p>
                {normalizedAnswers.attachments.map((url) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-xs text-primary underline-offset-2 hover:underline"
                  >
                    {url}
                  </a>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {normalizedAnswers?.format === "GENERIC" ? (
        <Card className="border-border/60">
          <CardContent className="space-y-1 pt-4 text-sm">
            <p className="text-xs text-muted-foreground">Submitted fields</p>
            {Object.entries(normalizedAnswers.payload).map(([key, value]) => (
              <p key={key}>
                <span className="font-medium">{key}:</span> {String(value)}
              </p>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {!normalizedAnswers ? (
        <p className="text-sm text-muted-foreground">
          No readable answer data.
        </p>
      ) : null}

      {questionGrades && questionGrades.length > 0 ? (
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Per-question grading
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ScrollArea className="h-72 w-full pr-3">
              {questionGrades.map((grade, index) => (
                <div key={grade.id} className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-medium">
                      {index + 1}. {grade.questionId}
                    </span>
                    <Badge variant="outline">
                      {QUESTION_TYPE_LABELS[grade.questionType]}
                    </Badge>
                    <Badge variant="secondary">
                      {grade.score}/{grade.maxScore}
                    </Badge>
                    {typeof grade.isCorrect === "boolean" ? (
                      <Badge
                        variant={grade.isCorrect ? "default" : "destructive"}
                      >
                        {grade.isCorrect ? "Correct" : "Incorrect"}
                      </Badge>
                    ) : null}
                  </div>
                  {grade.feedback ? (
                    <p className="text-xs text-muted-foreground">
                      Feedback: {grade.feedback}
                    </p>
                  ) : null}
                  {index < questionGrades.length - 1 ? <Separator /> : null}
                </div>
              ))}
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </CardContent>
        </Card>
      ) : null}

      <p className="text-xs text-muted-foreground">
        Answer format: {normalizedAnswers?.format ?? assignmentType}
      </p>
    </div>
  );
}
