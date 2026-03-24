"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BookOpenCheck,
  CalendarDays,
  ClipboardCheck,
  FilePenLine,
  Users,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance, authTokenStorage } from "@/lib/axios-instance";
import { useGetData } from "@/hooks/use-get-data";
import { APIListResponse, APISingleResponse } from "@/types/api-response";
import { AssignmentSubmissionViewer } from "./assignment-submission-viewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ASSIGNMENT_TYPE_LABELS,
  AssignmentDetail,
  AssignmentSubmission,
  AssignmentType,
} from "./assignment-types";
import {
  formatDateTimeLabel,
  normalizeAssignmentContent,
} from "./assignment-content-utils";
import { usePatchData } from "@/hooks/use-patch-data";

type AssignmentDetailPageProps = {
  classId: string;
  assignmentId: string;
  backHref: string;
  backLabel: string;
};

export function AssignmentDetailPage({
  classId,
  assignmentId,
  backHref,
  backLabel,
}: AssignmentDetailPageProps) {
  const role = authTokenStorage.getUserRole();
  const canManage = role === "ADMIN" || role === "TEACHER";
  const isStudent = role === "STUDENT";

  const {
    data: detailResponse,
    isLoading,
    isError,
  } = useGetData<APISingleResponse<AssignmentDetail>>({
    key: ["assignments", "detail", assignmentId],
    endpoint: `/assignments/${assignmentId}`,
    extractData: false,
    errorMessage: "Failed to load assignment detail.",
  });
  const publishMutation = usePatchData<
    unknown,
    { id: string; published: boolean }
  >({
    key: ["assignments", "publish", classId],
    endpoint: (variables) => `/assignments/${variables.id}/publish`,
    successMessage: "Assignment status updated.",
    errorMessage: "Failed to update assignment status.",
    invalidateKeys: [
      ["assignments", "list", classId],
      ["assignments", "detail"],
    ],
  });
  const assignment = detailResponse?.data;
  const normalizedContent = useMemo(
    () => normalizeAssignmentContent(assignment?.content),
    [assignment?.content],
  );

  const { data: mySubmission } = useQuery({
    queryKey: ["assignments", "my-submission", assignmentId],
    enabled: isStudent,
    queryFn: async () => {
      try {
        const response = await axiosInstance.get<
          APISingleResponse<AssignmentSubmission>
        >(`/assignments/${assignmentId}/my-submission`);
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

  const { data: submissionStatsResponse } = useGetData<
    APIListResponse<AssignmentSubmission>
  >({
    key: ["assignments", "submissions", assignmentId, "stats"],
    endpoint: `/assignments/${assignmentId}/submissions`,
    extractData: false,
    enabled: canManage,
    params: {
      page: 1,
      per_page: 1,
    },
    errorMessage: "Failed to load submission stats.",
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-muted-foreground">
          Loading assignment...
        </CardContent>
      </Card>
    );
  }

  if (isError || !assignment) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-muted-foreground">
          Unable to load assignment.
        </CardContent>
      </Card>
    );
  }

  const maxScore = assignment.maxScore;
  const assignmentTypeLabel =
    ASSIGNMENT_TYPE_LABELS[assignment.type as AssignmentType] ??
    assignment.type;
  const totalSubmitted =
    submissionStatsResponse?.meta?.total_items ?? assignment._count.submissions;

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {assignment.title}
          </h1>
          <Badge variant="outline">{assignmentTypeLabel}</Badge>
          <Badge
            variant={
              assignment.status === "PUBLISHED"
                ? "default"
                : assignment.status === "CLOSED"
                  ? "destructive"
                  : "secondary"
            }
          >
            {assignment.status}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          {assignment.description?.trim() || "No description."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/70">
          <CardContent className="space-y-1 pt-5 text-sm">
            <p className="inline-flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              Due date
            </p>
            <p className="font-medium">
              {formatDateTimeLabel(assignment.dueAt)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardContent className="space-y-1 pt-5 text-sm">
            <p className="inline-flex items-center gap-2 text-muted-foreground">
              <ClipboardCheck className="h-4 w-4" />
              Score policy
            </p>
            <p className="font-medium">
              Pass {assignment.passingScore} / Max {assignment.maxScore}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardContent className="space-y-1 pt-5 text-sm">
            <p className="inline-flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              Submissions
            </p>
            <p className="font-medium">{assignment._count.submissions}</p>
          </CardContent>
        </Card>
      </div>

      {normalizedContent.richTextHtml ? (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Assignment Content</CardTitle>
            <CardDescription>
              Overview only. Questions are solved in dedicated workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <article
              className="minimal-tiptap-editor prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: normalizedContent.richTextHtml,
              }}
            />
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/70 bg-muted/20 p-3">
        <div className="text-sm text-muted-foreground">
          {isStudent
            ? "Solve questions in the dedicated workspace for a more focused experience without long scrolling."
            : "Grading is separated into a dedicated workspace to keep this detail page concise."}
        </div>

        <div className="flex flex-wrap gap-2">
          {isStudent ? (
            <Button asChild>
              <Link
                href={`/dashboard/my-class/${classId}/assignments/${assignmentId}/work`}
              >
                {mySubmission ? "Continue Workspace" : "Start Workspace"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : null}

          {canManage ? (
            <Button
              onClick={() =>
                publishMutation.mutate({
                  id: assignment.id,
                  published: true,
                })
              }
              disabled={
                publishMutation.isPending || assignment.status === "PUBLISHED"
              }
            >
              {assignment.status === "PUBLISHED" ? "Published" : "Publish"}
              {assignment.status === "PUBLISHED" ? (
                <BookOpenCheck />
              ) : (
                <BookOpen />
              )}
            </Button>
          ) : null}

          {canManage ? (
            <Button asChild variant="outline">
              <Link
                href={`/dashboard/my-class/${classId}/assignments/${assignmentId}/edit`}
              >
                <FilePenLine className="h-4 w-4" />
                Edit Assignment
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      {canManage ? (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Submission Overview</CardTitle>
            <CardDescription>
              Total submitted: {totalSubmitted}. Open grading workspace to
              review full answers and give scores.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link
                href={`/dashboard/my-class/${classId}/assignments/${assignmentId}/grade`}
              >
                Go to Grading Workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {isStudent ? (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>My Submission</CardTitle>
            <CardDescription>
              {mySubmission
                ? `Last submitted at ${formatDateTimeLabel(mySubmission.submittedAt)}.`
                : "No submission yet."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mySubmission ? (
              <>
                <div className="flex flex-wrap gap-2 text-sm">
                  <Badge variant="outline">Status: {mySubmission.status}</Badge>
                  <Badge variant="secondary">
                    Score: {mySubmission.score ?? "-"}/{maxScore}
                  </Badge>
                </div>
                {mySubmission.feedback?.trim() ? (
                  <div className="rounded-md border border-border/60 bg-muted/20 p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Teacher Feedback
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm">
                      {mySubmission.feedback}
                    </p>
                  </div>
                ) : null}
                <AssignmentSubmissionViewer
                  assignmentType={assignment.type}
                  content={assignment.content}
                  answers={mySubmission.answers}
                  questionGrades={mySubmission.questionGrades}
                />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Submit from workspace page to see your latest answers here.
              </p>
            )}
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}
