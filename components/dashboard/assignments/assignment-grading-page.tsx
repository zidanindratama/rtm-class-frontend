"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useGetData } from "@/hooks/use-get-data";
import { usePatchData } from "@/hooks/use-patch-data";
import { APIListResponse, APISingleResponse } from "@/types/api-response";
import { AssignmentSubmissionViewer } from "./assignment-submission-viewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AssignmentDetail, AssignmentSubmission, SubmissionStatus } from "./assignment-types";
import { formatDateTimeLabel } from "./assignment-content-utils";

type AssignmentGradingPageProps = {
  classId: string;
  assignmentId: string;
};

export function AssignmentGradingPage({ classId, assignmentId }: AssignmentGradingPageProps) {
  const [submissionPage, setSubmissionPage] = useState(1);
  const [gradingInput, setGradingInput] = useState<Record<string, { score: string; feedback: string }>>({});

  const { data: detailResponse, isLoading, isError } = useGetData<APISingleResponse<AssignmentDetail>>({
    key: ["assignments", "detail", assignmentId, "grading-page"],
    endpoint: `/assignments/${assignmentId}`,
    extractData: false,
    errorMessage: "Failed to load assignment detail.",
  });

  const {
    data: submissionsResponse,
    isLoading: isLoadingSubmissions,
  } = useGetData<APIListResponse<AssignmentSubmission>>({
    key: ["assignments", "submissions", assignmentId, "grading", submissionPage],
    endpoint: `/assignments/${assignmentId}/submissions`,
    extractData: false,
    params: {
      page: submissionPage,
      per_page: 10,
      sort_by: "submittedAt",
      sort_order: "desc",
    },
    errorMessage: "Failed to load submissions.",
  });

  const gradeMutation = usePatchData<unknown, { submissionId: string; score: number; feedback?: string }>({
    key: ["assignments", "grade-submission", assignmentId],
    endpoint: (payload) => `/assignments/submissions/${payload.submissionId}/grade`,
    successMessage: "Submission graded.",
    errorMessage: "Failed to grade submission.",
    invalidateKeys: [["assignments", "submissions", assignmentId], ["assignments", "my-submission", assignmentId]],
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-muted-foreground">Loading grading workspace...</CardContent>
      </Card>
    );
  }

  if (isError || !detailResponse?.data) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-muted-foreground">Unable to load assignment.</CardContent>
      </Card>
    );
  }

  const assignment = detailResponse.data;
  const submissions = submissionsResponse?.data ?? [];
  const submissionMeta = submissionsResponse?.meta;

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
        <h1 className="text-2xl font-semibold tracking-tight">Grading Workspace</h1>
        <p className="text-sm text-muted-foreground">
          {assignment.title} - review student answers and grade without making detail page too long.
        </p>
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Student Submissions</CardTitle>
          <CardDescription>Readable answer view for grading and review.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingSubmissions ? (
            <p className="text-sm text-muted-foreground">Loading submissions...</p>
          ) : submissions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No submissions yet.</p>
          ) : (
            submissions.map((submission) => {
              const currentGrade = gradingInput[submission.id] ?? {
                score: submission.score?.toString() ?? "",
                feedback: submission.feedback ?? "",
              };

              return (
                <details key={submission.id} className="rounded-lg border border-border/70 p-4">
                  <summary className="cursor-pointer list-none">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-medium">{submission.student?.fullName || "Unknown Student"}</p>
                        <p className="text-xs text-muted-foreground">{submission.student?.email || "-"}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <Badge variant="outline">{submission.status as SubmissionStatus}</Badge>
                        <Badge variant="secondary">Score: {submission.score ?? "-"}/{assignment.maxScore}</Badge>
                        <Badge variant="outline">Attempts: {submission._count?.attempts ?? submission.attempts?.length ?? 0}</Badge>
                      </div>
                    </div>
                  </summary>

                  <div className="mt-4 space-y-4 border-t border-border/60 pt-4">
                    <p className="text-xs text-muted-foreground">
                      Submitted: {formatDateTimeLabel(submission.submittedAt)}
                    </p>

                    <AssignmentSubmissionViewer
                      assignmentType={assignment.type}
                      content={assignment.content}
                      answers={submission.answers}
                      questionGrades={submission.questionGrades}
                    />

                    <div className="space-y-4 rounded-md border border-border/60 bg-muted/10 p-4">
                      <p className="text-sm font-medium">Quick grade</p>
                      <div className="space-y-4">
                        <label className="block space-y-1.5">
                          <p className="text-xs text-muted-foreground">Score</p>
                          <Input
                            type="number"
                            value={currentGrade.score}
                            onChange={(event) =>
                              setGradingInput((prev) => ({
                                ...prev,
                                [submission.id]: {
                                  ...currentGrade,
                                  score: event.target.value,
                                },
                              }))
                            }
                            placeholder={`0 - ${assignment.maxScore}`}
                          />
                        </label>
                        <label className="block space-y-1.5">
                          <p className="text-xs text-muted-foreground">Feedback</p>
                          <Textarea
                            value={currentGrade.feedback}
                            onChange={(event) =>
                              setGradingInput((prev) => ({
                                ...prev,
                                [submission.id]: {
                                  ...currentGrade,
                                  feedback: event.target.value,
                                },
                              }))
                            }
                            placeholder="Feedback for student"
                            className="min-h-[104px]"
                          />
                        </label>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          size="sm"
                          disabled={gradeMutation.isPending || currentGrade.score.trim() === ""}
                          onClick={() => {
                            const score = Number(currentGrade.score);
                            if (!Number.isFinite(score)) return;

                            gradeMutation.mutate({
                              submissionId: submission.id,
                              score,
                              feedback: currentGrade.feedback.trim() || undefined,
                            });
                          }}
                        >
                          {gradeMutation.isPending ? "Saving..." : "Save Grade"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </details>
              );
            })
          )}

          {submissionMeta && submissionMeta.total_pages > 1 ? (
            <div className="flex items-center justify-between border-t border-border/60 pt-3">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setSubmissionPage((page) => Math.max(1, page - 1))}
                disabled={submissionMeta.current_page <= 1}
              >
                Previous
              </Button>
              <p className="text-xs text-muted-foreground">
                Page {submissionMeta.current_page} of {submissionMeta.total_pages}
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setSubmissionPage((page) => Math.min(submissionMeta.total_pages, page + 1))}
                disabled={submissionMeta.current_page >= submissionMeta.total_pages}
              >
                Next
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}
