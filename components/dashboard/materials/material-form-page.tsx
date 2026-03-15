"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Loader2, OctagonAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DeleteDialog } from "@/components/globals/dialog/delete-dialog";
import { useGetData } from "@/hooks/use-get-data";
import { useDeleteData } from "@/hooks/use-delete-data";
import { usePatchData } from "@/hooks/use-patch-data";
import { usePostData } from "@/hooks/use-post-data";
import { UploadField } from "@/components/globals/upload/upload-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ClassDetailResponse } from "@/components/dashboard/classes/class-types";
import { APISingleResponse } from "@/types/api-response";
import {
  MaterialAiJob,
  MaterialJobsResponse,
  CreateMaterialPayload,
  MaterialDetailResponse,
  MaterialCreateResponse,
  MaterialOutputItem,
} from "./material-types";

const createMaterialSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().optional(),
  fileUrl: z.string().trim().url("File URL must be a valid URL."),
});

type CreateMaterialValues = z.infer<typeof createMaterialSchema>;

type MaterialFormPageProps =
  | { mode: "create"; classId: string; materialId?: never }
  | { mode: "edit"; classId: string; materialId: string };

type EditableMcqQuestion = {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctOption: "A" | "B" | "C" | "D";
  explanation: string;
};

type EditableEssayQuestion = {
  id: string;
  question: string;
  expectedPoints: string;
};

type TriggerAiPayload = {
  materialId: string;
  outputs: Array<"MCQ" | "ESSAY" | "SUMMARY">;
  options?: {
    mcqCount?: number;
    essayCount?: number;
    summaryMaxWords?: number;
    mcpEnabled?: boolean;
  };
};

function toOptionalTrimmed(value: string | undefined) {
  const nextValue = value?.trim();
  return nextValue ? nextValue : undefined;
}

