"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, CircleAlert } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance, authTokenStorage } from "@/lib/axios-instance";
import { useGetData } from "@/hooks/use-get-data";
import { usePostData } from "@/hooks/use-post-data";
import { APISingleResponse } from "@/types/api-response";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AssignmentDetail, AssignmentSubmission } from "./assignment-types";
import {
  AssignmentEssayQuestion,
  AssignmentMcqQuestion,
  formatDateTimeLabel,
  normalizeAssignmentContent,
} from "./assignment-content-utils";

type AssignmentWorkPageProps = {
  classId: string;
  assignmentId: string;
};

type McqOption = "A" | "B" | "C" | "D";

const OPTION_LABELS: Record<McqOption, string> = {
  A: "A",
  B: "B",
  C: "C",
  D: "D",
};

export function AssignmentWorkPage({ classId, assignmentId }: AssignmentWorkPageProps) {
  const queryClient = useQueryClient();
  const role = authTokenStorage.getUserRole();
  const isStudent = role === "STUDENT";

  const [currentPage, setCurrentPage] = useState(1);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, McqOption | "">>({});
  const [essayAnswers, setEssayAnswers] = useState<Record<string, string>>({});
  const [taskText, setTaskText] = useState("");

  const { data: detailResponse, isLoading, isError } = useGetData<APISingleResponse<AssignmentDetail>>({
    key: ["assignments", "detail", assignmentId, "work-page"],
    endpoint: `/assignments/${assignmentId}`,
    extractData: false,
    errorMessage: "Failed to load assignment detail.",
  });

  const {
    data: mySubmission,
    isFetching: isFetchingMySubmission,
  } = useQuery({
    queryKey: ["assignments", "my-submission", assignmentId, "work-page"],
    enabled: isStudent,
    queryFn: async () => {
      try {
        const response = await axiosInstance.get<APISingleResponse<AssignmentSubmission>>(
          `/assignments/${assignmentId}/my-submission`,
        );
        return response.data.data ?? null;
      } catch (error: unknown) {
        const maybeAxios = error as { response?: { status?: number } };
        if (maybeAxios.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
  });

  const assignment = detailResponse?.data;
  const normalizedContent = useMemo(
    () => normalizeAssignmentContent(assignment?.content),
    [assignment?.content],
  );

  const essayPageSize = 5;
  const mcqPageSize = 10;
  const pageSize = assignment?.type === "QUIZ_ESSAY" ? essayPageSize : mcqPageSize;

  const pagedQuestions = useMemo(() => {
    if (!assignment) return [];

    if (assignment.type === "QUIZ_MCQ") {
      return normalizedContent.mcq;
    }

    if (assignment.type === "QUIZ_ESSAY") {
      return normalizedContent.essay;
    }

    return [];
  }, [assignment, normalizedContent.essay, normalizedContent.mcq]);

  const totalPages = Math.max(1, Math.ceil(pagedQuestions.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const visibleQuestions = useMemo(
    () => pagedQuestions.slice((activePage - 1) * pageSize, activePage * pageSize),
    [activePage, pageSize, pagedQuestions],
  );
  const visibleMcqQuestions = assignment?.type === "QUIZ_MCQ"
    ? (visibleQuestions as AssignmentMcqQuestion[])
    : [];
  const visibleEssayQuestions = assignment?.type === "QUIZ_ESSAY"
    ? (visibleQuestions as AssignmentEssayQuestion[])
    : [];

  const submitMutation = usePostData<unknown, Record<string, unknown>>({
    key: ["assignments", "submit", assignmentId],
    endpoint: `/assignments/${assignmentId}/submit`,
    successMessage: "Submission saved successfully.",
    errorMessage: "Failed to submit assignment.",
    invalidateKeys: [
      ["assignments", "my-submission", assignmentId, "work-page"],
      ["assignments", "my-submission", assignmentId],
      ["assignments", "submissions", assignmentId],
      ["assignments", "detail", assignmentId],
    ],
    options: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["assignments", "my-submission", assignmentId, "work-page"],
        });
      },
    },
  });

  const dueLabel = formatDateTimeLabel(assignment?.dueAt);
  const alreadySubmitted = Boolean(mySubmission?.id);
  const isClosed = assignment?.status === "CLOSED";
  const canSubmit = isStudent && assignment?.status === "PUBLISHED";

  const answeredMcqCount = Object.values(mcqAnswers).filter(Boolean).length;
  const answeredEssayCount = Object.values(essayAnswers).filter((value) => value.trim()).length;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-muted-foreground">Loading assignment...</CardContent>
      </Card>
    );
  }

  if (isError || !assignment) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-muted-foreground">Unable to load assignment.</CardContent>
      </Card>
    );
  }

  if (!isStudent) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-muted-foreground">
          This workspace is only for students. Use assignment detail page for management view.
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <Link
          href={`/dashboard/my-class/${classId}/assignments/${assignmentId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to assignment detail
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{assignment.title}</h1>
          <Badge variant="outline">{assignment.type.replace("_", " ")}</Badge>
          <Badge
            variant={assignment.status === "PUBLISHED" ? "default" : assignment.status === "CLOSED" ? "destructive" : "secondary"}
          >
            {assignment.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">Due: {dueLabel}</p>
      </div>

      {alreadySubmitted ? (
        <Card className="border-emerald-300/60 bg-emerald-50/50">
          <CardContent className="flex items-start gap-2 py-4 text-sm text-emerald-900">
            <CheckCircle2 className="mt-0.5 h-4 w-4" />
            <div>
              <p className="font-medium">You already have a submission.</p>
              <p>Submitted at {formatDateTimeLabel(mySubmission?.submittedAt)}. You can update and resubmit before assignment closes.</p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {!canSubmit ? (
        <Card className="border-amber-300/60 bg-amber-50/50">
          <CardContent className="flex items-start gap-2 py-4 text-sm text-amber-900">
            <CircleAlert className="mt-0.5 h-4 w-4" />
            <div>
              <p className="font-medium">Submission is currently locked.</p>
              <p>
                {isClosed
                  ? "This assignment is closed."
                  : "Assignment must be published before you can submit."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {assignment.type === "QUIZ_MCQ" ? (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>MCQ Workspace</CardTitle>
            <CardDescription>
              Answered {answeredMcqCount} of {normalizedContent.mcq.length} questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {visibleMcqQuestions.map((question, index) => {
              const number = (activePage - 1) * pageSize + index + 1;
              const currentAnswer = mcqAnswers[question.id] ?? "";

              return (
                <div key={question.id} className="space-y-3 rounded-lg border border-border/70 p-4">
                  <p className="text-sm font-medium">{number}. {question.question}</p>
                  <div className="grid gap-2 md:grid-cols-2">
                    {(["A", "B", "C", "D"] as McqOption[]).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setMcqAnswers((prev) => ({ ...prev, [question.id]: option }))}
                        className={`rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                          currentAnswer === option
                            ? "border-primary bg-primary/10"
                            : "border-border/70 hover:border-primary/40"
                        }`}
                        disabled={!canSubmit}
                      >
                        <p className="font-medium">{OPTION_LABELS[option]}</p>
                        <p className="text-muted-foreground">{question.options[option.charCodeAt(0) - 65]}</p>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {normalizedContent.mcq.length === 0 ? (
              <p className="text-sm text-muted-foreground">No MCQ questions configured.</p>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {assignment.type === "QUIZ_ESSAY" ? (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Essay Workspace</CardTitle>
            <CardDescription>
              Answered {answeredEssayCount} of {normalizedContent.essay.length} questions. Showing {essayPageSize} questions per page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {visibleEssayQuestions.map((question, index) => {
              const number = (activePage - 1) * pageSize + index + 1;

              return (
                <div key={question.id} className="space-y-2 rounded-lg border border-border/70 p-4">
                  <p className="text-sm font-medium">{number}. {question.question}</p>
                  <Textarea
                    value={essayAnswers[question.id] ?? ""}
                    onChange={(event) =>
                      setEssayAnswers((prev) => ({
                        ...prev,
                        [question.id]: event.target.value,
                      }))
                    }
                    placeholder="Write your answer here"
                    className="min-h-[120px]"
                    disabled={!canSubmit}
                  />
                </div>
              );
            })}

            {normalizedContent.essay.length === 0 ? (
              <p className="text-sm text-muted-foreground">No essay questions configured.</p>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {(assignment.type === "TASK" || assignment.type === "REMEDIAL") ? (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Task Workspace</CardTitle>
            <CardDescription>Write your submission text below.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={taskText}
              onChange={(event) => setTaskText(event.target.value)}
              placeholder="Write your work summary or answer"
              className="min-h-[180px]"
              disabled={!canSubmit}
            />
          </CardContent>
        </Card>
      ) : null}

      {pagedQuestions.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/70 bg-muted/20 p-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={activePage <= 1}
          >
            Previous
          </Button>
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`h-8 min-w-8 rounded-md border px-2 text-xs ${
                    activePage === page
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/70 hover:border-primary/40"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={activePage >= totalPages}
          >
            Next
          </Button>
        </div>
      ) : null}

      <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
        <Button asChild type="button" variant="outline">
          <Link href={`/dashboard/my-class/${classId}/assignments/${assignmentId}`}>Back to detail</Link>
        </Button>
        <Button
          type="button"
          disabled={submitMutation.isPending || !canSubmit || isFetchingMySubmission}
          onClick={() => {
            if (assignment.type === "QUIZ_MCQ") {
              submitMutation.mutate({
                answers: {
                  format: "MCQ",
                  responses: normalizedContent.mcq
                    .map((question) => ({
                      questionId: question.id,
                      answer: mcqAnswers[question.id],
                    }))
                    .filter(
                      (row): row is { questionId: string; answer: McqOption } =>
                        row.answer === "A" || row.answer === "B" || row.answer === "C" || row.answer === "D",
                    ),
                },
              });
              return;
            }

            if (assignment.type === "QUIZ_ESSAY") {
              submitMutation.mutate({
                answers: {
                  format: "ESSAY",
                  responses: normalizedContent.essay
                    .map((question) => ({
                      questionId: question.id,
                      answer: (essayAnswers[question.id] ?? "").trim(),
                    }))
                    .filter((row) => row.answer.length > 0),
                },
              });
              return;
            }

            submitMutation.mutate({
              answers: {
                format: "TEXT",
                text: taskText.trim(),
              },
            });
          }}
        >
          {submitMutation.isPending ? "Submitting..." : alreadySubmitted ? "Update Submission" : "Submit Assignment"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
