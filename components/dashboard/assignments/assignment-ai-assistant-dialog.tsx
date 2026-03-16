"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FileText, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios-instance";
import { APIListResponse, APISingleResponse } from "@/types/api-response";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { ASSIGNMENT_TYPE_LABELS } from "./assignment-types";
import {
  type AiTransformJob,
  type AiTransformJobType,
  type AiTransformResponse,
  type AssignmentAiDraft,
  type MaterialAiOutput,
  mapAiOutputToAssignmentDraft,
} from "./assignment-ai-utils";

type AssignmentAiAssistantDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string;
  onApplyDraft: (draft: AssignmentAiDraft) => boolean;
};

type AssignmentAiTargetType = "QUIZ_MCQ" | "QUIZ_ESSAY";

type SourceMaterialOption = {
  id: string;
  title: string;
  description: string | null;
  fileUrl?: string | null;
  sourceUrl?: string | null;
  fileMimeType?: string | null;
  type?: string | null;
  createdAt?: string;
};

const MATERIALS_PAGE_SIZE = 100;
const JOB_POLL_INTERVAL_MS = 3000;
const JOB_POLL_MAX_ATTEMPTS = 40;
const OUTPUT_FETCH_RETRIES = 5;
const OUTPUT_FETCH_INTERVAL_MS = 2000;

const sleep = (delayMs: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, delayMs);
  });

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  return "Failed to generate AI assignment draft.";
};

const getMaterialFileUrl = (material: SourceMaterialOption) =>
  material.fileUrl?.trim() || material.sourceUrl?.trim() || "";

const getMaterialTypeLabel = (material: SourceMaterialOption) =>
  material.type?.trim().toUpperCase() || "";

const hasSupportedMaterialExtension = (fileUrl: string) => {
  const normalized = fileUrl.trim().toLowerCase();
  const pathname = (() => {
    try {
      return new URL(normalized).pathname;
    } catch {
      return normalized;
    }
  })();

  return pathname.endsWith(".pdf") || pathname.endsWith(".txt") || pathname.endsWith(".pptx");
};

const hasSupportedMaterialMimeType = (fileMimeType: string | null | undefined) => {
  const normalized = fileMimeType?.trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  return (
    normalized.includes("application/pdf")
    || normalized.startsWith("text/plain")
    || normalized.includes("application/vnd.openxmlformats-officedocument.presentationml.presentation")
  );
};

const isLikelyAiSupportedMaterial = (material: SourceMaterialOption) => {
  const materialUrl = getMaterialFileUrl(material);
  const materialType = getMaterialTypeLabel(material);

  return (
    hasSupportedMaterialExtension(materialUrl)
    || hasSupportedMaterialMimeType(material.fileMimeType)
    || materialType === "PDF"
    || materialType === "TXT"
    || materialType === "PPTX"
  );
};

const describeMaterialSource = (material: SourceMaterialOption) => {
  const normalizedMimeType = material.fileMimeType?.trim();
  if (normalizedMimeType) {
    return normalizedMimeType;
  }

  const materialType = getMaterialTypeLabel(material);
  if (materialType) {
    return materialType;
  }

  const normalizedUrl = getMaterialFileUrl(material).toLowerCase();
  if (normalizedUrl.endsWith(".pdf")) return "application/pdf";
  if (normalizedUrl.endsWith(".txt")) return "text/plain";
  if (normalizedUrl.endsWith(".pptx")) {
    return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  }

  return "Stored class material";
};