function inferMimeTypeFromFileUrl(fileUrl: string) {
  const normalizedUrl = fileUrl.trim().toLowerCase();
  const withoutQuery = normalizedUrl.split("?")[0]?.split("#")[0] ?? "";

  if (withoutQuery.endsWith(".pdf")) return "application/pdf";
  if (withoutQuery.endsWith(".doc")) return "application/msword";
  if (withoutQuery.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  if (withoutQuery.endsWith(".ppt")) return "application/vnd.ms-powerpoint";
  if (withoutQuery.endsWith(".pptx")) {
    return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  }
  if (withoutQuery.endsWith(".xls")) return "application/vnd.ms-excel";
  if (withoutQuery.endsWith(".xlsx")) {
    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  }
  if (withoutQuery.endsWith(".csv")) return "text/csv";
  if (withoutQuery.endsWith(".txt")) return "text/plain";
  if (withoutQuery.endsWith(".mp4")) return "video/mp4";
  if (withoutQuery.endsWith(".mov")) return "video/quicktime";
  if (withoutQuery.endsWith(".mp3")) return "audio/mpeg";
  if (withoutQuery.endsWith(".wav")) return "audio/wav";

  return undefined;
}

function formatDateTimeLabel(iso?: string | null) {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getJobStatusBadgeVariant(status: MaterialAiJob["status"]) {
  if (status === "succeeded") return "default" as const;
  if (status === "failed_processing" || status === "failed_delivery") {
    return "destructive" as const;
  }
  if (status === "processing") return "secondary" as const;
  return "outline" as const;
}

function getJobStatusLabel(status: MaterialAiJob["status"]) {
  if (status === "accepted") return "Queued";
  if (status === "processing") return "Processing";
  if (status === "succeeded") return "Succeeded";
  if (status === "failed_processing") return "Failed (Processing)";
  if (status === "failed_delivery") return "Failed (Delivery)";
  return status;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function getOutputPreview(output: MaterialOutputItem) {
  const content = asRecord(output.content);
  if (!content) return "No content preview available.";

  if (output.type === "SUMMARY") {
    const summary = asRecord(content.summary);
    const title = typeof summary?.title === "string" ? summary.title : null;
    const overview =
      typeof summary?.overview === "string" ? summary.overview : null;
    if (title && overview) return `${title} - ${overview}`;
    if (overview) return overview;
    if (title) return title;
  }

  if (output.type === "MCQ") {
    const quiz = asRecord(content.mcq_quiz);
    const questions = Array.isArray(quiz?.questions) ? quiz.questions : [];
    return `${questions.length} MCQ question(s) generated.`;
  }

  if (output.type === "ESSAY") {
    const quiz = asRecord(content.essay_quiz);
    const questions = Array.isArray(quiz?.questions) ? quiz.questions : [];
    return `${questions.length} essay question(s) generated.`;
  }

  const raw = JSON.stringify(content);
  return raw.length > 200 ? `${raw.slice(0, 200)}...` : raw;
}

function parseMcqQuestions(output: MaterialOutputItem): EditableMcqQuestion[] {
  const root = asRecord(output.editedContent ?? output.content);
  const quiz = asRecord(root?.mcq_quiz);
  const questions = Array.isArray(quiz?.questions) ? quiz.questions : [];

  const parsed = questions
    .map((item, index) => {
      const row = asRecord(item);
      if (!row) return null;

      const question = typeof row.question === "string" ? row.question : "";
      const optionsRaw = Array.isArray(row.options) ? row.options : [];
      const options = optionsRaw
        .filter((option): option is string => typeof option === "string")
        .slice(0, 4);

      if (options.length !== 4) return null;

      const correctAnswer =
        typeof row.correct_answer === "string" ? row.correct_answer : "";
      const optionIndex = options.findIndex(
        (option) => option.trim().toLowerCase() === correctAnswer.trim().toLowerCase(),
      );
      const correctOption =
        optionIndex === 0
          ? "A"
          : optionIndex === 1
            ? "B"
            : optionIndex === 2
              ? "C"
              : optionIndex === 3
                ? "D"
                : "A";

      return {
        id: `mcq-${index + 1}`,
        question,
        options: [options[0] ?? "", options[1] ?? "", options[2] ?? "", options[3] ?? ""],
        correctOption,
        explanation:
          typeof row.explanation === "string"
            ? row.explanation
            : "",
      } as EditableMcqQuestion;
    })
    .filter((item): item is EditableMcqQuestion => Boolean(item));

  if (parsed.length > 0) return parsed;

  return [
    {
      id: "mcq-1",
      question: "",
      options: ["", "", "", ""],
      correctOption: "A",
      explanation: "",
    },
  ];
}

function parseEssayQuestions(output: MaterialOutputItem): EditableEssayQuestion[] {
  const root = asRecord(output.editedContent ?? output.content);
  const quiz = asRecord(root?.essay_quiz);
  const questions = Array.isArray(quiz?.questions) ? quiz.questions : [];

  const parsed = questions
    .map((item, index) => {
      const row = asRecord(item);
      if (!row) return null;

      return {
        id: `essay-${index + 1}`,
        question: typeof row.question === "string" ? row.question : "",
        expectedPoints:
          typeof row.expected_points === "string" ? row.expected_points : "",
      } as EditableEssayQuestion;
    })
    .filter((item): item is EditableEssayQuestion => Boolean(item));

  if (parsed.length > 0) return parsed;

  return [
    {
      id: "essay-1",
      question: "",
      expectedPoints: "",
    },
  ];
}

function isMcqQuestionValid(question: EditableMcqQuestion) {
  const hasQuestion = question.question.trim().length > 0;
  const hasAllOptions = question.options.every((option) => option.trim().length > 0);
  return hasQuestion && hasAllOptions;
}

function isEssayQuestionValid(question: EditableEssayQuestion) {
  const hasQuestion = question.question.trim().length > 0;
  const hasExpectedPoints = question.expectedPoints.trim().length > 0;
  return hasQuestion && hasExpectedPoints;
}

export function MaterialFormPage(props: MaterialFormPageProps) {
  const { classId } = props;
  const isEditMode = props.mode === "edit";
  const materialId = isEditMode ? props.materialId : undefined;
  const router = useRouter();
  const backHref = `/dashboard/my-class/${classId}/materials`;
  const [editingOutputId, setEditingOutputId] = useState<string | null>(null);
  const [editingOutputType, setEditingOutputType] = useState<"MCQ" | "ESSAY" | null>(null);
  const [editedMcqQuestions, setEditedMcqQuestions] = useState<EditableMcqQuestion[]>([]);
  const [editedEssayQuestions, setEditedEssayQuestions] = useState<EditableEssayQuestion[]>([]);
  const [savingOutputId, setSavingOutputId] = useState<string | null>(null);
  const [publishingOutputId, setPublishingOutputId] = useState<string | null>(null);
  const [creatingAssignmentOutputId, setCreatingAssignmentOutputId] = useState<string | null>(
    null,
  );
  const [runningAiType, setRunningAiType] = useState<"MCQ" | "ESSAY" | "SUMMARY" | "ALL" | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    data: classDetailResponse,
    isLoading: isLoadingClass,
    isError: isClassError,
  } = useGetData<APISingleResponse<ClassDetailResponse>>({
    key: ["class-materials", "class", classId],
    endpoint: `/classes/${classId}`,
    extractData: false,
    errorMessage: "Failed to load class detail.",
  });

  const {
    data: materialDetailResponse,
    isLoading: isLoadingMaterialDetail,
    isError: isMaterialDetailError,
  } = useGetData<APISingleResponse<MaterialDetailResponse>>({
    key: ["class-materials", "detail", materialId],
    endpoint: `/materials/${materialId}`,
    extractData: false,
    enabled: isEditMode && Boolean(materialId),
    errorMessage: "Failed to load material detail.",
  });

  const {
    data: jobsResponse,
    isLoading: isLoadingJobs,
    isError: isJobsError,
  } = useGetData<APISingleResponse<MaterialJobsResponse>>({
    key: ["material-ai-jobs", materialId],
    endpoint: `/materials/${materialId}/jobs`,
    extractData: false,
    enabled: isEditMode && Boolean(materialId),
    params: {
      includeOverview: true,
    },
    errorMessage: "Failed to load AI jobs.",
    options: {
      refetchInterval: 4000,
    },
  });

  const hasPendingJobs =
    jobsResponse?.data?.overview?.hasPendingJobs ??
    jobsResponse?.data?.jobs?.some(
      (job) => job.status === "accepted" || job.status === "processing",
    ) ??
    false;

  const {
    data: outputsResponse,
    isLoading: isLoadingOutputs,
    isError: isOutputsError,
  } = useGetData<APISingleResponse<MaterialOutputItem[]>>({
    key: ["material-ai-outputs", materialId],
    endpoint: `/materials/${materialId}/outputs`,
    extractData: false,
    enabled: isEditMode && Boolean(materialId),
    errorMessage: "Failed to load AI outputs.",
    options: {
      refetchInterval: hasPendingJobs ? 4000 : false,
    },
  });

  const createMaterialMutation = usePostData<
    APISingleResponse<MaterialCreateResponse>,
    CreateMaterialPayload
  >({
    key: ["class-materials", "create", classId],
    endpoint: "/materials",
    extractData: false,
    successMessage: (response) =>
      response.message || "Material created successfully.",
    errorMessage: "Failed to create material.",
    invalidateKeys: [
      ["class-materials", "list", classId],
      ["class-materials", "class", classId],
    ],
    options: {
      onSuccess: () => {
        router.push(backHref);
      },
    },
  });

  const enqueueAiMutation = usePostData<
    APISingleResponse<{ materialId: string; jobs: MaterialAiJob[] }>,
    TriggerAiPayload
  >({
    key: ["material-ai-enqueue", materialId],
    endpoint: "/ai/jobs/transform",
    extractData: false,
    successMessage: (response) => response.message || "AI jobs queued successfully.",
    errorMessage: "Failed to queue AI job.",
    invalidateKeys: [
      ["material-ai-jobs", materialId],
      ["material-ai-outputs", materialId],
      ["class-materials", "list", classId],
      ["class-materials", "detail", materialId],
    ],
    options: {
      onSuccess: () => {
        setRunningAiType(null);
      },
      onError: () => {
        setRunningAiType(null);
      },
    },
  });

  const deleteMaterialMutation = useDeleteData<
    APISingleResponse<null>,
    { materialId: string }
  >({
    key: ["class-materials", "delete", materialId],
    endpoint: (variables) => `/materials/${variables.materialId}`,
    extractData: false,
    successMessage: (response) => response.message || "Material deleted successfully.",
    errorMessage: "Failed to delete material.",
    invalidateKeys: [
      ["class-materials", "list", classId],
      ["class-materials", "class", classId],
      ["class-materials", "detail", materialId],
      ["material-ai-jobs", materialId],
      ["material-ai-outputs", materialId],
    ],
    options: {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        router.push(backHref);
      },
      onError: () => {
        setIsDeleteDialogOpen(false);
      },
    },
  });

  const editOutputMutation = usePatchData<
    APISingleResponse<MaterialOutputItem>,
    { outputId: string; editedContent: Record<string, unknown> }
  >({
    key: ["material-ai-output-edit", materialId],
    endpoint: (variables) => `/materials/${materialId}/outputs/${variables.outputId}`,
    extractData: false,
    successMessage: "AI output content updated.",
    errorMessage: "Failed to update AI output content.",
    invalidateKeys: [
      ["material-ai-outputs", materialId],
      ["material-ai-jobs", materialId],
    ],
    options: {
      onSuccess: () => {
        setSavingOutputId(null);
        setEditingOutputId(null);
        setEditingOutputType(null);
        setEditedMcqQuestions([]);
        setEditedEssayQuestions([]);
      },
      onError: () => {
        setSavingOutputId(null);
      },
    },
  });

  const publishOutputMutation = usePatchData<
    APISingleResponse<MaterialOutputItem>,
    { outputId: string; publish: boolean }
  >({
    key: ["material-ai-output-publish", materialId],
    endpoint: (variables) =>
      `/materials/${materialId}/outputs/${variables.outputId}/publish`,
    extractData: false,
    successMessage: (response) =>
      response.message || "AI output publish status updated.",
    errorMessage: "Failed to update AI output publish status.",
    invalidateKeys: [
      ["material-ai-outputs", materialId],
      ["material-ai-jobs", materialId],
    ],
    options: {
      onSuccess: () => {
        setPublishingOutputId(null);
      },
      onError: () => {
        setPublishingOutputId(null);
      },
    },
  });

  const createAssignmentFromOutputMutation = usePostData<
    APISingleResponse<{ id: string }>,
    { outputId: string; status?: "DRAFT" | "PUBLISHED" | "CLOSED" }
  >({
    key: ["material-ai-output-create-assignment", materialId],
    endpoint: (variables) =>
      `/materials/${materialId}/outputs/${variables.outputId}/create-assignment`,
    extractData: false,
    successMessage: "Assignment created from AI output.",
    errorMessage: "Failed to create assignment from AI output.",
    invalidateKeys: [
      ["assignments", "list", classId],
      ["class-assignments", "class", classId],
      ["material-ai-outputs", materialId],
    ],
    options: {
      onSuccess: (response) => {
        setCreatingAssignmentOutputId(null);
        const assignmentId = response?.data?.id;
        if (assignmentId) {
          router.push(`/dashboard/my-class/${classId}/assignments/${assignmentId}`);
        }
      },
      onError: () => {
        setCreatingAssignmentOutputId(null);
      },
    },
  });

  const form = useForm<CreateMaterialValues>({
    resolver: zodResolver(createMaterialSchema),
    defaultValues: {
      title: "",
      description: "",
      fileUrl: "",
    },
  });

  useEffect(() => {
    if (!isEditMode || !materialDetailResponse?.data) return;

    const detail = materialDetailResponse.data as MaterialDetailResponse & {
      fileUrl?: string | null;
    };

    form.reset({
      title: detail.title ?? "",
      description: detail.description ?? "",
      fileUrl: detail.sourceUrl ?? detail.fileUrl ?? "",
    });
  }, [form, isEditMode, materialDetailResponse]);

  const handleCreate = (values: CreateMaterialValues) => {
    createMaterialMutation.mutate({
      classId,
      title: values.title.trim(),
      fileUrl: values.fileUrl.trim(),
      description: toOptionalTrimmed(values.description),
      fileMimeType: inferMimeTypeFromFileUrl(values.fileUrl),
    });
  };

  const handleTriggerAiJobs = (outputs: Array<"MCQ" | "ESSAY" | "SUMMARY">) => {
    if (!materialId || outputs.length === 0) return;

    const runningTypeLabel = outputs.length > 1 ? "ALL" : outputs[0];
    setRunningAiType(runningTypeLabel);

    enqueueAiMutation.mutate({
      materialId,
      outputs,
      options: {
        mcqCount: 10,
        essayCount: 5,
        summaryMaxWords: 200,
        mcpEnabled: true,
      },
    });
  };

  const handleDeleteMaterial = () => {
    if (!materialId) return;
    deleteMaterialMutation.mutate({ materialId });
  };

  const classData = classDetailResponse?.data;
  const materialData = materialDetailResponse?.data as
    | (MaterialDetailResponse & {
        fileUrl?: string | null;
        uploadedBy?: { id: string; fullName: string } | null;
      })
    | undefined;

  const teacherName =
    materialData?.teacher?.fullName?.trim() ||
    materialData?.uploadedBy?.fullName?.trim() ||
    "";

  const groupedOutputs = useMemo(() => {
    const source = outputsResponse?.data ?? [];
    return source.reduce<Record<string, MaterialOutputItem[]>>((acc, output) => {
      if (!acc[output.type]) {
        acc[output.type] = [];
      }
      acc[output.type].push(output);
      return acc;
    }, {});
  }, [outputsResponse?.data]);

  const selectedEditingOutput = useMemo(
    () => (outputsResponse?.data ?? []).find((output) => output.id === editingOutputId) ?? null,
    [editingOutputId, outputsResponse?.data],
  );

  const mcqInvalidIndexes = useMemo(
    () =>
      editedMcqQuestions
        .map((question, index) => (isMcqQuestionValid(question) ? null : index))
        .filter((index): index is number => typeof index === "number"),
    [editedMcqQuestions],
  );

  const essayInvalidIndexes = useMemo(
    () =>
      editedEssayQuestions
        .map((question, index) => (isEssayQuestionValid(question) ? null : index))
        .filter((index): index is number => typeof index === "number"),
    [editedEssayQuestions],
  );

  const canSaveEditedOutput = useMemo(() => {
    if (editingOutputType === "MCQ") {
      return editedMcqQuestions.length > 0 && mcqInvalidIndexes.length === 0;
    }

    if (editingOutputType === "ESSAY") {
      return editedEssayQuestions.length > 0 && essayInvalidIndexes.length === 0;
    }

    return false;
  }, [
    editedEssayQuestions.length,
    editedMcqQuestions.length,
    editingOutputType,
    essayInvalidIndexes.length,
    mcqInvalidIndexes.length,
  ]);

  const mcqValidCount = editedMcqQuestions.length - mcqInvalidIndexes.length;
  const essayValidCount = editedEssayQuestions.length - essayInvalidIndexes.length;

  const startEditOutput = (output: MaterialOutputItem) => {
    if (output.type !== "MCQ" && output.type !== "ESSAY") {
      return;
    }

    setEditingOutputId(output.id);
    setEditingOutputType(output.type);

    if (output.type === "MCQ") {
      setEditedMcqQuestions(parseMcqQuestions(output));
      setEditedEssayQuestions([]);
      return;
    }

    setEditedEssayQuestions(parseEssayQuestions(output));
    setEditedMcqQuestions([]);
  };

  const saveEditedOutput = (outputId: string) => {
    if (!selectedEditingOutput || selectedEditingOutput.id !== outputId) {
      return;
    }
    if (!canSaveEditedOutput) {
      return;
    }

    const root = asRecord(selectedEditingOutput.editedContent ?? selectedEditingOutput.content) ?? {};

    let parsed: Record<string, unknown>;

    if (editingOutputType === "MCQ") {
      parsed = {
        ...root,
        mcq_quiz: {
          ...(asRecord(root.mcq_quiz) ?? {}),
          questions: editedMcqQuestions.map((question) => {
            const optionIndex =
              question.correctOption === "A"
                ? 0
                : question.correctOption === "B"
                  ? 1
                  : question.correctOption === "C"
                    ? 2
                    : 3;
            return {
              question: question.question,
              options: question.options,
              correct_answer: question.options[optionIndex] ?? question.options[0] ?? "",
              explanation: question.explanation,
            };
          }),
        },
      };
    } else if (editingOutputType === "ESSAY") {
      parsed = {
        ...root,
        essay_quiz: {
          ...(asRecord(root.essay_quiz) ?? {}),
          questions: editedEssayQuestions.map((question) => ({
            question: question.question,
            expected_points: question.expectedPoints,
          })),
        },
      };
    } else {
      return;
    }

    setSavingOutputId(outputId);
    editOutputMutation.mutate({
      outputId,
      editedContent: parsed,
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to materials
          </Link>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            {isEditMode ? "Material Detail" : "Create Material"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode
              ? classData
                ? `Review material details for ${classData.name} (${classData.classCode}).`
                : "Review material details for this class."
              : classData
              ? `Add a new learning resource for ${classData.name} (${classData.classCode}).`
              : "Create a new learning resource for this class."}
          </p>
          {isEditMode && teacherName ? (
            <p className="text-xs text-muted-foreground">
              Teacher: {teacherName}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Material Information</CardTitle>
            <CardDescription>
              {isEditMode
                ? "Fetched from material detail endpoint."
                : "Fill required fields and save to publish this material."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingClass ? (
              <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
                <Spinner />
                Loading class context...
              </div>
            ) : null}
            {isClassError ? (
              <p className="pb-3 text-sm text-muted-foreground">
                Unable to load class detail. You can still create material for this class ID.
              </p>
            ) : null}
            {isEditMode && isLoadingMaterialDetail ? (
              <div className="flex items-center gap-2 pb-3 text-sm text-muted-foreground">
                <Spinner />
                Loading material detail...
              </div>
            ) : null}
            {isEditMode && isMaterialDetailError ? (
              <p className="pb-3 text-sm text-muted-foreground">
                Unable to load material detail.
              </p>
            ) : null}

            <Form {...form}>
              <form
                onSubmit={
                  isEditMode
                    ? (event) => event.preventDefault()
                    : form.handleSubmit(handleCreate)
                }
                className="grid gap-5 md:grid-cols-2"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter material title"
                          {...field}
                          value={field.value ?? ""}
                          disabled={isEditMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter material description"
                          className="min-h-[140px] resize-none"
                          {...field}
                          value={field.value ?? ""}
                          disabled={isEditMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>File URL *</FormLabel>
                      <FormControl>
                        <UploadField
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          label="Upload material file"
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.mp4,.mov,.mp3,.wav"
                          showValueInput
                          showUploadedUrl={false}
                          showPreview
                          placeholder="Paste a public file URL or upload file"
                          uploadButtonLabel="Upload File"
                          uploadingLabel="Uploading..."
                          successMessage="Material file uploaded successfully."
                          errorMessage="Failed to upload material file."
                          disabled={createMaterialMutation.isPending || isEditMode}
                          validateFile={(file) => {
                            if (file.size > 20 * 1024 * 1024) {
                              return "File size must be 20MB or less.";
                            }
                            return null;
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload a file or paste direct URL that can be accessed by students.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 border-t pt-5 md:col-span-2">
                  {isEditMode ? (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      disabled={deleteMaterialMutation.isPending}
                    >
                      {deleteMaterialMutation.isPending ? "Deleting..." : "Delete Material"}
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(backHref)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMaterialMutation.isPending || isEditMode}
                  >
                    {isEditMode
                      ? "Detail Loaded"
                      : createMaterialMutation.isPending
                        ? "Creating..."
                        : "Create Material"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Guidelines for material upload.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {isEditMode ? (
              <>
                <p>- This page fetches material detail by ID.</p>
                <p>- Only key fields are shown to avoid sensitive exposure.</p>
                <p>- IDs are intentionally not displayed.</p>
              </>
            ) : (
              <>
                <p>- Title and file URL are required fields.</p>
                <p>- Use a direct, publicly accessible file URL.</p>
                <p>- MIME type is inferred automatically from file extension.</p>
              </>
            )}
          </CardContent>
        </Card>

        {isEditMode ? (
          <Card className="h-fit lg:col-span-3">
            <CardHeader>
              <CardTitle>AI Jobs & Outputs</CardTitle>
              <CardDescription>
                Polling every 4 seconds while job(s) are still queued/processing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleTriggerAiJobs(["MCQ"])}
                  disabled={enqueueAiMutation.isPending}
                >
                  {runningAiType === "MCQ" && enqueueAiMutation.isPending
                    ? "Queueing MCQ..."
                    : "Generate MCQ"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleTriggerAiJobs(["ESSAY"])}
                  disabled={enqueueAiMutation.isPending}
                >
                  {runningAiType === "ESSAY" && enqueueAiMutation.isPending
                    ? "Queueing Essay..."
                    : "Generate Essay"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleTriggerAiJobs(["SUMMARY"])}
                  disabled={enqueueAiMutation.isPending}
                >
                  {runningAiType === "SUMMARY" && enqueueAiMutation.isPending
                    ? "Queueing Summary..."
                    : "Generate Summary"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleTriggerAiJobs(["MCQ", "ESSAY", "SUMMARY"])}
                  disabled={enqueueAiMutation.isPending}
                >
                  {runningAiType === "ALL" && enqueueAiMutation.isPending
                    ? "Queueing All..."
                    : "Generate All"}
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Badge variant={hasPendingJobs ? "secondary" : "outline"}>
                  {hasPendingJobs ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      AI jobs in progress
                    </>
                  ) : (
                    "No active AI job"
                  )}
                </Badge>
                <Badge variant="outline">
                  Total jobs: {jobsResponse?.data?.overview?.totalJobs ?? jobsResponse?.data?.jobs?.length ?? 0}
                </Badge>
                <Badge variant="outline">
                  Outputs: {jobsResponse?.data?.overview?.outputCount ?? outputsResponse?.data?.length ?? 0}
                </Badge>
                <Badge variant="outline">
                  Completed: {jobsResponse?.data?.overview?.completedJobs ?? 0}
                </Badge>
              </div>

              {isLoadingJobs ? (
                <p className="text-sm text-muted-foreground">Loading AI jobs...</p>
              ) : isJobsError ? (
                <p className="text-sm text-muted-foreground">Failed to load AI jobs.</p>
              ) : (jobsResponse?.data?.jobs?.length ?? 0) === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No AI jobs found for this material yet.
                </p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {(jobsResponse?.data?.jobs ?? []).map((job) => (
                    <div
                      key={job.id}
                      className="rounded-xl border border-border/60 bg-background/60 p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">{job.type}</p>
                        <Badge variant={getJobStatusBadgeVariant(job.status)}>
                          {getJobStatusLabel(job.status)}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Created: {formatDateTimeLabel(job.createdAt)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Completed: {formatDateTimeLabel(job.completedAt)}
                      </p>
                      {job.lastError ? (
                        <p className="mt-2 inline-flex items-start gap-1.5 text-xs text-destructive">
                          <OctagonAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          {job.lastError}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 border-t pt-4">
                <h3 className="text-sm font-semibold tracking-tight">
                  Output by type
                </h3>
                {isLoadingOutputs ? (
                  <p className="text-sm text-muted-foreground">
                    Loading AI outputs...
                  </p>
                ) : isOutputsError ? (
                  <p className="text-sm text-muted-foreground">
                    Failed to load AI outputs.
                  </p>
                ) : (outputsResponse?.data?.length ?? 0) === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No AI outputs available yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(groupedOutputs).map(([type, items]) => (
                      <div
                        key={type}
                        className="rounded-xl border border-border/60 bg-background/60 p-4"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-medium">{type}</h4>
                          <Badge variant="outline">{items.length} item(s)</Badge>
                        </div>
                        <div className="mt-3 space-y-2">
                          {items.map((output) => (
                            <div
                              key={output.id}
                              className="rounded-lg border border-border/50 bg-background/70 p-3"
                            >
                              <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                {output.isPublished ? "Published" : "Draft"} -{" "}
                                {formatDateTimeLabel(output.createdAt)}
                              </p>
                              <p className="mt-1 line-clamp-3 text-sm text-foreground/90">
                                {getOutputPreview(output)}
                              </p>

                              <div className="mt-3 flex flex-wrap gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => startEditOutput(output)}
                                  disabled={output.type !== "MCQ" && output.type !== "ESSAY"}
                                >
                                  Edit Output
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={output.isPublished ? "outline" : "default"}
                                  disabled={publishOutputMutation.isPending}
                                  onClick={() => {
                                    setPublishingOutputId(output.id);
                                    publishOutputMutation.mutate({
                                      outputId: output.id,
                                      publish: !output.isPublished,
                                    });
                                  }}
                                >
                                  {publishingOutputId === output.id &&
                                  publishOutputMutation.isPending
                                    ? "Saving..."
                                    : output.isPublished
                                      ? "Unpublish"
                                      : "Publish"}
                                </Button>
                                {output.type === "MCQ" || output.type === "ESSAY" ? (
                                  <Button
                                    type="button"
                                    size="sm"
                                    disabled={createAssignmentFromOutputMutation.isPending}
                                    onClick={() => {
                                      setCreatingAssignmentOutputId(output.id);
                                      createAssignmentFromOutputMutation.mutate({
                                        outputId: output.id,
                                        status: "DRAFT",
                                      });
                                    }}
                                  >
                                    {creatingAssignmentOutputId === output.id &&
                                    createAssignmentFromOutputMutation.isPending
                                      ? "Creating..."
                                      : "Create Assignment"}
                                  </Button>
                                ) : null}
                              </div>

                              {editingOutputId === output.id ? (
                                <div className="mt-3 space-y-2 rounded-md border border-border/60 p-3">
                                  {editingOutputType === "MCQ" ? (
                                    <div className="space-y-3">
                                      <p className="text-xs text-muted-foreground">
                                        Edit MCQ content using structured fields.
                                      </p>
                                      <div className="flex items-center gap-2 text-xs">
                                        <Badge variant={mcqInvalidIndexes.length === 0 ? "default" : "secondary"}>
                                          {mcqValidCount}/{editedMcqQuestions.length} questions valid
                                        </Badge>
                                      </div>
                                      <Accordion
                                        type="multiple"
                                        className="rounded-md border border-border/60 px-3"
                                      >
                                        {editedMcqQuestions.map((question, questionIndex) => {
                                          const isInvalid = mcqInvalidIndexes.includes(questionIndex);
                                          return (
                                            <AccordionItem
                                              key={question.id}
                                              value={`${question.id}-${questionIndex}`}
                                            >
                                              <AccordionTrigger className="hover:no-underline">
                                                <span className="flex items-center gap-2">
                                                  <span>Question {questionIndex + 1}</span>
                                                  <Badge
                                                    variant={isInvalid ? "destructive" : "outline"}
                                                    className="text-[10px]"
                                                  >
                                                    {isInvalid ? "Incomplete" : "Valid"}
                                                  </Badge>
                                                </span>
                                              </AccordionTrigger>
                                              <AccordionContent className="space-y-3">
                                                <Input
                                                  value={question.question}
                                                  onChange={(event) =>
                                                    setEditedMcqQuestions((prev) =>
                                                      prev.map((item, itemIndex) =>
                                                        itemIndex === questionIndex
                                                          ? { ...item, question: event.target.value }
                                                          : item,
                                                      ),
                                                    )
                                                  }
                                                  placeholder={`Question ${questionIndex + 1}`}
                                                />
                                                <div className="grid gap-2 md:grid-cols-2">
                                                  {question.options.map((option, optionIndex) => (
                                                    <Input
                                                      key={`${question.id}-option-${optionIndex}`}
                                                      value={option}
                                                      onChange={(event) =>
                                                        setEditedMcqQuestions((prev) =>
                                                          prev.map((item, itemIndex) => {
                                                            if (itemIndex !== questionIndex) return item;
                                                            const nextOptions = [...item.options] as [
                                                              string,
                                                              string,
                                                              string,
                                                              string,
                                                            ];
                                                            nextOptions[optionIndex] = event.target.value;
                                                            return { ...item, options: nextOptions };
                                                          }),
                                                        )
                                                      }
                                                      placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                                    />
                                                  ))}
                                                </div>
                                                <div className="grid gap-2 md:grid-cols-[180px_minmax(0,1fr)]">
                                                  <Select
                                                    value={question.correctOption}
                                                    onValueChange={(value) =>
                                                      setEditedMcqQuestions((prev) =>
                                                        prev.map((item, itemIndex) =>
                                                          itemIndex === questionIndex
                                                            ? {
                                                                ...item,
                                                                correctOption: value as "A" | "B" | "C" | "D",
                                                              }
                                                            : item,
                                                        ),
                                                      )
                                                    }
                                                  >
                                                    <SelectTrigger>
                                                      <SelectValue placeholder="Correct option" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="A">Correct: A</SelectItem>
                                                      <SelectItem value="B">Correct: B</SelectItem>
                                                      <SelectItem value="C">Correct: C</SelectItem>
                                                      <SelectItem value="D">Correct: D</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                  <Input
                                                    value={question.explanation}
                                                    onChange={(event) =>
                                                      setEditedMcqQuestions((prev) =>
                                                        prev.map((item, itemIndex) =>
                                                          itemIndex === questionIndex
                                                            ? { ...item, explanation: event.target.value }
                                                            : item,
                                                        ),
                                                      )
                                                    }
                                                    placeholder="Explanation (optional)"
                                                  />
                                                </div>
                                                <div className="flex justify-end">
                                                  <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                      setEditedMcqQuestions((prev) =>
                                                        prev.length > 1
                                                          ? prev.filter((_, itemIndex) => itemIndex !== questionIndex)
                                                          : prev,
                                                      )
                                                    }
                                                    disabled={editedMcqQuestions.length <= 1}
                                                  >
                                                    Remove Question
                                                  </Button>
                                                </div>
                                              </AccordionContent>
                                            </AccordionItem>
                                          );
                                        })}
                                      </Accordion>
                                      {mcqInvalidIndexes.length > 0 ? (
                                        <p className="text-xs text-destructive">
                                          Complete all required fields for each MCQ question before saving.
                                        </p>
                                      ) : null}
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          setEditedMcqQuestions((prev) => [
                                            ...prev,
                                            {
                                              id: `mcq-${prev.length + 1}`,
                                              question: "",
                                              options: ["", "", "", ""],
                                              correctOption: "A",
                                              explanation: "",
                                            },
                                          ])
                                        }
                                      >
                                        Add MCQ Question
                                      </Button>
                                    </div>
                                  ) : editingOutputType === "ESSAY" ? (
                                    <div className="space-y-3">
                                      <p className="text-xs text-muted-foreground">
                                        Edit essay content using structured fields.
                                      </p>
                                      <div className="flex items-center gap-2 text-xs">
                                        <Badge variant={essayInvalidIndexes.length === 0 ? "default" : "secondary"}>
                                          {essayValidCount}/{editedEssayQuestions.length} questions valid
                                        </Badge>
                                      </div>
                                      <Accordion
                                        type="multiple"
                                        className="rounded-md border border-border/60 px-3"
                                      >
                                        {editedEssayQuestions.map((question, questionIndex) => {
                                          const isInvalid = essayInvalidIndexes.includes(questionIndex);
                                          return (
                                            <AccordionItem
                                              key={question.id}
                                              value={`${question.id}-${questionIndex}`}
                                            >
                                              <AccordionTrigger className="hover:no-underline">
                                                <span className="flex items-center gap-2">
                                                  <span>Question {questionIndex + 1}</span>
                                                  <Badge
                                                    variant={isInvalid ? "destructive" : "outline"}
                                                    className="text-[10px]"
                                                  >
                                                    {isInvalid ? "Incomplete" : "Valid"}
                                                  </Badge>
                                                </span>
                                              </AccordionTrigger>
                                              <AccordionContent className="space-y-3">
                                                <Input
                                                  value={question.question}
                                                  onChange={(event) =>
                                                    setEditedEssayQuestions((prev) =>
                                                      prev.map((item, itemIndex) =>
                                                        itemIndex === questionIndex
                                                          ? { ...item, question: event.target.value }
                                                          : item,
                                                      ),
                                                    )
                                                  }
                                                  placeholder={`Essay question ${questionIndex + 1}`}
                                                />
                                                <Textarea
                                                  value={question.expectedPoints}
                                                  onChange={(event) =>
                                                    setEditedEssayQuestions((prev) =>
                                                      prev.map((item, itemIndex) =>
                                                        itemIndex === questionIndex
                                                          ? { ...item, expectedPoints: event.target.value }
                                                          : item,
                                                      ),
                                                    )
                                                  }
                                                  placeholder="Expected points / answer guide"
                                                  className="min-h-[100px]"
                                                />
                                                <div className="flex justify-end">
                                                  <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                      setEditedEssayQuestions((prev) =>
                                                        prev.length > 1
                                                          ? prev.filter((_, itemIndex) => itemIndex !== questionIndex)
                                                          : prev,
                                                      )
                                                    }
                                                    disabled={editedEssayQuestions.length <= 1}
                                                  >
                                                    Remove Question
                                                  </Button>
                                                </div>
                                              </AccordionContent>
                                            </AccordionItem>
                                          );
                                        })}
                                      </Accordion>
                                      {essayInvalidIndexes.length > 0 ? (
                                        <p className="text-xs text-destructive">
                                          Complete all required fields for each essay question before saving.
                                        </p>
                                      ) : null}
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          setEditedEssayQuestions((prev) => [
                                            ...prev,
                                            {
                                              id: `essay-${prev.length + 1}`,
                                              question: "",
                                              expectedPoints: "",
                                            },
                                          ])
                                        }
                                      >
                                        Add Essay Question
                                      </Button>
                                    </div>
                                  ) : (
                                    <p className="text-xs text-muted-foreground">
                                      Form editor is available for MCQ and ESSAY output only.
                                    </p>
                                  )}
                                  <div className="flex gap-2">
                                    <Button
                                      type="button"
                                      size="sm"
                                      onClick={() => saveEditedOutput(output.id)}
                                      disabled={!canSaveEditedOutput || editOutputMutation.isPending}
                                    >
                                      {savingOutputId === output.id &&
                                      editOutputMutation.isPending
                                        ? "Saving..."
                                        : "Save Edit"}
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setEditingOutputId(null);
                                        setEditingOutputType(null);
                                        setEditedMcqQuestions([]);
                                        setEditedEssayQuestions([]);
                                      }}
                                      disabled={editOutputMutation.isPending}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete this material?"
        description="This action will permanently remove the material and related AI jobs/outputs."
        confirmText={deleteMaterialMutation.isPending ? "Deleting..." : "Delete Material"}
        onConfirm={handleDeleteMaterial}
      />
    </section>
  );
}
