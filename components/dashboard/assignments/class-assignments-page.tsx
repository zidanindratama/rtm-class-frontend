"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookCheck,
  CalendarDays,
  FilePlus2,
  Search,
  Settings2,
  Trash2,
  Users,
} from "lucide-react";
import { useGetData } from "@/hooks/use-get-data";
import { usePostData } from "@/hooks/use-post-data";
import { usePatchData } from "@/hooks/use-patch-data";
import { useDeleteData } from "@/hooks/use-delete-data";
import { APIListResponse, APISingleResponse } from "@/types/api-response";
import { ClassDetailResponse } from "@/components/dashboard/classes/class-types";
import { DeleteDialog } from "@/components/globals/dialog/delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { authTokenStorage } from "@/lib/axios-instance";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { UploadResponseData, useUploadFile } from "@/hooks/use-upload-file";
import {
  ASSIGNMENT_STATUS_LABELS,
  ASSIGNMENT_TYPE_LABELS,
  AssignmentListItem,
  AssignmentStatus,
  AssignmentType,
  GradebookRow,
} from "./assignment-types";
import {
  buildQuestionPayload,
  EssayQuestionDraft,
  McqQuestionDraft,
} from "./assignment-form-utils";
import { AssignmentQuestionBuilderSection } from "./assignment-question-builder-section";

type ClassAssignmentsPageProps = {
  classId: string;
  backHref: string;
  backLabel: string;
};