export function AssignmentAiAssistantDialog({
  open,
  onOpenChange,
  classId,
  onApplyDraft,
}: AssignmentAiAssistantDialogProps) {
  const [assignmentType, setAssignmentType] = useState<AssignmentAiTargetType>("QUIZ_MCQ");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [questionCount, setQuestionCount] = useState("10");
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [processingStage, setProcessingStage] = useState("");

  const materialsQuery = useQuery({
    queryKey: ["assignment-ai-assistant", "materials", classId],
    enabled: open,
    staleTime: 60_000,
    queryFn: async () => {
      const response = await axiosInstance.get<APIListResponse<SourceMaterialOption>>("/materials", {
        params: {
          classId,
          page: 1,
          per_page: MATERIALS_PAGE_SIZE,
          sort_by: "title",
          sort_order: "asc",
        },
      });

      return response.data;
    },
  });

  const materials = materialsQuery.data?.data ?? [];
  const selectedMaterial = materials.find((material) => material.id === selectedMaterialId) ?? null;

  const assistantMutation = useMutation<AssignmentAiDraft, Error, void>({
    mutationFn: async () => {
      if (!selectedMaterial) {
        throw new Error("Source material is required.");
      }

      const trimmedTitle = assignmentTitle.trim();
      if (trimmedTitle.length < 3) {
        throw new Error("Assignment title must be at least 3 characters.");
      }

      const parsedQuestionCount = Number(questionCount);
      if (!Number.isInteger(parsedQuestionCount) || parsedQuestionCount < 1 || parsedQuestionCount > 100) {
        throw new Error("Question count must be between 1 and 100.");
      }

      const outputType: AiTransformJobType = assignmentType === "QUIZ_MCQ" ? "MCQ" : "ESSAY";

      setProcessingStage("Queueing AI job...");
      const transformResponse = await axiosInstance.post<APISingleResponse<AiTransformResponse>>(
        "/ai/jobs/transform",
        {
          materialId: selectedMaterial.id,
          outputs: [outputType],
          options:
            outputType === "MCQ"
              ? { mcqCount: parsedQuestionCount }
              : { essayCount: parsedQuestionCount },
        },
      );

      const createdJob = transformResponse.data.data.jobs.find((job) => job.type === outputType);
      if (!createdJob) {
        throw new Error("AI job was queued but no matching job was returned.");
      }

      const job = await pollUntilJobTerminal(createdJob.id);
      if (job.status !== "succeeded") {
        throw new Error(job.lastError?.trim() || "AI job failed.");
      }

      const output = await fetchMaterialOutput(selectedMaterial.id, createdJob.id, outputType);

      return mapAiOutputToAssignmentDraft({
        output,
        assignmentTitle: trimmedTitle,
        materialId: selectedMaterial.id,
        sourceMaterialTitle: selectedMaterial.title,
        sourceMaterialUrl: getMaterialFileUrl(selectedMaterial),
      });
    },
    onSuccess: (draft) => {
      const applied = onApplyDraft(draft);
      if (!applied) {
        return;
      }

      toast.success("AI draft applied to assignment form.");
      resetDialogState();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const resetDialogState = () => {
    setAssignmentType("QUIZ_MCQ");
    setAssignmentTitle("");
    setQuestionCount("10");
    setSelectedMaterialId("");
    setProcessingStage("");
    assistantMutation.reset();
  };

  async function pollUntilJobTerminal(jobId: string) {
    for (let attempt = 0; attempt < JOB_POLL_MAX_ATTEMPTS; attempt += 1) {
      const jobResponse = await axiosInstance.get<APISingleResponse<AiTransformJob>>(`/ai/jobs/${jobId}`);
      const job = jobResponse.data.data;

      if (job.status === "accepted") {
        setProcessingStage("Waiting for AI worker...");
      }

      if (job.status === "processing") {
        setProcessingStage("AI is generating assignment draft...");
      }

      if (
        job.status === "succeeded"
        || job.status === "failed_processing"
        || job.status === "failed_delivery"
      ) {
        return job;
      }

      await sleep(JOB_POLL_INTERVAL_MS);
    }

    throw new Error("Timed out while waiting for AI job completion.");
  }

  async function fetchMaterialOutput(
    materialId: string,
    jobId: string,
    outputType: AiTransformJobType,
  ) {
    setProcessingStage("Fetching generated output...");

    for (let attempt = 0; attempt < OUTPUT_FETCH_RETRIES; attempt += 1) {
      const outputsResponse = await axiosInstance.get<APISingleResponse<MaterialAiOutput[]>>(
        `/materials/${materialId}/outputs`,
      );
      const outputs = outputsResponse.data.data ?? [];
      const matchedOutput = outputs.find((output) => output.jobId === jobId)
        ?? outputs.find((output) => output.job?.id === jobId)
        ?? outputs.find((output) => output.type === outputType);

      if (matchedOutput) {
        return matchedOutput;
      }

      await sleep(OUTPUT_FETCH_INTERVAL_MS);
    }

    throw new Error("AI job succeeded but no output was saved yet.");
  }

  const pending = assistantMutation.isPending;

  const closeDialog = () => {
    if (pending) {
      return;
    }

    resetDialogState();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (pending) {
          return;
        }

        if (!nextOpen) {
          closeDialog();
          return;
        }

        onOpenChange(true);
      }}
    >
      <DialogContent className="max-w-2xl" showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle className="inline-flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Assignment Assistant
          </DialogTitle>
          <DialogDescription>
            Select an existing class material, then let AI prepare a quiz draft from the stored source file.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <div className="space-y-2">
            <Label htmlFor="ai-source-material">Source Material</Label>
            <Select
              value={selectedMaterialId}
              onValueChange={(value) => {
                setSelectedMaterialId(value);

                const material = materials.find((item) => item.id === value);
                if (material) {
                  setAssignmentTitle(material.title);
                }
              }}
              disabled={pending || materialsQuery.isLoading || materials.length === 0}
            >
              <SelectTrigger id="ai-source-material">
                <SelectValue placeholder="Choose class material" />
              </SelectTrigger>
              <SelectContent>
                {materials.map((material) => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Materials are loaded from this class. AI works best with PDF, TXT, or PPTX sources.
            </p>
          </div>

          {materialsQuery.isLoading ? (
            <div className="rounded-lg border border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
              Loading class materials...
            </div>
          ) : null}

          {materialsQuery.isError ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
              Failed to load class materials.
            </div>
          ) : null}

          {!materialsQuery.isLoading && !materialsQuery.isError && materials.length === 0 ? (
            <div className="rounded-lg border border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
              No class material found yet. Add a material in this class first.
            </div>
          ) : null}

          {selectedMaterial ? (
            <div className="rounded-lg border border-border/70 bg-muted/20 p-3 text-sm">
              <div className="inline-flex items-center gap-2 font-medium">
                <FileText className="h-4 w-4" />
                {selectedMaterial.title}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {describeMaterialSource(selectedMaterial)}
              </p>
              {selectedMaterial.description ? (
                <p className="mt-2 text-xs text-muted-foreground">{selectedMaterial.description}</p>
              ) : null}
              {!isLikelyAiSupportedMaterial(selectedMaterial) ? (
                <p className="mt-2 text-xs text-amber-600">
                  This material does not expose a clear PDF, TXT, or PPTX hint. Backend processing may fail if the
                  stored source file is unsupported.
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ai-assignment-type">Draft Type</Label>
              <Select
                value={assignmentType}
                onValueChange={(value) => {
                  const nextType = value as AssignmentAiTargetType;
                  setAssignmentType(nextType);
                  setQuestionCount(nextType === "QUIZ_MCQ" ? "10" : "5");
                }}
                disabled={pending}
              >
                <SelectTrigger id="ai-assignment-type">
                  <SelectValue placeholder="Choose assignment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="QUIZ_MCQ">{ASSIGNMENT_TYPE_LABELS.QUIZ_MCQ}</SelectItem>
                  <SelectItem value="QUIZ_ESSAY">{ASSIGNMENT_TYPE_LABELS.QUIZ_ESSAY}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai-question-count">Question Count</Label>
              <Input
                id="ai-question-count"
                type="number"
                min={1}
                max={100}
                value={questionCount}
                onChange={(event) => setQuestionCount(event.target.value)}
                disabled={pending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-assignment-title">Assignment Title</Label>
            <Input
              id="ai-assignment-title"
              value={assignmentTitle}
              onChange={(event) => setAssignmentTitle(event.target.value)}
              placeholder="Example: Quiz Bab 1 Aljabar"
              disabled={pending}
            />
          </div>

          {pending ? (
            <div className="space-y-3 rounded-lg border border-border/70 bg-muted/20 p-4">
              <div className="inline-flex items-center gap-2 text-sm font-medium">
                <Spinner />
                {processingStage || "Preparing AI draft..."}
              </div>
              {selectedMaterial ? (
                <p className="text-xs text-muted-foreground">
                  Source material: <span className="font-medium text-foreground">{selectedMaterial.title}</span>
                </p>
              ) : null}
            </div>
          ) : null}

          {assistantMutation.error ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              {getErrorMessage(assistantMutation.error)}
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={closeDialog}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => assistantMutation.mutate()}
            disabled={pending || materialsQuery.isLoading || materialsQuery.isError || !selectedMaterialId}
          >
            {pending ? (
              <>
                <Spinner className="h-4 w-4" />
                Processing...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Generate Draft
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
