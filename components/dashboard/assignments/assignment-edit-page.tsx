"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { useGetData } from "@/hooks/use-get-data";
import { usePatchData } from "@/hooks/use-patch-data";
import { APISingleResponse } from "@/types/api-response";
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
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { UploadResponseData, useUploadFile } from "@/hooks/use-upload-file";
import {
  ASSIGNMENT_STATUS_LABELS,
  ASSIGNMENT_TYPE_LABELS,
  AssignmentDetail,
  AssignmentStatus,
  AssignmentType,
} from "./assignment-types";
import {
  buildQuestionPayload,
  EssayQuestionDraft,
  McqQuestionDraft,
  parseAssignmentContentToDrafts,
} from "./assignment-form-utils";
import { AssignmentQuestionBuilderSection } from "./assignment-question-builder-section";

type AssignmentEditPageProps = {
  classId: string;
  assignmentId: string;
};

export function AssignmentEditPage({ classId, assignmentId }: AssignmentEditPageProps) {
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
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

  const { data: detailResponse, isLoading, isError } = useGetData<APISingleResponse<AssignmentDetail>>({
    key: ["assignments", "detail", assignmentId, "edit-page"],
    endpoint: `/assignments/${assignmentId}`,
    extractData: false,
    errorMessage: "Failed to load assignment detail.",
  });

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (initialized || !detailResponse?.data) return;

    const assignment = detailResponse.data;
    const content = parseAssignmentContentToDrafts(assignment.content);

    setTitle(assignment.title);
    setDescription(assignment.description ?? "");
    setAssignmentType(assignment.type);
    setAssignmentStatus(assignment.status);
    setPassingScore(String(assignment.passingScore));
    setMaxScore(String(assignment.maxScore));
    setDueAt(assignment.dueAt ? new Date(assignment.dueAt) : undefined);
    setContentHtml(content.richTextHtml);
    setMcqQuestions(content.mcq);
    setEssayQuestions(content.essay);
    setInitialized(true);
  }, [detailResponse, initialized]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const assignment = detailResponse?.data;
  const hasSubmissions = (assignment?._count.submissions ?? 0) > 0;
  const isClosed = assignment?.status === "CLOSED";
  const isMcqType = assignmentType === "QUIZ_MCQ";
  const isEssayType = assignmentType === "QUIZ_ESSAY";
  const builderQuestionPerPage = 10;
  const canEditCoreAssessment = !hasSubmissions && !isClosed;
  const canSave = !isClosed && title.trim().length >= 3;

  const mcqBuilderTotalPages = Math.max(1, Math.ceil(mcqQuestions.length / builderQuestionPerPage));
  const essayBuilderTotalPages = Math.max(1, Math.ceil(essayQuestions.length / builderQuestionPerPage));
  const activeMcqBuilderPage = Math.min(mcqBuilderPage, mcqBuilderTotalPages);
  const activeEssayBuilderPage = Math.min(essayBuilderPage, essayBuilderTotalPages);

  const passingScoreValue = Number(passingScore || 0);
  const maxScoreValue = Number(maxScore || 0);
  const isScorePolicyValid =
    maxScoreValue >= 1 && passingScoreValue >= 0 && passingScoreValue <= maxScoreValue;

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

  const updateMutation = usePatchData<unknown, Record<string, unknown>>({
    key: ["assignments", "update", assignmentId],
    endpoint: `/assignments/${assignmentId}`,
    successMessage: "Assignment updated successfully.",
    errorMessage: "Failed to update assignment.",
    invalidateKeys: [["assignments", "detail", assignmentId], ["assignments", "list", classId]],
    options: {
      onSuccess: () => {
        router.push(`/dashboard/my-class/${classId}/assignments/${assignmentId}`);
      },
    },
  });

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
        <h1 className="text-2xl font-semibold tracking-tight">Edit Assignment</h1>
        <p className="text-sm text-muted-foreground">
          Update assignment content and settings with safe restrictions.
        </p>
      </div>

      {hasSubmissions ? (
        <Card className="border-amber-300/60 bg-amber-50/50">
          <CardContent className="py-4 text-sm text-amber-900">
            This assignment already has submissions. Type, scoring, and question content are locked to prevent grading inconsistencies.
          </CardContent>
        </Card>
      ) : null}

      {isClosed ? (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="py-4 text-sm text-destructive">
            This assignment is closed. Reopen it first from detail page before editing.
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Assignment Form</CardTitle>
          <CardDescription>Only allowed fields can be updated based on current assignment state.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="rounded-xl border border-border/70 bg-background/80 p-4">
            <p className="text-sm font-semibold">Assignment Overview</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Assignment title"
                className="md:col-span-2"
                disabled={isClosed}
              />

              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Assignment description"
                className="md:col-span-2 min-h-[90px]"
                disabled={isClosed}
              />

              <Select
                value={assignmentType}
                onValueChange={(value) => {
                  setAssignmentType(value as AssignmentType);
                  setMcqBuilderPage(1);
                  setEssayBuilderPage(1);
                }}
                disabled={!canEditCoreAssessment}
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
                disabled={isClosed}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ASSIGNMENT_STATUS_LABELS) as AssignmentStatus[]).map((status) => (
                    <SelectItem key={status} value={status}>
                      {ASSIGNMENT_STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-background/80 p-4">
              <p className="text-sm font-semibold">Scoring Policy</p>
              <div className="mt-3 space-y-3">
                <label className="space-y-1">
                  <p className="text-xs text-muted-foreground">Minimum Passing Score</p>
                  <Input
                    type="number"
                    value={passingScore}
                    onChange={(event) => setPassingScore(event.target.value)}
                    disabled={!canEditCoreAssessment}
                  />
                </label>

                <label className="space-y-1">
                  <p className="text-xs text-muted-foreground">Maximum Score</p>
                  <Input
                    type="number"
                    value={maxScore}
                    onChange={(event) => setMaxScore(event.target.value)}
                    disabled={!canEditCoreAssessment}
                  />
                </label>
              </div>

              {!isScorePolicyValid ? (
                <p className="mt-2 text-xs text-destructive">
                  Passing score must be less than or equal to maximum score.
                </p>
              ) : null}
            </div>

            <div className="rounded-xl border border-border/70 bg-background/80 p-4">
              <p className="text-sm font-semibold">Due Date & Time</p>
              <div className="mt-3 space-y-2">
                <DateTimePicker
                  value={dueAt}
                  onChange={setDueAt}
                  granularity="minute"
                  hourCycle={24}
                  placeholder="Select due date and time"
                  className="w-full"
                  disabled={isClosed}
                />

                {dueAt ? (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDueAt(undefined)}
                      disabled={isClosed}
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
            <MinimalTiptapEditor
              value={contentHtml}
              onChange={(value) => setContentHtml(String(value ?? ""))}
              className="mt-3 w-full min-h-140"
              editorClassName="focus:outline-hidden p-5"
              placeholder="Write assignment instructions..."
              throttleDelay={0}
              editable={canEditCoreAssessment}
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
            canEdit={canEditCoreAssessment}
            lockedMessage="Question editing is locked."
            emptyMessage="No question added yet."
            optionalMessage="Question builder is optional for this assignment type."
            showMcqScoringControls
            showEssayPoints
          />

          <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
            <Button asChild type="button" variant="outline">
              <Link href={`/dashboard/my-class/${classId}/assignments/${assignmentId}`}>Cancel</Link>
            </Button>

            <Button
              type="button"
              onClick={() =>
                updateMutation.mutate({
                  title: title.trim(),
                  description: description.trim() || undefined,
                  status: assignmentStatus,
                  dueAt: dueAt?.toISOString(),
                  ...(canEditCoreAssessment
                    ? {
                        type: assignmentType,
                        passingScore: passingScoreValue || 0,
                        maxScore: maxScoreValue || 100,
                        content: {
                          richTextHtml: contentHtml,
                          questionSet: questionPayload,
                        },
                      }
                    : {}),
                })
              }
              disabled={updateMutation.isPending || !canSave || !isScorePolicyValid}
            >
              <Save className="h-4 w-4" />
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