function formatDateLabel(iso?: string | null) {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

export function ClassAssignmentsPage({
  classId,
  backHref,
  backLabel,
}: ClassAssignmentsPageProps) {
  const role = authTokenStorage.getUserRole();
  const canManage = role === "ADMIN" || role === "TEACHER";
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | AssignmentType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | AssignmentStatus>("all");
  const [page, setPage] = useState(1);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignmentType, setAssignmentType] = useState<AssignmentType>("TASK");
  const [assignmentStatus, setAssignmentStatus] = useState<AssignmentStatus>("DRAFT");
  const [passingScore, setPassingScore] = useState("70");
  const [maxScore, setMaxScore] = useState("100");
  const [dueAt, setDueAt] = useState<Date | undefined>(undefined);
  const [contentHtml, setContentHtml] = useState("");
  const [mcqQuestions, setMcqQuestions] = useState<McqQuestionDraft[]>([]);
  const [essayQuestions, setEssayQuestions] = useState<EssayQuestionDraft[]>([]);
  const [mcqBuilderPage, setMcqBuilderPage] = useState(1);
  const [essayBuilderPage, setEssayBuilderPage] = useState(1);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [gradebookPage, setGradebookPage] = useState(1);
  const uploadMutation = useUploadFile<UploadResponseData>({
    endpoint: "/uploads",
    fileFieldName: "file",
    successMessage: "Image uploaded successfully.",
    errorMessage: "Failed to upload image.",
  });

  const handleEditorUpload = async (file: File): Promise<string> => {
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed.");
    }

    const result = await uploadMutation.uploadFile(file);
    return result.url;
  };

  const { data: classDetailResponse } = useGetData<APISingleResponse<ClassDetailResponse>>({
    key: ["class-assignments", "class", classId],
    endpoint: `/classes/${classId}`,
    extractData: false,
    errorMessage: "Failed to load class detail.",
  });

  const {
    data: assignmentsResponse,
    isLoading,
    isError,
  } = useGetData<APIListResponse<AssignmentListItem>>({
    key: [
      "assignments",
      "list",
      classId,
      { page, search, typeFilter, statusFilter },
    ],
    endpoint: "/assignments",
    extractData: false,
    params: {
      classId,
      page,
      per_page: 8,
      search: search.trim() || undefined,
      type: typeFilter === "all" ? undefined : typeFilter,
      status: statusFilter === "all" ? undefined : statusFilter,
      sort_by: "createdAt",
      sort_order: "desc",
    },
    errorMessage: "Failed to load assignments.",
  });

  const { data: gradebookResponse } = useGetData<APIListResponse<GradebookRow>>({
    key: ["assignments", "gradebook", classId, gradebookPage],
    endpoint: `/assignments/classes/${classId}/gradebook`,
    extractData: false,
    enabled: canManage,
    params: {
      page: gradebookPage,
      per_page: 5,
      sort_by: "avgScore",
      sort_order: "desc",
    },
    errorMessage: "Failed to load gradebook.",
  });

  const createMutation = usePostData<unknown, Record<string, unknown>>({
    key: ["assignments", "create", classId],
    endpoint: "/assignments",
    successMessage: "Assignment created successfully.",
    errorMessage: "Failed to create assignment.",
    invalidateKeys: [["assignments", "list", classId], ["classes", classId]],
    options: {
      onSuccess: () => {
        setShowCreateForm(false);
        setTitle("");
        setDescription("");
        setAssignmentType("TASK");
        setAssignmentStatus("DRAFT");
        setPassingScore("70");
        setMaxScore("100");
        setDueAt(undefined);
        setContentHtml("");
        setMcqQuestions([]);
        setEssayQuestions([]);
      },
    },
  });

  const publishMutation = usePatchData<unknown, { id: string; published: boolean }>({
    key: ["assignments", "publish", classId],
    endpoint: (variables) => `/assignments/${variables.id}/publish`,
    successMessage: "Assignment status updated.",
    errorMessage: "Failed to update assignment status.",
    invalidateKeys: [["assignments", "list", classId], ["assignments", "detail"]],
  });

  const closeMutation = usePatchData<unknown, { id: string }>({
    key: ["assignments", "close", classId],
    endpoint: (variables) => `/assignments/${variables.id}/close`,
    successMessage: "Assignment closed.",
    errorMessage: "Failed to close assignment.",
    invalidateKeys: [["assignments", "list", classId], ["assignments", "detail"]],
  });

  const deleteMutation = useDeleteData<unknown, { id: string }>({
    key: ["assignments", "delete", classId],
    endpoint: (variables) => `/assignments/${variables.id}`,
    successMessage: "Assignment deleted.",
    errorMessage: "Failed to delete assignment.",
    invalidateKeys: [["assignments", "list", classId]],
  });

  const classData = classDetailResponse?.data;
  const assignments = assignmentsResponse?.data ?? [];
  const totalPages = Math.max(1, assignmentsResponse?.meta?.total_pages ?? 1);
  const currentPage = assignmentsResponse?.meta?.current_page ?? page;
  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  );

  const gradebookRows = gradebookResponse?.data ?? [];
  const passingScoreValue = Number(passingScore || 0);
  const maxScoreValue = Number(maxScore || 0);
  const isScorePolicyValid = maxScoreValue >= 1 && passingScoreValue >= 0 && passingScoreValue <= maxScoreValue;

  const isMcqType = assignmentType === "QUIZ_MCQ";
  const isEssayType = assignmentType === "QUIZ_ESSAY";
  const builderQuestionPerPage = 10;
  const mcqBuilderTotalPages = Math.max(1, Math.ceil(mcqQuestions.length / builderQuestionPerPage));
  const essayBuilderTotalPages = Math.max(1, Math.ceil(essayQuestions.length / builderQuestionPerPage));
  const activeMcqBuilderPage = Math.min(mcqBuilderPage, mcqBuilderTotalPages);
  const activeEssayBuilderPage = Math.min(essayBuilderPage, essayBuilderTotalPages);
  const questionPayload = useMemo(
    () =>
      buildQuestionPayload({
        isMcqType,
        isEssayType,
        mcqQuestions,
        essayQuestions,
      }),
    [essayQuestions, isEssayType, isMcqType, mcqQuestions],
  );

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

        <h1 className="text-2xl font-semibold tracking-tight">Assignments</h1>
        <p className="text-sm text-muted-foreground">
          {classData
            ? `Manage learning tasks for ${classData.name} (${classData.classCode}).`
            : "Track assignments and student progress for this class."}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Assignment Timeline</CardTitle>
            <CardDescription>Filter and open assignment details quickly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-4">
              <label className="relative block md:col-span-2">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search assignment title"
                  className="pl-9"
                />
              </label>

              <Select
                value={typeFilter}
                onValueChange={(value) => {
                  setTypeFilter(value as "all" | AssignmentType);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {(Object.keys(ASSIGNMENT_TYPE_LABELS) as AssignmentType[]).map((type) => (
                    <SelectItem key={type} value={type}>
                      {ASSIGNMENT_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as "all" | AssignmentStatus);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {(Object.keys(ASSIGNMENT_STATUS_LABELS) as AssignmentStatus[]).map(
                    (status) => (
                      <SelectItem key={status} value={status}>
                        {ASSIGNMENT_STATUS_LABELS[status]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            {canManage ? (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant={showCreateForm ? "outline" : "default"}
                  onClick={() => setShowCreateForm((open) => !open)}
                >
                  <FilePlus2 className="h-4 w-4" />
                  {showCreateForm ? "Close Form" : "Create Assignment"}
                </Button>
              </div>
            ) : null}

            {showCreateForm ? (
              <div className="space-y-5 rounded-2xl border border-border/70 bg-muted/20 p-5 md:p-6">
                <div className="rounded-xl border border-border/70 bg-background/80 p-4">
                  <p className="text-sm font-semibold">Assignment Overview</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Set core information first so this assignment is easy to identify in class timeline.
                  </p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <Input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="Assignment title"
                      className="md:col-span-2"
                    />
                    <Textarea
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Assignment description"
                      className="md:col-span-2 min-h-[90px]"
                    />
                    <Select
                      value={assignmentType}
                      onValueChange={(value) => {
                        setAssignmentType(value as AssignmentType);
                        setMcqBuilderPage(1);
                        setEssayBuilderPage(1);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(ASSIGNMENT_TYPE_LABELS) as AssignmentType[]).map((type) => (
                          <SelectItem key={type} value={type}>
                            {ASSIGNMENT_TYPE_LABELS[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={assignmentStatus}
                      onValueChange={(value) => setAssignmentStatus(value as AssignmentStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(ASSIGNMENT_STATUS_LABELS) as AssignmentStatus[]).map(
                          (status) => (
                            <SelectItem key={status} value={status}>
                              {ASSIGNMENT_STATUS_LABELS[status]}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-border/70 bg-background/80 p-4">
                    <p className="text-sm font-semibold">Scoring Policy</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Define the passing threshold and total achievable score so students clearly know grading expectations.
                    </p>
                    <div className="mt-3 grid gap-3">
                      <label className="space-y-1">
                        <p className="text-xs text-muted-foreground">Minimum Passing Score</p>
                        <Input
                          type="number"
                          value={passingScore}
                          onChange={(event) => setPassingScore(event.target.value)}
                          placeholder="Example: 70"
                        />
                      </label>
                      <label className="space-y-1">
                        <p className="text-xs text-muted-foreground">Maximum Score</p>
                        <Input
                          type="number"
                          value={maxScore}
                          onChange={(event) => setMaxScore(event.target.value)}
                          placeholder="Example: 100"
                        />
                      </label>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Students pass when score is at least{" "}
                      <span className="font-medium text-foreground">{passingScoreValue || 0}</span>{" "}
                      out of{" "}
                      <span className="font-medium text-foreground">{maxScoreValue || 0}</span>.
                    </p>
                    {!isScorePolicyValid ? (
                      <p className="mt-2 text-xs text-destructive">
                        Passing score must be less than or equal to maximum score.
                      </p>
                    ) : null}
                  </div>

                  <div className="rounded-xl border border-border/70 bg-background/80 p-4">
                    <p className="text-sm font-semibold">Due Date & Time</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Choose a clear deadline for students. Leave empty if there is no deadline.
                    </p>
                    <div className="mt-3 space-y-2">
                      <DateTimePicker
                        value={dueAt}
                        onChange={setDueAt}
                        granularity="minute"
                        hourCycle={24}
                        placeholder="Select due date and time"
                        className="w-full"
                      />
                      {dueAt ? (
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setDueAt(undefined)}
                          >
                            Clear
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border/70 bg-background/80 p-4">
                  <p className="text-sm font-semibold">Assignment Content</p>
                  <p className="text-xs text-muted-foreground">
                    Use rich text to explain instructions, context, and rules for students.
                  </p>
                  <MinimalTiptapEditor
                    value={contentHtml}
                    onChange={(value) => setContentHtml(String(value ?? ""))}
                    className="w-full min-h-140"
                    editorClassName="focus:outline-hidden p-5"
                    placeholder="Write assignment instructions..."
                    throttleDelay={0}
                    editable
                    injectCSS
                    uploader={handleEditorUpload}
                  />
                </div>

                <AssignmentQuestionBuilderSection
                  assignmentType={assignmentType}
                  mcqQuestions={mcqQuestions}
                  essayQuestions={essayQuestions}
                  setMcqQuestions={setMcqQuestions}
                  setEssayQuestions={setEssayQuestions}
                  mcqBuilderPage={activeMcqBuilderPage}
                  essayBuilderPage={activeEssayBuilderPage}
                  setMcqBuilderPage={setMcqBuilderPage}
                  setEssayBuilderPage={setEssayBuilderPage}
                  builderQuestionPerPage={builderQuestionPerPage}
                  emptyMessage="No question added yet. Use the button above to add questions for this assignment type."
                  optionalMessage="Question builder is optional for this assignment type. You can still write full instructions in the rich text editor above."
                  titleDescription="Compose questions directly in this assignment so students can answer clearly."
                  showMcqScoringControls
                  showEssayPoints
                />

                <div className="flex justify-end border-t border-border/60 pt-4">
                  <Button
                    type="button"
                    onClick={() =>
                      createMutation.mutate({
                        classId,
                        title: title.trim(),
                        description: description.trim() || undefined,
                        type: assignmentType,
                        status: assignmentStatus,
                        passingScore: passingScoreValue || 0,
                        maxScore: maxScoreValue || 100,
                        dueAt: dueAt?.toISOString(),
                        content: {
                          richTextHtml: contentHtml,
                          questionSet: questionPayload,
                        },
                      })
                    }
                    disabled={
                      createMutation.isPending ||
                      title.trim().length < 3 ||
                      !isScorePolicyValid
                    }
                  >
                    {createMutation.isPending ? "Creating..." : "Save Assignment"}
                  </Button>
                </div>
              </div>
            ) : null}

            {isLoading ? (
              <p className="py-8 text-sm text-muted-foreground">Loading assignments...</p>
            ) : isError ? (
              <p className="py-8 text-sm text-muted-foreground">Unable to load assignments.</p>
            ) : assignments.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/70 p-8 text-center">
                <p className="text-sm text-muted-foreground">No assignments found.</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <article key={assignment.id} className="rounded-xl border border-border/70 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">{assignment.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {assignment.description?.trim() || "No description."}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{ASSIGNMENT_TYPE_LABELS[assignment.type]}</Badge>
                          <Badge
                            variant={
                              assignment.status === "PUBLISHED"
                                ? "default"
                                : assignment.status === "CLOSED"
                                  ? "destructive"
                                  : "outline"
                            }
                          >
                            {ASSIGNMENT_STATUS_LABELS[assignment.status]}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Due: {formatDateLabel(assignment.dueAt)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          Submissions: {assignment._count.submissions}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <BookCheck className="h-3.5 w-3.5" />
                          Pass/Max: {assignment.passingScore}/{assignment.maxScore}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/dashboard/my-class/${classId}/assignments/${assignment.id}`}>
                            Open Detail
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>

                        {canManage ? (
                          <div className="flex flex-wrap gap-2">
                            {assignment.status === "DRAFT" ? (
                              <Button
                                type="button"
                                size="sm"
                                onClick={() =>
                                  publishMutation.mutate({ id: assignment.id, published: true })
                                }
                                disabled={publishMutation.isPending}
                              >
                                Publish
                              </Button>
                            ) : assignment.status === "PUBLISHED" ? (
                              <>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    publishMutation.mutate({ id: assignment.id, published: false })
                                  }
                                  disabled={publishMutation.isPending}
                                >
                                  Unpublish
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => closeMutation.mutate({ id: assignment.id })}
                                  disabled={closeMutation.isPending}
                                >
                                  Close
                                </Button>
                              </>
                            ) : null}
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => setPendingDeleteId(assignment.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>

                {totalPages > 1 ? (
                  <div className="flex flex-wrap items-center justify-center gap-2 border-t border-border/60 pt-4">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      className="h-9 rounded-md border border-border/70 px-3 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>
                    {pageNumbers.map((pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setPage(pageNumber)}
                        className={`h-9 min-w-9 rounded-md border px-3 text-sm transition-colors ${
                          currentPage === pageNumber
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border/70 hover:border-primary/40"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                      className="h-9 rounded-md border border-border/70 px-3 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Grade Snapshot
            </CardTitle>
            <CardDescription>
              {canManage
                ? "Quick view of top student averages."
                : "Your teacher can publish score recap after grading."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {canManage ? (
              gradebookRows.length === 0 ? (
                <p className="text-muted-foreground">No gradebook data yet.</p>
              ) : (
                <>
                  {gradebookRows.map((row) => (
                    <div key={row.student.id} className="rounded-lg border border-border/70 p-3">
                      <p className="font-medium">{row.student.fullName}</p>
                      <p className="text-xs text-muted-foreground">{row.student.email}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>Avg: {row.avgScore?.toFixed(1) ?? "-"}</span>
                        <span>Submitted: {row.submittedCount}/{row.totalAssignments}</span>
                        <span>Rate: {row.submissionRate.toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}

                  {(gradebookResponse?.meta?.total_pages ?? 1) > 1 ? (
                    <div className="flex items-center justify-between border-t border-border/60 pt-3">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setGradebookPage((current) => Math.max(1, current - 1))}
                        disabled={(gradebookResponse?.meta?.current_page ?? 1) <= 1}
                      >
                        Prev
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        Page {gradebookResponse?.meta?.current_page ?? 1} of{" "}
                        {gradebookResponse?.meta?.total_pages ?? 1}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setGradebookPage((current) =>
                            Math.min(gradebookResponse?.meta?.total_pages ?? 1, current + 1),
                          )
                        }
                        disabled={
                          (gradebookResponse?.meta?.current_page ?? 1) >=
                          (gradebookResponse?.meta?.total_pages ?? 1)
                        }
                      >
                        Next
                      </Button>
                    </div>
                  ) : null}
                </>
              )
            ) : (
              <p className="text-muted-foreground">
                Use assignment detail pages to submit your answers and check your grades.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <DeleteDialog
        open={Boolean(pendingDeleteId)}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteId(null);
        }}
        title="Delete assignment?"
        description="This action cannot be undone."
        confirmText="Delete"
        onConfirm={() => {
          if (!pendingDeleteId) return;
          const id = pendingDeleteId;
          setPendingDeleteId(null);
          deleteMutation.mutate({ id });
        }}
      />
    </section>
  );
}
