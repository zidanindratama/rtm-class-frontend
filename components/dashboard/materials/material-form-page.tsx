"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGetData } from "@/hooks/use-get-data";
import { usePostData } from "@/hooks/use-post-data";
import { UploadField } from "@/components/globals/upload/upload-field";
import { Button } from "@/components/ui/button";
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
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ClassDetailResponse } from "@/components/dashboard/classes/class-types";
import { APISingleResponse } from "@/types/api-response";
import {
  CreateMaterialPayload,
  MaterialDetailResponse,
  MaterialCreateResponse,
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

export function MaterialFormPage(props: MaterialFormPageProps) {
  const { classId } = props;
  const isEditMode = props.mode === "edit";
  const materialId = isEditMode ? props.materialId : undefined;
  const router = useRouter();
  const backHref = `/dashboard/my-class/${classId}/materials`;

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

    form.reset({
      title: materialDetailResponse.data.title ?? "",
      description: materialDetailResponse.data.description ?? "",
      fileUrl: materialDetailResponse.data.sourceUrl ?? "",
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

  const classData = classDetailResponse?.data;
  const materialData = materialDetailResponse?.data;

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
          {isEditMode && materialData?.teacher?.fullName ? (
            <p className="text-xs text-muted-foreground">
              Teacher: {materialData.teacher.fullName}
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
      </div>
    </section>
  );
}
